# Hướng dẫn tích hợp OAuth2 cho React

## 1. Luồng tổng quan

```
Login page → POST /login → session
                          → redirect /oauth2/authorize (PKCE) → code
                                                              → POST /oauth2/token → access_token + refresh_token
                                                                                    → gọi API với Bearer token
                                                                                    → hết hạn → refresh
```

## 2. Thông tin kết nối

| Key | Value |
|-----|-------|
| Authorization Server | `http://localhost:8080` |
| Key | Value |
|-----|-------|
| Authorization Server | `http://localhost:8080` |
| Client ID | `react-client` |
| Grant Type | `authorization_code` + PKCE |
| Redirect URI | `http://localhost:5173/callback` |
| Redirect URI | `http://localhost:5173/callback` |

CORS đã cho phép origin `http://localhost:5173` và `http://127.0.0.1:5173`, credentials = true.

## 3. Các API

### 3.1. Login

```typescript
// POST http://localhost:8080/login
const res = await fetch('http://localhost:8080/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ username, password }),
  credentials: 'include', // ← quan trọng: gửi/nhận cookie
})

// 200: { "status": "ok", "message": "Login successful" }
// 401: { "status": "error", "message": "Invalid credentials" }
```

Sau login, server trả về `Set-Cookie: JSESSIONID=...` — React lưu tự động qua `credentials: 'include'`.

### 3.2. Lấy token (Authorization Code + PKCE)

```typescript
// Sinh PKCE code_verifier và code_challenge
function base64URLEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

async function generatePKCE() {
  const verifier = base64URLEncode(crypto.getRandomValues(new Uint8Array(48)))
  const challenge = base64URLEncode(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  )
  return { verifier, challenge }
}

// Lưu verifier vào sessionStorage, redirect lên authorize endpoint
const { verifier, challenge } = await generatePKCE()
sessionStorage.setItem('pkce_verifier', verifier)

const params = new URLSearchParams({
  response_type: 'code',
  client_id: 'react-client',
  redirect_uri: 'http://localhost:5173/callback',
  code_challenge: challenge,
  code_challenge_method: 'S256',
})

window.location.href = `http://localhost:8080/oauth2/authorize?${params}`
```

### 3.3. Callback page — đổi code lấy token

Trang `/callback` trên React:

```typescript
// http://localhost:5173/callback?code=xxx
const code = new URLSearchParams(window.location.search).get('code')
const verifier = sessionStorage.getItem('pkce_verifier')

const res = await fetch('http://localhost:8080/oauth2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: 'react-client',
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'http://localhost:5173/callback',
    code_verifier: verifier,
  }),
})

// Lưu token vào memory (biến, state, không localStorage)
storeTokens(tokens.access_token, tokens.refresh_token)
window.history.replaceState({}, '', '/') // xoá code khỏi URL
```

**Lưu ý**: access_token chỉ nên lưu trong memory (variable, React state, Zustand...). Không lưu localStorage — dễ bị XSS đánh cắp.

### 3.4. Gọi API protected

```typescript
async function callAPI(url: string) {
  const token = getAccessToken() // từ memory
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  })

  if (res.status === 401) {
    // Token hết hạn → refresh
    const newToken = await refreshToken()
    if (!newToken) {
      // Refresh hết hạn → logout
      redirectLogin()
      return
    }
    // Thử lại với token mới
    return callAPI(url)
  }

  return res.json()
}
```

### 3.5. Refresh token (rotation)

Khi refresh, **refresh token cũ bị vô hiệu hóa**, server cấp refresh token mới.

```typescript
async function refreshToken(): Promise<string | null> {
  const oldRefreshToken = getRefreshToken()
  if (!oldRefreshToken) return null

  const res = await fetch('http://localhost:8080/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: 'react-client',
      grant_type: 'refresh_token',
      refresh_token: oldRefreshToken,
    }),
  })

  if (!res.ok) return null

  const tokens = await res.json()
  // Refresh token cũ không dùng được nữa, lưu cái mới
  storeTokens(tokens.access_token, tokens.refresh_token)
  return tokens.access_token
}
```

**Refresh token sống 30 ngày**. Rotation bảo vệ: nếu hacker lấy được refresh token cũ, nó đã bị vô hiệu sau lần refresh đầu tiên.

### 3.6. Logout (Revoke token + xóa session)

```typescript
async function logout() {
  const refreshToken = getRefreshToken()
  const accessToken = getAccessToken()

  // Gửi 1 trong 2 token, server sẽ xóa cả authorization + session
  await fetch('http://localhost:8080/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'include',
    body: new URLSearchParams({
      refreshToken: refreshToken || '',
      accessToken: accessToken || '',
    }),
  })

  clearTokens()
  window.location.href = 'http://localhost:5173/login'
}
```

### 3.7. User Info

```typescript
const res = await fetch('http://localhost:8080/api/userinfo', {
  headers: { 'Authorization': `Bearer ${accessToken}` },
})
const user = await res.json()
// {
//   username: 'admin',
//   email: 'admin@example.com',
//   roles: ['ROLE_ADMIN'],
//   attributes: { sub: 'admin', email: '...', roles: [...] }
// }
```

## 4. Tóm tắt luồng

```
Login form → POST /login (credentials: include)
          → session cookie tự động lưu
          → PKCE + redirect → /oauth2/authorize
          → callback → code → POST /oauth2/token
          → access_token (1h) + refresh_token (30 ngày)
          → gọi API (Authorization: Bearer)
          → 401 → refresh → token mới → retry
          → refresh hết hạn → logout
```

## 5. Lưu ý bảo mật

- **Access token**: lưu memory (variable, không localStorage/sessionStorage)
- **Refresh token**: lưu memory (tương tự)
- **CORS**: credentials: 'include' khi gọi login
- **Client là public** — không dùng secret, PKCE code_challenge bảo vệ authorization code flow.
