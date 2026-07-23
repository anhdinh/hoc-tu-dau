import { createContext, useContext } from 'react'
import { useRouteLoaderData } from 'react-router-dom'

export type User = {
  id?: string
  username: string
  email: string
  avatar?: string
  enabled?: boolean
  dateOfBirth?: string
  gender?: string
  roles?: string[]
  createdAt?: string
}

const UserContext = createContext<User | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData('root') as User | null

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}
