export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: 'var(--muted)',
        borderTop: '1px solid var(--border)',
        padding: '12px 24px',
      }}
    >
      <p
        className="max-w-[1280px] mx-auto text-xs text-left"
        style={{ color: 'var(--muted-foreground)' }}
      >
        中西医执医内容合规生成工作流 ·{' '}
        <span style={{ fontFamily: 'var(--font-mono)' }}>v1.0</span> · 基于 Google 设计系统 ·
        有天同学医考干货
      </p>
    </footer>
  )
}
