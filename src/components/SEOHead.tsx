import React, { useEffect } from 'react';
import { useGuide, TalentioPage } from '../context/GuideContext';

interface PageSEOMeta {
  title: string;
  description: string;
  canonicalPath: string;
  isIndexable: boolean;
  breadcrumbs?: Array<{ name: string; item: string }>;
}

const SITE_URL = 'https://talentio1.netlify.app';

const PAGE_SEO_REGISTRY: Record<string, PageSEOMeta> = {
  home: {
    title: 'Talentio — Freelance Marketplace Bangladesh | Hire Freelancers & Find Jobs',
    description: "Talentio is Bangladesh's premier freelance marketplace connecting businesses and clients with skilled Bangladeshi freelancers. Find freelance jobs, hire developers, designers, and marketers with secure escrow protection.",
    canonicalPath: '/',
    isIndexable: true
  },
  explore: {
    title: 'Talentio — Freelance Marketplace Bangladesh | Hire Freelancers & Find Jobs',
    description: "Talentio is Bangladesh's premier freelance marketplace connecting businesses and clients with skilled Bangladeshi freelancers. Find freelance jobs, hire developers, designers, and marketers with secure escrow protection.",
    canonicalPath: '/',
    isIndexable: true
  },
  services: {
    title: 'Freelance Services in Bangladesh | Order Fixed-Price Gigs | Talentio',
    description: 'Explore verified freelance services and digital gigs in Bangladesh with transparent milestone deliverables, upfront pricing, fast turnaround, and 100% smart escrow security on Talentio.',
    canonicalPath: '/services',
    isIndexable: true,
    breadcrumbs: [
      { name: 'Home', item: SITE_URL },
      { name: 'Services', item: `${SITE_URL}/services` }
    ]
  },
  marketplace: {
    title: 'Freelance Services in Bangladesh | Order Fixed-Price Gigs | Talentio',
    description: 'Explore verified freelance services and digital gigs in Bangladesh with transparent milestone deliverables, upfront pricing, fast turnaround, and 100% smart escrow security on Talentio.',
    canonicalPath: '/services',
    isIndexable: true
  },
  catalog: {
    title: 'Freelance Services in Bangladesh | Order Fixed-Price Gigs | Talentio',
    description: 'Explore verified freelance services and digital gigs in Bangladesh with transparent milestone deliverables, upfront pricing, fast turnaround, and 100% smart escrow security on Talentio.',
    canonicalPath: '/services',
    isIndexable: true
  },
  freelancers: {
    title: 'Hire Freelancers in Bangladesh | Find Skilled Bangladeshi Talent | Talentio',
    description: 'Hire top Bangladeshi freelancers and vetted international experts in software engineering, UI/UX design, SEO, and digital marketing with guaranteed milestone escrow protection on Talentio.',
    canonicalPath: '/freelancers',
    isIndexable: true,
    breadcrumbs: [
      { name: 'Home', item: SITE_URL },
      { name: 'Freelancers', item: `${SITE_URL}/freelancers` }
    ]
  },
  talent: {
    title: 'Hire Freelancers in Bangladesh | Find Skilled Bangladeshi Talent | Talentio',
    description: 'Hire top Bangladeshi freelancers and vetted international experts in software engineering, UI/UX design, SEO, and digital marketing with guaranteed milestone escrow protection on Talentio.',
    canonicalPath: '/freelancers',
    isIndexable: true
  },
  categories: {
    title: 'Freelance Categories & Digital Specialties in Bangladesh | Talentio',
    description: 'Browse top freelance categories in Bangladesh: web development, graphic design, SEO, digital marketing, content writing, and video editing. Connect with vetted freelance specialists.',
    canonicalPath: '/categories',
    isIndexable: true,
    breadcrumbs: [
      { name: 'Home', item: SITE_URL },
      { name: 'Categories', item: `${SITE_URL}/categories` }
    ]
  },
  leaderboard: {
    title: 'Top Bangladeshi Freelancers Leaderboard & Vetted Rankings | Talentio',
    description: 'Discover the top-rated freelancers in Bangladesh and vetted global talent on Talentio. Compare rankings by completed milestone escrow projects, customer ratings, and turnaround velocity.',
    canonicalPath: '/leaderboard',
    isIndexable: true,
    breadcrumbs: [
      { name: 'Home', item: SITE_URL },
      { name: 'Leaderboard', item: `${SITE_URL}/leaderboard` }
    ]
  },
  ranking: {
    title: 'Top Bangladeshi Freelancers Leaderboard & Vetted Rankings | Talentio',
    description: 'Discover the top-rated freelancers in Bangladesh and vetted global talent on Talentio. Compare rankings by completed milestone escrow projects, customer ratings, and turnaround velocity.',
    canonicalPath: '/leaderboard',
    isIndexable: true
  },
  rankings: {
    title: 'Top Bangladeshi Freelancers Leaderboard & Vetted Rankings | Talentio',
    description: 'Discover the top-rated freelancers in Bangladesh and vetted global talent on Talentio. Compare rankings by completed milestone escrow projects, customer ratings, and turnaround velocity.',
    canonicalPath: '/leaderboard',
    isIndexable: true
  },
  playbook: {
    title: 'Freelance Escrow Protection & Contract Guidelines | Talentio Playbook',
    description: 'Read the official Talentio guidelines on smart escrow protection, milestone contracts, intellectual property rights transfer, and contractor dispute arbitration.',
    canonicalPath: '/playbook',
    isIndexable: true,
    breadcrumbs: [
      { name: 'Home', item: SITE_URL },
      { name: 'Playbook', item: `${SITE_URL}/playbook` }
    ]
  },
  guides: {
    title: 'Freelance Escrow Protection & Contract Guidelines | Talentio Playbook',
    description: 'Read the official Talentio guidelines on smart escrow protection, milestone contracts, intellectual property rights transfer, and contractor dispute arbitration.',
    canonicalPath: '/playbook',
    isIndexable: true
  },
  security: {
    title: 'Freelance Escrow Protection & Contract Guidelines | Talentio Playbook',
    description: 'Read the official Talentio guidelines on smart escrow protection, milestone contracts, intellectual property rights transfer, and contractor dispute arbitration.',
    canonicalPath: '/playbook',
    isIndexable: true
  },
  defense: {
    title: 'Freelance Escrow Protection & Contract Guidelines | Talentio Playbook',
    description: 'Read the official Talentio guidelines on smart escrow protection, milestone contracts, intellectual property rights transfer, and contractor dispute arbitration.',
    canonicalPath: '/playbook',
    isIndexable: true
  },
  notices: {
    title: 'Official Marketplace Updates & System Notices | Talentio',
    description: 'Stay informed with official platform announcements, freelancer verification standards, milestone security notifications, and operational broadcasts from Talentio.',
    canonicalPath: '/notices',
    isIndexable: true,
    breadcrumbs: [
      { name: 'Home', item: SITE_URL },
      { name: 'Notices', item: `${SITE_URL}/notices` }
    ]
  },
  notice: {
    title: 'Official Marketplace Updates & System Notices | Talentio',
    description: 'Stay informed with official platform announcements, freelancer verification standards, milestone security notifications, and operational broadcasts from Talentio.',
    canonicalPath: '/notices',
    isIndexable: true
  },
  help: {
    title: 'Talentio Support Center — How to Hire Freelancers & Find Work in Bangladesh',
    description: 'Get help with Talentio milestone escrow, hiring freelancers in Bangladesh, finding freelance jobs, payment methods, and dispute resolution from our 24/7 support team.',
    canonicalPath: '/help',
    isIndexable: true,
    breadcrumbs: [
      { name: 'Home', item: SITE_URL },
      { name: 'Help Center', item: `${SITE_URL}/help` }
    ]
  },
  support: {
    title: 'Talentio Support Center — How to Hire Freelancers & Find Work in Bangladesh',
    description: 'Get help with Talentio milestone escrow, hiring freelancers in Bangladesh, finding freelance jobs, payment methods, and dispute resolution from our 24/7 support team.',
    canonicalPath: '/help',
    isIndexable: true
  },

  // Private / Non-Indexable Areas
  admin: {
    title: 'Admin Governance Console | TALENTIO',
    description: 'Talentio super administrator desk for identity audits, dispute arbitrations, and platform management.',
    canonicalPath: '/admin',
    isIndexable: false
  },
  workstation: {
    title: 'Milestone Workstation & Escrow Contract | TALENTIO',
    description: 'Private active project workstation, milestone submissions, and deliverables approval.',
    canonicalPath: '/workstation',
    isIndexable: false
  },
  escrow: {
    title: 'Milestone Workstation & Escrow Contract | TALENTIO',
    description: 'Private active project workstation, milestone submissions, and deliverables approval.',
    canonicalPath: '/workstation',
    isIndexable: false
  },
  orders: {
    title: 'Milestone Workstation & Escrow Contract | TALENTIO',
    description: 'Private active project workstation, milestone submissions, and deliverables approval.',
    canonicalPath: '/workstation',
    isIndexable: false
  },
  chat: {
    title: 'Confidential Messages & Contract Negotiations | TALENTIO',
    description: 'Private real-time client-freelancer messaging, proposal delivery, and file transfers.',
    canonicalPath: '/chat',
    isIndexable: false
  },
  messages: {
    title: 'Confidential Messages & Contract Negotiations | TALENTIO',
    description: 'Private real-time client-freelancer messaging, proposal delivery, and file transfers.',
    canonicalPath: '/chat',
    isIndexable: false
  },
  dashboard: {
    title: 'User Dashboard & Earnings Workspace | TALENTIO',
    description: 'Private user financial ledger, escrow balances, and contract stats.',
    canonicalPath: '/dashboard',
    isIndexable: false
  },
  earnings: {
    title: 'User Dashboard & Earnings Workspace | TALENTIO',
    description: 'Private user financial ledger, escrow balances, and contract stats.',
    canonicalPath: '/dashboard',
    isIndexable: false
  },
  payouts: {
    title: 'User Dashboard & Earnings Workspace | TALENTIO',
    description: 'Private user financial ledger, escrow balances, and contract stats.',
    canonicalPath: '/dashboard',
    isIndexable: false
  },
  settings: {
    title: 'Account Settings & Preferences | TALENTIO',
    description: 'Private user configuration, security options, and currency settings.',
    canonicalPath: '/settings',
    isIndexable: false
  },
  profile: {
    title: 'User Profile Settings | TALENTIO',
    description: 'Private user profile editor, skills checklist, and portfolio editor.',
    canonicalPath: '/profile',
    isIndexable: false
  },
  favorites: {
    title: 'Saved Freelancers & Bookmarked Services | TALENTIO',
    description: 'Private bookmarks and saved talent list.',
    canonicalPath: '/favorites',
    isIndexable: false
  },
  notifications: {
    title: 'Account Notifications | TALENTIO',
    description: 'Private user system notices and milestone activity.',
    canonicalPath: '/notifications',
    isIndexable: false
  },
  search: {
    title: 'Search Results | TALENTIO',
    description: 'Search marketplace services and vetted freelancers.',
    canonicalPath: '/search',
    isIndexable: false
  }
};

