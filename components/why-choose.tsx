'use client'

import { Rocket, Target, Users, Clock, Zap } from 'lucide-react'

interface BenefitCard {
  icon: React.ReactNode
  title: string
  description: string
}

export function WhyChoose() {
  const benefits: BenefitCard[] = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'Rapid development cycles with agile methodologies ensure your project launches on time.',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Scalable Solutions',
      description: 'Built to grow with your business, our solutions scale seamlessly as you expand.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Team',
      description: 'Industry veterans with years of experience delivering exceptional results.',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24/7 Support',
      description: 'Dedicated support team ready to assist you anytime, anywhere.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Modern Stack',
      description: 'Cutting-edge technologies ensuring your solution stays ahead of the curve.',
    },
  ]

  return (
    <section className="py-20 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Why Choose ASK?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine technical expertise with business acumen to deliver solutions that drive real results.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-border hover:border-accent transition-colors"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="text-accent">{benefit.icon}</div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 text-foreground">{benefit.title}</h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 pt-16 border-t border-border">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">500+</div>
              <div className="text-muted-foreground">Lines of Code Daily</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">48hrs</div>
              <div className="text-muted-foreground">Average Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
