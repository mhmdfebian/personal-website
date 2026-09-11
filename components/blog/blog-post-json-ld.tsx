export function BlogPostJsonLd({ title, description, datePublished, dateModified, image, url }: { title: string; description: string; datePublished?: string; dateModified: string; image?: string | null; url: string }) {
  const data = { "@context": "https://schema.org", "@type": "BlogPosting", headline: title, description, datePublished, dateModified, image: image || undefined, url };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}