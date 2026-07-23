import { useCart } from '../stores/cartStore'

const products = [
  { id: 1, name: 'Wireless Mouse', price: 25 },
  { id: 2, name: 'Mechanical Keyboard', price: 89 },
  { id: 3, name: 'USB-C Hub', price: 45 },
  { id: 4, name: '27" Monitor', price: 299 },
  { id: 5, name: 'Webcam HD', price: 65 },
]

export default function Products() {
  const { items, add, remove } = useCart()

  function getQty(id: number) {
    return items.find((i) => i.id === id)?.qty || 0
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Products</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {products.map((p) => {
          const qty = getQty(p.id)
          return (
            <div
              key={p.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#fff', padding: '12px 20px', borderRadius: 8,
                border: '1px solid #e5e4e7',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: '#6b6375' }}>${p.price}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => remove(p.id)}
                  style={{
                    width: 32, height: 32, borderRadius: 6, border: '1px solid #d1d5db',
                    background: '#fff', cursor: 'pointer', fontSize: 16,
                    opacity: qty === 0 ? 0.3 : 1,
                  }}
                  disabled={qty === 0}
                >−</button>
                <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 600 }}>
                  {qty}
                </span>
                <button
                  onClick={() => add(p.id, p.name, p.price)}
                  style={{
                    width: 32, height: 32, borderRadius: 6, border: 'none',
                    background: '#4f46e5', color: '#fff', cursor: 'pointer', fontSize: 16,
                  }}
                >+</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
