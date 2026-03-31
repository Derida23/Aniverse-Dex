import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar'

export function RootLayout() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pb-28 pt-6 md:pb-24">
          <Outlet />
        </div>
      </main>
      <Navbar />
    </>
  )
}
