'use client'

import { Star } from 'lucide-react'

interface Testimonial {
  name: string
  company: string
  feedback: string
  rating: number
}

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: 'Rajesh Kumar',
      company: 'TechFlow Industries',
      feedback:
        'ASK transformed our entire web infrastructure. Their React expertise helped us reduce load times by 60% and increase user engagement significantly.',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      company: 'Digital Innovations Ltd',
      feedback:
        'The mobile app they built for us exceeded all expectations. Their attention to detail in UI/UX design and functionality is exceptional.',
      rating: 5,
    },
    {
      name: 'Amit Patel',
      company: 'CloudScale Solutions',
      feedback:
        'Working with ASK on our AI integration project was seamless. They delivered ahead of schedule and maintained excellent communication throughout.',
      rating: 5,
    },
    {
      name: 'Neha Gupta',
      company: 'DataDrive Analytics',
      feedback:
        'ASK provided excellent custom software development services. Their technical expertise and professional approach made our project a huge success.',
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-background" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        {/* Section Header */}
        <div className="text-center mb-16" suppressHydrationWarning>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">What Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by businesses worldwide to deliver exceptional results.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" suppressHydrationWarning>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border bg-card hover:border-accent transition-colors hover:shadow-lg hover:shadow-accent/10"
              suppressHydrationWarning
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Feedback */}
              <p className="text-foreground mb-6">{`"${testimonial.feedback}"`}</p>

              {/* Author */}
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Testimonial Section */}
        <div className="mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-border">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Success Stories?</h3>
            <p className="text-muted-foreground mb-6">
              Let's collaborate and create something amazing together.
            </p>
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold transition-all">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
