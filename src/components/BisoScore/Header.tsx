export function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
      <img src="/biso-logo.svg" alt="Biso" style={{ height: 38, width: 'auto' }} />
      <a
        href="https://biso.digital"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium transition-colors"
        style={{ color: '#FF0068' }}
      >
        Conheça a plataforma →
      </a>
    </header>
  )
}
