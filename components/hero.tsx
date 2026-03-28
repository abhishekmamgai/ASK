'use client'

import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary via-secondary to-accent rounded-full mix-blend-screen opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-accent via-primary to-secondary rounded-full mix-blend-screen opacity-20 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-block mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
          <p className="text-sm font-medium text-accent">Welcome to the future of tech</p>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-balance">
          Build the Future with{' '}
          <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
            ASK
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
          From cutting-edge web applications to AI-powered solutions, we transform your ideas into
          reality with innovative technology and expert craftsmanship.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12 flex items-center gap-2 bg-card border border-border rounded-full p-2">
          <Search className="text-muted-foreground ml-4" size={20} />
          <input
            type="text"
            placeholder="Search for services..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground px-4 py-2"
          />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
            asChild
          >
            <a href="#contact">Start Your Project</a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-border hover:bg-card"
            asChild
          >
            <a href="#services">Explore Services</a>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8">
          <div>
            <div className="text-3xl font-bold text-accent mb-2">50+</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">30+</div>
            <div className="text-sm text-muted-foreground">Happy Clients</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary mb-2">10+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  )
}
