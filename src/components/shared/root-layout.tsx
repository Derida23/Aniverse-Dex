import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 pb-28 pt-6 md:pb-24">
        <Outlet />
      </main>
      <Navbar />
    </div>
  )
}
