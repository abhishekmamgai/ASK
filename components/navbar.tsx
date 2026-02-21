'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent via-primary to-secondary flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-accent-foreground">A</span>
            </div>

            <span className="font-bold text-lg text-foreground tracking-wide">
              ASK TECH
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="outline"
              className="rounded-full"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>

            <Button
              className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
              asChild
            >
              <a href="#contact">Get a Quote</a>
            </Button>
          </div>

          {/* Mobile Section */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>

            <button
              className="p-2 hover:bg-card rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="flex flex-col gap-4 p-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <Button
                className="w-full rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
                asChild
              >
                <a href="#contact">Get a Quote</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}