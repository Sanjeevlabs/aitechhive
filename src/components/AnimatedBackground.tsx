'use client'

import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    
    // Throttle resize events for better performance
    let resizeTimeout: NodeJS.Timeout
    const throttledResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 150)
    }
    window.addEventListener('resize', throttledResize)

    // Particle system - Optimized for better performance
    const particles: Particle[] = []
    const particleCount = 50 // Reduced from 80 for better performance
    const connectionDistance = 150 // Reduced from 200 for fewer calculations

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth)
        this.y = Math.random() * (canvas?.height || window.innerHeight)
        this.vx = (Math.random() - 0.5) * 0.5 // Reduced speed for smoother animation
        this.vy = (Math.random() - 0.5) * 0.5
        this.size = Math.random() * 2 + 1 // Smaller particles
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        const width = canvas?.width || window.innerWidth
        const height = canvas?.height || window.innerHeight
        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1
      }

      draw() {
        if (!ctx) return
        // Create gradient for particles
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2)
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.6)')
        gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.3)')
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)')
        
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop with frame rate limiting for better performance
    let animationFrameId: number
    let lastFrameTime = 0
    const targetFPS = 30 // Limit to 30 FPS for better battery life
    const frameInterval = 1000 / targetFPS
    
    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return
      
      // Throttle animation to target FPS
      if (currentTime - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }
      lastFrameTime = currentTime
      
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw connections - optimized loop
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const particle = particles[i]
          const otherParticle = particles[j]
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            const opacity = (1 - distance / connectionDistance) * 0.25
            ctx.strokeStyle = `rgba(14, 165, 233, ${opacity})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener('resize', throttledResize)
      clearTimeout(resizeTimeout)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-25"
      style={{ zIndex: 0 }}
    />
  )
}
