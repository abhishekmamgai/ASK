'use client'

interface Project {
  title: string
  category: string
  description: string
  image: string
  link?: string
}

export function Projects() {
  const projects: Project[] = [
    {
      title: 'Mobile Fitness App',
      category: 'Mobile Development',
      description: 'iOS/Android app with workout tracking and nutrition planning.',
      image: 'https://elements-resized.envatousercontent.com/elements-preview-images/70a67d76-6da3-4b4f-b9d8-c294b0718271?w=632&cf_fit=scale-down&q=85&format=auto&s=9dbb38402557c58863955037ced5071e666a53af0e4037f59b5dd6230b5ee2f5',
      link: 'https://health-pro-abhishekmamgais-projects.vercel.app/',
    },
    {
      title: 'AI Content Generator',
      category: 'AI Solutions',
      description: 'AI system for generating marketing and social media content.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
      link: 'https://content-ai-amber-delta.vercel.app/',
    },
    {
      title: 'Cafe Demo',
      category: 'Web Development',
      description: 'A modern cafe website demo with elegant design and seamless user experience.',
      image: 'data:image/webp;base64,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',
      link: 'https://cafe-noir-demo-du5b9350o-abhishekmamgais-projects.vercel.app/',
    },
    {
      title: 'SaaS Management Tool',
      category: 'Custom Software',
      description: 'Enterprise SaaS platform with multi-tenant architecture.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      link: 'https://hr-flow-six.vercel.app/',
    },
    {
      title: 'E-Commerce Platform',
      category: 'Web Development',
      description: 'Full-featured online store with payment integration and inventory management.',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Finance Dashboard',
      category: 'Web Development',
      description: 'Real-time analytics dashboard for investment tracking and portfolio management.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Cloud Infrastructure',
      category: 'Cloud Solutions',
      description: 'Scalable cloud architecture supporting millions of users.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    },
  ]

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Our Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Showcasing our latest work and innovative solutions.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg border border-border bg-card hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-colors"
                    >
                      View Project
                    </a>
                  ) : (
                    <button className="px-6 py-2 rounded-full bg-white text-black font-semibold">
                      View Project
                    </button>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="inline-block mb-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                  <span className="text-xs font-medium text-accent">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>

                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}