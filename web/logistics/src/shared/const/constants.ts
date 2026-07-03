import type { IconName } from "lucide-react/dynamic";

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
    href: '/$locale/warehouse',
  },
];

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export const faqItems: FAQItem[] = [
  {
    id: 'item-1',
    icon: 'clock',
    question: 'What are your business hours?',
    answer:
      'Our customer service team is available Monday through Friday from 9:00 AM to 8:00 PM EST, and weekends from 10:00 AM to 6:00 PM EST. During holidays, hours may vary and will be posted on our website.',
  },
  {
    id: 'item-2',
    icon: 'credit-card',
    question: 'How do subscription payments work?',
    answer:
      'Subscription payments are automatically charged to your default payment method on the same day each month or year, depending on your billing cycle. You can update your payment information and view billing history in your account dashboard.',
  },
  {
    id: 'item-3',
    icon: 'truck',
    question: 'Can I expedite my shipping?',
    answer:
      'Yes, we offer several expedited shipping options at checkout. Next-day and 2-day shipping are available for most U.S. addresses if orders are placed before 2:00 PM EST. International expedited shipping options vary by destination.',
  },
  {
    id: 'item-4',
    icon: 'globe',
    question: 'Do you offer localized support?',
    answer:
      'We offer multilingual support in English, Spanish, French, German, and Japanese. Our support team can assist customers in these languages via email, chat, and phone during standard business hours for each respective region.',
  },
  {
    id: 'item-5',
    icon: 'package',
    question: 'How do I track my order?',
    answer:
      'Once your order ships, you\'ll receive a confirmation email with a tracking number. You can use this number on our website or the carrier\'s website to track your package. You can also view order status and tracking information in your account dashboard under "Order History".',
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
      { title: 'Fleet Management', to: '/$locale/carrier/' },
      { title: 'Warehouse Management', to: '/$locale/warehouse' },
    ],
  },
  {
    group: 'Solutions',
    items: [
      { title: 'For Shippers', to: '/$locale/shipping' },
      { title: 'For Carriers', to: '/$locale/carrier' },
      { title: 'For Warehouse Operators', to: '/$locale/warehouse' },
      { title: 'Enterprise', to: '/$locale/enterprise' },
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
      { title: 'Invest', to: '/$locale/invest' },
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
      { title: 'Terms of Service', to: '/$locale/legal/terms-of-service' },
      { title: 'Privacy Policy', to: '/$locale/legal/privacy-policy' },
      //{ title: 'Cookie Policy', to: '/$locale/legal/cookie-policy' },
      { title: 'Acceptable Use', to: '/$locale/legal/acceptable-use' },
      //{ title: 'Disclaimer', to: '/$locale/legal/disclaimer' },
    ],
  },
];
