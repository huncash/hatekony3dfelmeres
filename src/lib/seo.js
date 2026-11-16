import { config, PUBLIC_ORIGIN } from '../config.js';
import { jsonLd } from './html.js';
import { absolutePublic } from './indexing.js';

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': `${PUBLIC_ORIGIN}/#ceg`,
    name: config.company.shortName,
    legalName: config.company.legalName,
    url: PUBLIC_ORIGIN,
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

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': `${PUBLIC_ORIGIN}/#weboldal`,
    name: config.siteName,
    url: `${PUBLIC_ORIGIN}/`,
    inLanguage: 'hu-HU',
    publisher: { '@id': `${PUBLIC_ORIGIN}/#ceg` },
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
  const list = [{ name: 'Főoldal', url: absolutePublic('/') }, ...crumbs];
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
    dateModified: article.modified || article.date,
    inLanguage: 'hu-HU',
    mainEntityOfPage: canonical,
    author: { '@id': `${PUBLIC_ORIGIN}/#ceg` },
    publisher: { '@id': `${PUBLIC_ORIGIN}/#ceg` },
    image: absolutePublic(article.image || '/og.png'),
  };
}

export function serviceNode(name, description, canonical) {
  return {
    '@type': 'Service',
    name,
    description,
    url: canonical,
    provider: { '@id': `${PUBLIC_ORIGIN}/#ceg` },
    areaServed: 'HU',
  };
}
