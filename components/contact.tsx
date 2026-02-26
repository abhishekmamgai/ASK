'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function Contact() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setResult('')

    try {
      const { error } = await supabase.from('contacts').insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      ])

      if (error) {
        console.error(error)
        setResult('Error sending message')
      } else {
        setResult('Message sent successfully!')
        setFormData({ name: '', email: '', message: '' })
      }
    } catch (err) {
      console.error(err)
      setResult('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <a
                  href="mailto:infoasktechbusiness@gmail.com"
                  className="text-muted-foreground hover:text-accent"
                >
                  infoasktechbusiness@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
                <Phone className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-muted-foreground">
                  Available upon request
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-muted-foreground">
                  New Delhi, Gurgaon, India
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-8 rounded-lg border bg-card"
            >
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <textarea
                name="message"
                rows={6}
                placeholder="Your message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>

              {result && (
                <p className="text-center text-sm mt-2">{result}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}