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
      title: 'Mobile Fitness App',
      category: 'Mobile Development',
      description: 'iOS/Android app with workout tracking and nutrition planning.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      link: 'https://cafe-noir-demo-du5b9350o-abhishekmamgais-projects.vercel.app/',
    },
    {
      title: 'Cloud Infrastructure',
      category: 'Cloud Solutions',
      description: 'Scalable cloud architecture supporting millions of users.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'SaaS Management Tool',
      category: 'Custom Software',
      description: 'Enterprise SaaS platform with multi-tenant architecture.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
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