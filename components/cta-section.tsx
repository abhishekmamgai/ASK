import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 bg-card border-y border-border" suppressHydrationWarning>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" suppressHydrationWarning>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Ready to Collaborate?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 text-balance">
          Join ASK and be part of a team building innovative digital solutions. Let's create something amazing together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground flex items-center gap-2"
            asChild
          >
            <Link href="/login">
              Get Started Today
              <ArrowRight size={20} />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-primary/30 hover:bg-primary/5"
            asChild
          >
            <a href="#contact">Contact Us</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
