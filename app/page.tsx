import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Services } from '@/components/services'
import { WhyChoose } from '@/components/why-choose'
import { Projects } from '@/components/projects'
import { About } from '@/components/about'
import { Testimonials } from '@/components/testimonials'
import { CTASection } from '@/components/cta-section'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background" suppressHydrationWarning>
      <Navbar />
      <Hero />
      <Services />
      <WhyChoose />
      <Projects />
      <About />
      <Testimonials />
      <CTASection />
      <Contact />
      <Footer />
    </main>
  )
}
