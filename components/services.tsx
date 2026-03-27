'use client'

import { Code, Smartphone, Zap, Cloud, Palette, Hammer } from 'lucide-react'

interface ServiceCard {
  icon: React.ReactNode
  title: string
  description: string
}

export function Services() {
  const services: ServiceCard[] = [
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Web Development',
      description: 'Build stunning, high-performance web applications with modern technologies and best practices.',
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Mobile App Development',
      description: 'Create powerful iOS and Android apps that engage users and deliver exceptional experiences.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI & Automation',
      description: 'Leverage artificial intelligence to automate processes and unlock new business opportunities.',
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: 'Cloud Solutions',
      description: 'Scale your infrastructure with secure, reliable cloud deployment and management services.',
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'UI/UX Design',
      description: 'Design beautiful, intuitive interfaces that users love and convert visitors into customers.',
    },
    {
      icon: <Hammer className="w-8 h-8" />,
      title: 'Custom Software',
      description: 'Tailored software solutions built specifically for your unique business needs and goals.',
    },
  ]

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions designed to propel your business forward in the digital age.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-6 rounded-lg border border-border bg-card hover:border-accent hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon Container */}
              <div className="mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                <div className="text-accent group-hover:text-primary transition-colors">{service.icon}</div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-2 text-foreground">{service.title}</h3>

              {/* Description */}
              <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                {service.description}
              </p>

              {/* Hover Arrow */}
              <div className="mt-4 inline-flex opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-accent font-semibold">Learn more →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
