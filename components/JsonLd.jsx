const BASE_URL = 'https://modernestimator.com';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Modern Estimator',
  description:
    'Premium construction estimation services for US contractors. Quantity takeoffs, material estimation, residential and commercial bid preparation with 8–24 hour turnaround.',
  url: BASE_URL,
  telephone: '+1-555-123-4567',
  email: 'hello@modernestimator.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1100 Estimator Ave, Suite 210',
    addressLocality: 'Austin',
    addressRegion: 'TX',
    postalCode: '78701',
    addressCountry: 'US',
  },
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '320',
  },
  sameAs: [
    'https://www.facebook.com/',
    'https://www.linkedin.com/',
    'https://twitter.com/',
    'https://www.instagram.com/',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Construction Estimation Services',
    itemListElement: [
      'Quantity Takeoff',
      'Material Estimation',
      'Residential Estimation',
      'Commercial Estimation',
      'Bid Preparation',
      'Trade-Specific Estimates',
    ].map((name) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name },
    })),
  },
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
