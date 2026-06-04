export function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
      <BisoLogo />
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

function BisoLogo() {
  return (
    <div className="flex items-center select-none" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <span style={{ fontWeight: 900, fontSize: 24, color: '#111', letterSpacing: '-0.5px' }}>
        B
      </span>
      <span style={{ fontWeight: 900, fontSize: 24, color: '#111', letterSpacing: '-0.5px' }}>
        I
      </span>
      <span style={{ fontWeight: 900, fontSize: 24, color: '#111', letterSpacing: '-0.5px' }}>
        S
      </span>
      <span className="relative inline-block" style={{ width: 22, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontWeight: 900, fontSize: 24, color: '#111', letterSpacing: '-0.5px' }}>O</span>
        <span
          className="absolute"
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#FF0068',
            top: 2,
            right: -1,
          }}
        />
      </span>
    </div>
  )
}
