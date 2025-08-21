import { useEffect, useState } from 'react'

const icons = ['🐞', '🔥', '💾', '🔧', '☕', '💀', '💻', '⚡', '🎰', '🎲', '{}', '</>', '🖥️', '⌨️']

const Background = () => {
  const [floatingIcons, setFloatingIcons] = useState<Array<{id: number, icon: string, left: number, delay: number, duration: number}>>([])

  useEffect(() => {
    const icons_array = []
    for (let i = 0; i < 15; i++) {
      icons_array.push({
        id: i,
        icon: icons[Math.floor(Math.random() * icons.length)],
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 15 + Math.random() * 10
      })
    }
    setFloatingIcons(icons_array)
  }, [])

  return (
    <>
      {/* Imagem de fundo */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay escuro para melhor contraste */}
      <div className="fixed inset-0 z-0 bg-black/40" />
      
      {/* Ícones flutuantes opcionais */}
      <div className="floating-icons">
        {floatingIcons.map(item => (
          <div
            key={item.id}
            className="floating-icon"
            style={{
              left: `${item.left}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
              color: '#FFD700',
              opacity: 0.15
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>
    </>
  )
}

export default Background