export const SEOHead: React.FC = () => {
  const { activePage, selectedService } = useGuide();

  useEffect(() => {
    // 1. Resolve Meta Data
    let meta: PageSEOMeta = PAGE_SEO_REGISTRY[activePage] || PAGE_SEO_REGISTRY.home;

    if (activePage === 'gig-details' && selectedService) {
      meta = {
        title: `${selectedService.title} by ${selectedService.freelancerName} | TALENTIO`,
        description: selectedService.packages?.basic?.description || `Order ${selectedService.title} on Talentio with guaranteed milestone escrow protection.`,
        canonicalPath: '/services',
        isIndexable: true,
        breadcrumbs: [
          { name: 'Home', item: SITE_URL },
          { name: 'Services', item: `${SITE_URL}/services` },
          { name: selectedService.title, item: `${SITE_URL}/services` }
        ]
      };
    }

    // 2. Set Document Title
    document.title = meta.title;

    // 3. Update Meta Description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', meta.description);

    // 4. Update Canonical Link
    const fullCanonicalUrl = `${SITE_URL}${meta.canonicalPath === '/' ? '/' : meta.canonicalPath}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 5. Update Robots Directive
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    if (meta.isIndexable) {
      robotsTag.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    } else {
      robotsTag.setAttribute('content', 'noindex, nofollow');
    }

    // 6. Update Open Graph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', fullCanonicalUrl);

    // 7. Update Twitter Tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', meta.title);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', meta.description);

    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', fullCanonicalUrl);

    // 8. Update Dynamic Schema JSON-LD for Breadcrumbs & Structured Data
    const SCHEMA_TAG_ID = 'talentio-dynamic-page-schema';
    let schemaScript = document.getElementById(SCHEMA_TAG_ID);
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = SCHEMA_TAG_ID;
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    const schemaGraph: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${fullCanonicalUrl}#webpage`,
        url: fullCanonicalUrl,
        name: meta.title,
        description: meta.description,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`
        }
      }
    ];

    if (meta.breadcrumbs && meta.breadcrumbs.length > 0) {
      schemaGraph.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: meta.breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: crumb.item
        }))
      });
    }

    if (activePage === 'services' || activePage === 'marketplace') {
      schemaGraph.push({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Talentio Digital Freelance Services',
        description: 'Vetted milestone-based digital freelance services with cryptographic escrow payment protection.',
        provider: {
          '@type': 'Organization',
          name: 'Talentio',
          url: SITE_URL
        },
        serviceType: 'Freelance Marketplace & Digital Professional Services',
        areaServed: 'Worldwide'
      });
    }

    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemaGraph
    });
  }, [activePage, selectedService]);

  return null;
};
