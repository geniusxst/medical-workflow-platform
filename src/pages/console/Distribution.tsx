import { ExternalLink, SendHorizontal } from 'lucide-react'
import { useClipboard } from '@/hooks/useClipboard'
import { useToast } from '@/hooks/useToast'
import type { DistributionContent } from '@/types/memory'

interface DistributionProps {
  content: DistributionContent
  loading?: boolean
}

export default function Distribution({ content, loading }: DistributionProps) {
  const { copy } = useClipboard()
  const { showToast } = useToast()

  const handleXhs = () => {
    copy(content.xiaohongshu).then(() => {
      showToast('小红书文案已复制到剪贴板')
    })
  }

  const handleGzh = () => {
    copy(content.wechat).then(() => {
      showToast('公众号文案已复制到剪贴板')
    })
  }

  const handleCopyLink = () => {
    copy(content.shareLink).then(() => {
      showToast('链接已复制，可分享给他人使用')
    })
  }

  const handleCopyInput = () => {
    copy(content.shareLink).then(() => {
      showToast('链接已复制')
    })
  }

  if (loading) {
    return (
      <section
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
        }}
      >
        <header
          className="px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2
            className="m-0 text-base font-semibold"
            style={{ color: 'var(--foreground)' }}
          >
            多平台分发
          </h2>
        </header>
        <div className="p-5 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 h-9 bg-muted rounded-lg animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
            <div className="flex-1 h-9 bg-muted rounded-lg animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
            <div className="flex-1 h-9 bg-muted rounded-lg animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
          </div>
          <div className="h-9 bg-muted rounded-lg animate-pulse" style={{ backgroundColor: 'var(--muted)' }} />
        </div>
      </section>
    )
  }

  return (
    <section
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
      }}
    >
      <header
        className="px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h2
          className="m-0 text-base font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          多平台分发
        </h2>
      </header>

      <div className="p-5">
        <div className="flex gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={handleXhs}
              className="h-9 rounded-lg text-[13px] font-semibold inline-flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: 'var(--chart-2)',
                color: 'var(--primary-foreground)',
                border: 'none',
              }}
            >
              <SendHorizontal size={14} />
              发布到小红书
            </button>
            <span
              className="text-[11px] text-center"
              style={{ color: 'var(--muted-foreground)' }}
            >
              图文+速记图
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={handleGzh}
              className="h-9 rounded-lg text-[13px] font-semibold inline-flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: 'var(--chart-5)',
                color: 'var(--primary-foreground)',
                border: 'none',
              }}
            >
              <SendHorizontal size={14} />
              发布到公众号
            </button>
            <span
              className="text-[11px] text-center"
              style={{ color: 'var(--muted-foreground)' }}
            >
              长文+卡片
            </span>
          </div>

          <div className="flex-1 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="h-9 rounded-lg text-[13px] font-semibold inline-flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              }}
            >
              <ExternalLink size={14} />
              复制分享链接
            </button>
            <span
              className="text-[11px] text-center"
              style={{ color: 'var(--muted-foreground)' }}
            >
              可分享给他人使用
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            readOnly
            value={content.shareLink}
            className="flex-1 h-9 px-3 text-[13px] rounded-lg"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--secondary-foreground)',
              backgroundColor: 'var(--muted)',
              fontFamily: 'var(--font-mono)',
            }}
          />
          <button
            type="button"
            onClick={handleCopyInput}
            className="h-9 px-4 rounded-lg text-[13px] font-semibold"
            style={{
              backgroundColor: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            }}
          >
            复制
          </button>
        </div>
      </div>
    </section>
  )
}
