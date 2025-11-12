import { useEffect, useRef } from 'react'
import './App.css'

function App() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.baseX = this.x
        this.baseY = this.y
        this.density = Math.random() * 30 + 1
        this.distance = 0
        this.hue = Math.random() * 60 + 200 // Blue to purple range
      }

      update() {
        const dx = mouseRef.current.x - this.x
        const dy = mouseRef.current.y - this.y
        this.distance = Math.sqrt(dx * dx + dy * dy)
        const forceDirectionX = dx / this.distance
        const forceDirectionY = dy / this.distance
        const maxDistance = 150
        const force = (maxDistance - this.distance) / maxDistance
        const directionX = forceDirectionX * force * this.density
        const directionY = forceDirectionY * force * this.density

        if (this.distance < maxDistance) {
          this.x -= directionX
          this.y -= directionY
        } else {
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX
            this.x -= dx / 10
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY
            this.y -= dy / 10
          }
        }
      }

      draw() {
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 0.8)`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      }
    }

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      const numberOfParticles = (canvas.width * canvas.height) / 9000
      for (let i = 0; i < numberOfParticles; i++) {
        particlesRef.current.push(new Particle())
      }
    }
    initParticles()

    // Connect particles
    const connectParticles = () => {
      for (let a = 0; a < particlesRef.current.length; a++) {
        for (let b = a; b < particlesRef.current.length; b++) {
          const dx = particlesRef.current[a].x - particlesRef.current[b].x
          const dy = particlesRef.current[a].y - particlesRef.current[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            const opacity = 1 - distance / 100
            ctx.strokeStyle = `rgba(138, 43, 226, ${opacity * 0.3})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[a].x, particlesRef.current[a].y)
            ctx.lineTo(particlesRef.current[b].x, particlesRef.current[b].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current.forEach(particle => {
        particle.update()
        particle.draw()
      })
      
      connectParticles()
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      <h1 className="header">This is a static React + Vite app <br/> Powered by Omega</h1>
      <canvas ref={canvasRef} className="galaxy-canvas" />
    </>
  )
}

export default App
