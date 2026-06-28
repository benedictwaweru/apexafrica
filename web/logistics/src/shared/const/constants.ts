export const navLinks = [
  {
    title: 'Shipping',
    href: '/$locale/shipping',
  },
  {
    title: 'Carrier',
    href: '/$locale/carrier',
  },
  {
    title: 'Warehouse',
    href: '/$locale/warehouse',
  },
  {
    title: 'Enterprise',
    href: '/$locale/enterprise',
  },
  {
    title: 'Track a shipment',
    href: '/$locale/track',
  },
];

export const navMoreLinks = [
  {
    title: 'Schedules',
    href: '/$locale/schedules',
    description:
      'Search vessels and vehicles to find the schedule which fits your supply chain.',
  },
  {
    title: 'Resources',
    href: '/$locale/resources',
    description:
      'Access the latest trends and research to guide your strategy and keep you updated.',
  },
  {
    title: 'Logistics Explained',
    href: '/$locale/resources/learn',
    description:
      'Explore articles created to answer your logistics questions in clear terms.',
  },
  {
    title: 'Bookings',
    href: '/$locale/bookings',
    description: 'Ship your goods with our easy online booking system',
  },
];

export const whatsNewLinks: { text: string; href: string }[] = [
  {
    text: 'Now implementing warehouse management',
    href: '/$locale/solutions/warehouse',
  },
];

type FooterGroup = {
  group: string;
  items: Array<{ title: string; to: string }>;
};

export const footerLinks: Array<FooterGroup> = [
  {
    group: 'Platform',
    items: [
      { title: 'Track Shipment', to: '/$locale/track' },
      { title: 'Book Freight', to: '/$locale/bookings' },
      { title: 'Schedules', to: '/$locale/schedules' },
      { title: 'Fleet Management', to: '/$locale/solutions/carrier/' },
      { title: 'Warehouse Management', to: '/$locale/solutions/warehouse' },
    ],
  },
  {
    group: 'Solutions',
    items: [
      { title: 'For Shippers', to: '/$locale/solutions/shipping' },
      { title: 'For Carriers', to: '/$locale/solutions/carrier' },
      { title: 'For Warehouse Operators', to: '/$locale/solutions/warehouse' },
      { title: 'Enterprise', to: '/$locale/solutions/enterprise' },
    ],
  },
  {
    group: 'Resources',
    items: [
      { title: 'Documentation', to: '/$locale/resources/docs' },
      { title: 'Insights', to: '/$locale/resources/insights' },
      { title: 'Case Studies', to: '/$locale/resources/case-studies' },
      { title: 'News', to: '/$locale/resources/news' },
    ],
  },
  {
    group: 'Company',
    items: [
      { title: 'About Us', to: '/$locale/about' },
      { title: 'Careers', to: '/$locale/careers' },
      { title: 'Partners', to: '/$locale/partners' },
      { title: 'Press', to: '/$locale/press' },
      { title: 'Investors', to: '/$locale/invest' },
    ],
  },
  {
    group: 'Support',
    items: [
      { title: 'Help Center', to: '/$locale/support' },
      { title: 'Contact Us', to: '/$locale/contact' },
      { title: 'System Status', to: '/$locale/status' },
      { title: 'Report an Issue', to: '/$locale/support/report' },
    ],
  },
  {
    group: 'Legal',
    items: [
      { title: 'Terms of Service', to: '/$locale/terms-of-service' },
      { title: 'Privacy Policy', to: '/$locale/privacy-policy' },
      { title: 'Cookie Policy', to: '/$locale/cookie-policy' },
      { title: 'Acceptable Use', to: '/$locale/acceptable-use' },
      { title: 'Disclaimer', to: '/$locale/disclaimer' },
    ],
  },
];
