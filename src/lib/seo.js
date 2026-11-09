import { config } from '../config.js';
import { jsonLd } from './html.js';

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': `${config.siteUrl}/#ceg`,
    name: config.company.shortName,
    legalName: config.company.legalName,
    url: config.siteUrl,
    email: config.contactEmail,
    telephone: config.phone,
    taxID: config.company.taxId,
    address: {
      '@type': 'PostalAddress',
      streetAddress: config.company.street,
      postalCode: config.company.postal,
      addressLocality: config.company.city,
      addressCountry: 'HU',
    },
  };
}

export function professionalServiceNode() {
  return {
    '@type': 'ProfessionalService',
    '@id': `${config.siteUrl}/#szolgaltatas`,
    name: config.siteName,
    url: config.siteUrl,
    image: `${config.siteUrl}/og.png`,
    description: 'Meglévő ipari terek felmérése géptelepítéshez és átépítéshez, az üzemi működéshez igazított terepi munkával.',
    provider: { '@id': `${config.siteUrl}/#ceg` },
    areaServed: { '@type': 'Country', name: 'Magyarország' },
    serviceType: [
      'Ipari térfelmérés',
      'Csarnok felmérés',
      'Géptelepítéshez rendelkezésre álló tér felmérése',
      'Gépészeti tér felmérése',
      'Raktárátalakítás felmérése',
    ],
    email: config.contactEmail,
    telephone: config.phone,
  };
}

export function graph(nodes) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': nodes.filter(Boolean),
  });
}

export function faqNode(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function breadcrumbNode(crumbs, canonical) {
  const list = [{ name: 'Főoldal', url: `${config.siteUrl}/` }, ...crumbs];
  if (canonical && list.length) list[list.length - 1] = { ...list[list.length - 1], url: canonical };
  return {
    '@type': 'BreadcrumbList',
    itemListElement: list.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url || canonical,
    })),
  };
}

export function articleNode(article, canonical) {
  return {
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: 'hu-HU',
    mainEntityOfPage: canonical,
    author: { '@id': `${config.siteUrl}/#ceg` },
    publisher: { '@id': `${config.siteUrl}/#ceg` },
    image: `${config.siteUrl}/og.png`,
  };
}

export function serviceNode(name, description, canonical) {
  return {
    '@type': 'Service',
    name,
    description,
    url: canonical,
    provider: { '@id': `${config.siteUrl}/#ceg` },
    areaServed: 'HU',
  };
}
