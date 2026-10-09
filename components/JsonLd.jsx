import { getContactInfo, getFooter, getServices, getSiteSeo } from '@/lib/site';

const FALLBACK = {
  baseUrl: 'https://modernestimator.com',
  description:
    'Premium construction estimation services for US contractors. Quantity takeoffs, material estimation, residential and commercial bid preparation with 8–24 hour turnaround.',
  phone: '+1-555-123-4567',
  email: 'hello@modernestimator.com',
  streetAddress: '1100 Estimator Ave, Suite 210',
  addressLocality: 'Austin',
  addressRegion: 'TX',
  postalCode: '78701',
  services: [
    'Quantity Takeoff',
    'Material Estimation',
    'Residential Estimation',
    'Commercial Estimation',
    'Bid Preparation',
    'Trade-Specific Estimates',
  ],
};

// Best-effort parse of "Street, Suite, City, ST ZIP[, Country]".
function parseAddress(addr) {
  const fb = {
    streetAddress: FALLBACK.streetAddress,
    addressLocality: FALLBACK.addressLocality,
    addressRegion: FALLBACK.addressRegion,
    postalCode: FALLBACK.postalCode,
    addressCountry: 'US',
  };
  if (!addr || typeof addr !== 'string') return fb;
  const parts = addr.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length < 3) return fb;
  let country = 'US';
  const last = parts[parts.length - 1];
  let rest = parts;
  if (/^(usa?|united states)$/i.test(last)) {
    country = 'US';
    rest = parts.slice(0, -1);
  }
  const stateZip = rest[rest.length - 1].match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
  if (!stateZip) return fb;
  const locality = rest[rest.length - 2];
  const street = rest.slice(0, -2).join(', ');
  if (!street || !locality) return fb;
  return {
    streetAddress: street,
    addressLocality: locality,
    addressRegion: stateZip[1],
    postalCode: stateZip[2],
    addressCountry: country,
  };
}

export default async function JsonLd() {
  const [ci, ft, services, seo] = await Promise.all([
    getContactInfo(),
    getFooter(),
    getServices(),
    getSiteSeo(),
  ]);

  const baseUrl = (seo?.siteUrl || FALLBACK.baseUrl).replace(/\/$/, '');
  // Business identity: Site SEO schema fields first (managed for SEO),
  // then the Contact/Footer records, then static fallback.
  const phone = seo?.telephone || ci?.phone || ft?.phone || FALLBACK.phone;
  const email = seo?.email || ci?.email || ft?.email || FALLBACK.email;
  const priceRange = seo?.priceRange || FALLBACK.priceRange;
  const businessName = seo?.businessName || 'Modern Estimator';
  const businessDescription = seo?.businessDescription || seo?.ogDescription || FALLBACK.description;
  const address = seo?.streetAddress
    ? {
        streetAddress: seo.streetAddress,
        addressLocality: seo.addressLocality || FALLBACK.addressLocality,
        addressRegion: seo.addressRegion || FALLBACK.addressRegion,
        postalCode: seo.postalCode || FALLBACK.postalCode,
        addressCountry: seo.addressCountry || 'US',
      }
    : parseAddress(ci?.address || ft?.address);
  const areaServed = seo?.areaServed || 'United States';
  const serviceNames = services.length
    ? services.map((s) => s.title).filter(Boolean)
    : FALLBACK.services;
  const sameAs = [ft?.facebook, ft?.linkedin, ft?.twitter, ft?.instagram].filter(Boolean);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: businessName,
    description: businessDescription,
    url: baseUrl,
    telephone: phone,
    email,
    priceRange,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    areaServed: {
      '@type': 'Country',
      name: areaServed,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: seo?.ratingValue || '4.9',
      reviewCount: seo?.reviewCount || '320',
    },
    ...(sameAs.length ? { sameAs } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Construction Estimation Services',
      itemListElement: serviceNames.map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
