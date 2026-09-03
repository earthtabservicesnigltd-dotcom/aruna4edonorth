export const siteConfig = {
  name: "Comr. Aruna Abubakari",
  tagline: "Edo North · 2027",
  email: "hello@abubakariaruna4senate.com",
  description: "The campaign of Comr. Aruna Abubakari for the Edo North Senatorial District, 2027 General Election.",
  whatsappNumber: "", // <-- ADD THIS (Replace later with real number)
};

export const mainNav = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Manifesto", href: "/manifesto" },
  { title: "Vision for Edo North", href: "/vision-for-edo-north" },
  { title: "News & Update", href: "/news-and-updates" },
  { title: "Events", href: "/events" },
  { title: "Volunteer", href: "/volunteer" },
  { title: "Contact", href: "/contact" },
  { title: "Talk to Abubakari Aruna", href: "/talk-to-abubakari" },
] as const;

export const footerQuickLinks = mainNav;

export const footerInvolvedLinks = [
  { title: "Events", href: "/events" },
  { title: "Volunteer", href: "/volunteer" },
  { title: "Verify Volunteer", href: "/verify" },
  { title: "Donate", href: "/donate" },
  { title: "Contact", href: "/contact" },
  { title: "Talk to Abubakari", href: "/talk-to-abubakari" },
  { title: "Abubakari Institute", href: "/abubakari-institute" },
] as const;

export const socialLinks = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "X", href: "#", icon: "twitter" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "YouTube", href: "#", icon: "youtube" },
  { label: "WhatsApp", href: "https://wa.me/2348012345678", icon: "whatsapp" },
] as const;