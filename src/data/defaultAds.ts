import { Advertisement, AdSettings } from '../types';

export const DEFAULT_AD_SETTINGS: AdSettings = {
  globalAdsEnabled: true,
  updatedAt: new Date().toISOString(),
  updatedBy: 'system'
};

export const INITIAL_ADSTERRA_ADS: Advertisement[] = [
  {
    id: 'ad-4-banner-728x90',
    name: 'AD 4 — 728×90 Display Banner',
    network: 'Adsterra',
    format: 'banner_728x90',
    placement: 'below_hero',
    devices: 'desktop',
    width: 728,
    height: 90,
    enabled: true,
    priority: 1,
    spacing: 'standard',
    targetPages: ['home', 'services', 'freelancers', 'search'],
    allowOnPrivatePages: false,
    code: `<script>\n  atOptions = {\n    'key' : '17beb5f4ab282d8063f12057cbc1d272',\n    'format' : 'iframe',\n    'height' : 90,\n    'width' : 728,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/17beb5f4ab282d8063f12057cbc1d272/invoke.js"></script>`,
    createdAt: '2026-09-14T00:00:00.000Z',
    updatedAt: '2026-09-14T00:00:00.000Z'
  },
  {
    id: 'ad-3-banner-468x60',
    name: 'AD 3 — 468×60 Content Banner',
    network: 'Adsterra',
    format: 'banner_468x60',
    placement: 'between_content',
    devices: 'all',
    width: 468,
    height: 60,
    enabled: true,
    priority: 2,
    spacing: 'standard',
    targetPages: ['home', 'services', 'freelancers', 'search', 'gig-details'],
    allowOnPrivatePages: false,
    code: `<script>\n  atOptions = {\n    'key' : '229e816312a2f74d74631dd834dbb406',\n    'format' : 'iframe',\n    'height' : 60,\n    'width' : 468,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/229e816312a2f74d74631dd834dbb406/invoke.js"></script>`,
    createdAt: '2026-09-14T00:00:00.000Z',
    updatedAt: '2026-09-14T00:00:00.000Z'
  },
  {
    id: 'ad-5-sidebar-160x300',
    name: 'AD 5 — 160×300 Sidebar Banner',
    network: 'Adsterra',
    format: 'sidebar_160x300',
    placement: 'sidebar',
    devices: 'desktop',
    width: 160,
    height: 300,
    enabled: true,
    priority: 3,
    spacing: 'compact',
    targetPages: ['services', 'freelancers', 'search', 'gig-details'],
    allowOnPrivatePages: false,
    code: `<script>\n  atOptions = {\n    'key' : 'cacd1c8e93523e5ce10d6d6b455a0fd8',\n    'format' : 'iframe',\n    'height' : 300,\n    'width' : 160,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/cacd1c8e93523e5ce10d6d6b455a0fd8/invoke.js"></script>`,
    createdAt: '2026-09-14T00:00:00.000Z',
    updatedAt: '2026-09-14T00:00:00.000Z'
  },
  {
    id: 'ad-6-mobile-320x50',
    name: 'AD 6 — 320×50 Mobile Banner',
    network: 'Adsterra',
    format: 'mobile_320x50',
    placement: 'mobile_banner',
    devices: 'mobile',
    width: 320,
    height: 50,
    enabled: true,
    priority: 4,
    spacing: 'compact',
    targetPages: ['home', 'services', 'freelancers', 'search', 'gig-details', 'categories'],
    allowOnPrivatePages: false,
    code: `<script>\n  atOptions = {\n    'key' : 'c31a64d0e8ec6d9ccd886dda0f67c151',\n    'format' : 'iframe',\n    'height' : 50,\n    'width' : 320,\n    'params' : {}\n  };\n</script>\n<script src="https://www.highrevenueformat.com/c31a64d0e8ec6d9ccd886dda0f67c151/invoke.js"></script>`,
    createdAt: '2026-09-14T00:00:00.000Z',
    updatedAt: '2026-09-14T00:00:00.000Z'
  }
];

export const PUBLIC_PAGES_OPTIONS: { id: string; label: string; description: string }[] = [
  { id: 'home', label: 'Home Page', description: 'Hero, featured freelancers and popular gigs' },
  { id: 'services', label: 'Browse Gigs & Services', description: 'Main freelance catalog & listings' },
  { id: 'freelancers', label: 'Talent Directory', description: 'Browse verified Bangladeshi freelancers' },
  { id: 'search', label: 'Search & Discovery', description: 'Search results across gigs & freelancers' },
  { id: 'gig-details', label: 'Gig Details', description: 'Public service specifications & pricing' },
  { id: 'categories', label: 'Categories Page', description: 'Marketplace service taxonomies' },
  { id: 'jobs', label: 'Public Jobs', description: 'Open client project listings' },
  { id: 'playbook', label: 'Playbook & Guides', description: 'Educational marketplace guides' },
  { id: 'help', label: 'Help & Support', description: 'Public FAQ and support desk' }
];

export const SENSITIVE_PRIVATE_PAGES: string[] = [
  'admin',
  'dashboard',
  'chat',
  'messages',
  'orders',
  'workstation',
  'escrow',
  'earnings',
  'payouts',
  'settings',
  'profile',
  'login',
  'register',
  'forgot-password'
];
