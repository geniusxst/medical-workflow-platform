import { NavLink, useLocation } from 'react-router-dom'
import { ExternalLink, Moon, Sun } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { useClipboard } from '@/hooks/useClipboard'
import { useTheme } from '@/hooks/useTheme'

const SHARE_LINK = 'https://ythub.work/flow/feixin-027'

const navItems = [
  { to: '/', label: '工作流运行台' },
  { to: '/compliance', label: '合规体系总览' },
]

export default function Header() {
  const { showToast } = useToast()
  const { copy } = useClipboard()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const handleShare = () => {
    copy(SHARE_LINK).then((ok) => {
      showToast(ok ? '分享链接已复制，可发给他人使用' : '复制失败，请手动复制')
    })
  }

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden
            className="w-8 h-8 rounded-lg shrink-0"
            style={{
              backgroundColor: 'var(--primary)',
              backgroundImage:
                'linear-gradient(var(--primary-foreground),var(--primary-foreground)),linear-gradient(var(--primary-foreground),var(--primary-foreground))',
              backgroundSize: '60% 18%, 18% 60%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <span
            className="text-base font-semibold truncate"
            style={{ color: 'var(--foreground)' }}
          >
            中西医执医内容合规生成工作流
          </span>
        </div>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {navItems.map((item) => {
            const active =
              item.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.to)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
                style={
                  active
                    ? {
                        color: 'var(--primary)',
                        backgroundColor: 'var(--accent)',
                      }
                    : { color: 'var(--muted-foreground)' }
                }
              >
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Right: Theme toggle + Share + Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'var(--card)',
            }}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] border transition-colors"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              backgroundColor: 'var(--card)',
            }}
          >
            <ExternalLink size={14} />
            分享链接
          </button>
          <span
            aria-label="用户头像"
            className="w-8 h-8 rounded-full inline-flex items-center justify-center text-[13px] font-semibold shrink-0"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            有
          </span>
        </div>
      </div>
    </header>
  )
}
