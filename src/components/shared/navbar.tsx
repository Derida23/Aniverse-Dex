import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Bookmark, Star, Calendar, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'
import { LanguageSwitcher } from './language-switcher'

const navItems = [
  { to: '/', labelKey: 'nav.home', icon: Home },
  { to: '/search', labelKey: 'nav.search', icon: Search },
  { to: '/watchlist', labelKey: 'nav.watchlist', icon: Bookmark },
  { to: '/recommendations', labelKey: 'nav.forYou', icon: Star },
  { to: '/seasonal', labelKey: 'nav.seasonal', icon: Calendar },
]

export function Navbar() {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  return (
    <>
      {/* Desktop: floating bottom bar */}
      <nav className="fixed bottom-6 left-1/2 z-50 hidden -translate-x-1/2 md:block">
        <div className="flex h-14 items-center gap-1 rounded-2xl border border-border/50 bg-background/80 px-2 shadow-lg shadow-black/10 backdrop-blur-xl dark:bg-background/70 dark:shadow-black/30">
          {navItems.map(({ to, labelKey, icon: Icon }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {isActive && <span className="whitespace-nowrap">{t(labelKey)}</span>}
              </Link>
            )
          })}

          <div className="mx-1 h-6 w-px bg-border/50" />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile: floating bottom bar (compact) */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <div className="flex h-16 items-center justify-around rounded-2xl border border-border/50 bg-background/80 px-1 shadow-lg shadow-black/10 backdrop-blur-xl dark:bg-background/70 dark:shadow-black/30">
          {navItems.map(({ to, labelKey, icon: Icon }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 transition-all',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg transition-all',
                    isActive && 'bg-primary/15',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium leading-none">{t(labelKey)}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
