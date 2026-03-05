import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://www.addieguide.com'
const SITE_NAME = 'ADDIE Guide'
const DEFAULT_DESCRIPTION =
  'A free practitioner-first reference and tool platform for instructional designers. Covers the full ADDIE process, Bloom\'s Taxonomy, learning theories, objectives building, and ID tools.'

export default function SEOHead({ title, description, path = '', schema = null }) {
  const fullTitle = title
    ? `${title} — ${SITE_NAME}`
    : `${SITE_NAME} — Free Reference for Instructional Designers`
  const metaDescription = description || DEFAULT_DESCRIPTION
  const canonicalUrl = `${SITE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />

      {/* JSON-LD structured data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}
