export type Post = {
  title: string,
  slug: string,
  excerpt: string,
  content: string,
  heroImageUrl: string,
  tags: Array<{
    text: string,
    slug: string
  }>,
  author: {
    name: string,
    slug: string
  },
  seo: {
    title: string,
    description: string,
    image: string
  }
  publishedDate: Date
}