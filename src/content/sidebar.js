import { articles } from './articles.js';

export const serviceNav = [
  { href: '/geptelepites-elokeszites', label: 'Géptelepítés előkészítése' },
  { href: '/csarnok-atalakitas', label: 'Csarnok- és raktárátalakítás' },
  { href: '/gepeszeti-ter-rekonstrukcio', label: 'Gépészeti környezet dokumentálása' },
];

export const campaignCard = {
  active: false,
  title: '',
  text: '',
  image: '',
  cta: '',
  href: '',
  from: '',
  until: '',
};

const articleByPath = {
  '/': '3d-felmeres-mukodo-uzemben',
  '/szolgaltatasok': '3d-felmeres-mukodo-uzemben',
  '/geptelepites-elokeszites': 'meglevo-allapotfelmeres-geptelepites-elott',
  '/csarnok-atalakitas': 'helyszini-bizonytalansag-csokkentese',
  '/gepeszeti-ter-rekonstrukcio': 'helyszini-bizonytalansag-csokkentese',
  '/folyamat': 'ipari-terepi-felmeres-menete',
  '/minta-anyagok': 'ipari-pontfelho-minosegellenorzese',
  '/arak': 'adatok-geptelepitesi-felmereshez',
  '/gyik': 'adatok-geptelepitesi-felmereshez',
  '/kapcsolat': 'adatok-geptelepitesi-felmereshez',
  '/cikkek': 'ipari-terepi-felmeres-menete',
  '/technologia': 'ipari-pontfelho-minosegellenorzese',
};

function articleBySlug(slug) {
  return articles.find((article) => article.slug === slug) || null;
}

function visibleCampaign(now) {
  const card = campaignCard;
  if (!card.active || !card.title || !card.text || !card.cta || !card.href) return null;
  const time = now.getTime();
  if (card.from && time < Date.parse(card.from)) return null;
  if (card.until && time > Date.parse(card.until)) return null;
  return card;
}

export function sidebarModel(path, now = new Date()) {
  const campaign = visibleCampaign(now);
  const onContact = path === '/kapcsolat';
  let related = null;
  let article = null;
  if (path.startsWith('/cikkek/') && path !== '/cikkek') {
    const current = articleBySlug(path.slice('/cikkek/'.length));
    related = (current?.related || []).slice(0, 3);
  } else if (!campaign) {
    const picked = articleBySlug(articleByPath[path] || articleByPath['/']);
    if (picked) {
      article = {
        href: `/cikkek/${picked.slug}`,
        title: picked.title,
        text: picked.excerpt,
      };
    }
  }
  return {
    ctaHref: path === '/' ? '#kapcsolat' : '/kapcsolat#projektigeny',
    showCta: !onContact,
    showOutputs: path !== '/minta-anyagok',
    article: campaign ? null : article,
    related: campaign ? null : related,
    campaign,
  };
}
