import Link from 'next/link'
import { Mail, MapPin, Linkedin, Github, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              
              {/* Logo Box */}
              <div className="w-8 h-8 rounded bg-gradient-to-br from-accent via-primary to-secondary flex items-center justify-center">
                <span className="text-sm font-bold text-accent-foreground">
                  A
                </span>
              </div>

              {/* Company Name */}
              <span className="font-bold text-lg">ASK TECH</span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Building the future with cutting-edge technology solutions.
            </p>

            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="text-muted-foreground hover:text-accent transition-colors">Home</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-accent transition-colors">Services</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-accent transition-colors">About</a></li>
              <li><a href="#projects" className="text-muted-foreground hover:text-accent transition-colors">Projects</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="text-muted-foreground hover:text-accent transition-colors">Web Development</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-accent transition-colors">Mobile Apps</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-accent transition-colors">AI Solutions</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-accent transition-colors">Cloud Services</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} />
                <a href="mailto:infoasktechbusiness@gmail.com" className="hover:text-accent transition-colors">
                  infoasktechbusiness@gmail.com
                </a>
              </li>

              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} />
                <span>New Delhi, Gurgaon, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ASK TECH. All rights reserved. | Built with passion for innovation.
          </p>
        </div>
      </div>
    </footer>
  )
}