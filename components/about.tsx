import { CheckCircle2 } from 'lucide-react'

export function About() {
  const capabilities = [
    'Web Application Development',
    'Mobile App Development',
    'AI & Machine Learning Solutions',
    'Cloud Architecture & Deployment',
    'Database Design & Optimization',
    'DevOps & Infrastructure',
    'API Development & Integration',
    'UI/UX Design & Implementation',
  ]

  return (
    <section id="about" className="py-20 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">About ASK</h2>

            <p className="text-lg text-muted-foreground mb-6">
              ASK (Abhishek Shiva Kartik) is a next-generation technology company dedicated to transforming
              businesses through innovative software solutions. With a team of passionate engineers and
              designers, we bring ideas to life with cutting-edge technology and meticulous attention to detail.
            </p>

            <p className="text-lg text-muted-foreground mb-8">
              Since our founding, we've been committed to delivering exceptional quality, fostering long-term
              partnerships, and staying ahead of technological curves. Our diverse portfolio spans startups,
              enterprises, and everything in between.
            </p>

            {/* Capabilities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual Element */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg opacity-20 blur-2xl" />
            <div className="relative p-12 rounded-lg border border-border bg-background">
              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-accent mb-2">10+</div>
                  <div className="text-muted-foreground">Years of Excellence</div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">50+</div>
                  <div className="text-muted-foreground">Projects Delivered</div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                <div className="text-center">
                  <div className="text-5xl font-bold text-secondary mb-2">30+</div>
                  <div className="text-muted-foreground">Satisfied Clients</div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                <div className="text-center">
                  <div className="text-5xl font-bold text-accent mb-2">100%</div>
                  <div className="text-muted-foreground">Dedicated Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
