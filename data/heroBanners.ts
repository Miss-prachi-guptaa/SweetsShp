export interface HeroBannerItem {
  id: string;
  categoryKey: string;
  badge: string;
  tagline: string;
  titleLight: string;
  titleGold: string;
  desc: string;
  image: string;
  freshTag?: string;
}

export const HERO_BANNERS_DATA: HeroBannerItem[] = [
  {
    id: "signature-mithai",
    categoryKey: "Traditional Sweets",
    badge: "SHUDDH DESI GHEE | FRESH DAILY | PREMIUM QUALITY",
    tagline: "Vindhyavaisini Ki Mithaas",
    titleLight: "HAR KHUSHI KE LIYE",
    titleGold: "KUCH MEETHA HO JAAYE",
    desc: "Gulab jamun, rasgulla, kaju katli, barfi, laddoo aur bahut kuch — parampara aur shuddhta ke saath.",
    image: "/vindhyavaisini/mithai-hero.png",
    freshTag: "Freshly Made Daily",
  },
  {
    id: "snacks",
    categoryKey: "Snacks & Chaat",
    badge: "HOT | CRISPY | MADE FRESH",
    tagline: "Chai Ka Perfect Saathi",
    titleLight: "GARAM SAMOSA, KACHORI",
    titleGold: "CHAAT & JALEBI",
    desc: "Crispy samosa, khasta kachori, chana chaat aur garma-garam jalebi — har bite mein desi swaad.",
    image: "/vindhyavaisini/mithai-hero.png",
    freshTag: "Served Hot",
  },
  {
    id: "gift-boxes",
    categoryKey: "Gift Boxes",
    badge: "FESTIVALS | WEDDINGS | CORPORATE GIFTING",
    tagline: "Khushiyan Baantne Ke Liye",
    titleLight: "PREMIUM MITHAI",
    titleGold: "GIFT BOXES",
    desc: "Handpicked mithai assortments for festivals, pooja, weddings and every special celebration.",
    image: "/vindhyavaisini/mithai-hero.png",
    freshTag: "Beautifully Packed",
  },
];
