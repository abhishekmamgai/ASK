import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/client/'],
        },
        sitemap: 'https://ask-phi-five.vercel.app/sitemap.xml',
    }
}
