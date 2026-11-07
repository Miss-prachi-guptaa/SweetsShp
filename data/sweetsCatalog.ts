import type { CategoryItem, ProductItem } from "@/lib/store";

const hero = "/vindhyavaisini/mithai-hero.png";
const productImage = (name: string) => `/vindhyavaisini/products/${name}.png`;

const productImages: Record<number, string> = {
  1001: productImage("gulab-jamun"),
  1002: productImage("rasgulla"),
  1003: productImage("jalebi"),
  1004: productImage("imarti"),
  1010: productImage("kaju-katli"),
  1011: productImage("malai-barfi"),
  1012: productImage("milk-cake"),
  1013: productImage("kalakand"),
  1020: productImage("motichoor-laddoo"),
  1021: productImage("besan-laddoo"),
  1022: productImage("soan-papdi"),
  1023: productImage("kesar-peda"),
  1030: productImage("rasmalai"),
  1031: productImage("malai-cham-cham"),
  1032: productImage("kesar-rajbhog"),
  1040: productImage("aloo-samosa"),
  1041: productImage("khasta-kachori"),
  1042: productImage("samosa-chana-chaat"),
  1043: productImage("samosa-jalebi-combo"),
  1050: productImage("classic-mithai-gift-box"),
  1051: productImage("premium-dry-fruit-box"),
  1060: productImage("special-namkeen-mixture"),
  1070: productImage("chilled-soft-drink"),
  1071: productImage("sweet-lassi"),
};

export const SWEET_CATEGORIES: CategoryItem[] = [
  { id: 1, name: "Traditional Sweets", slug: "traditional-sweets", description: "Syrupy classics and fresh jalebi", image: productImages[1001], subcuts: ["Gulab Jamun", "Rasgulla", "Jalebi", "Imarti"] },
  { id: 2, name: "Barfi & Kaju", slug: "barfi-kaju", description: "Premium milk and dry-fruit mithai", image: productImages[1010], subcuts: ["Kaju Katli", "Barfi", "Milk Cake", "Kalakand"] },
  { id: 3, name: "Laddoo & Dry Sweets", slug: "laddoo-dry-sweets", description: "Celebration favourites and flaky sweets", image: productImages[1020], subcuts: ["Motichoor Laddoo", "Besan Laddoo", "Soan Papdi", "Peda"] },
  { id: 4, name: "Bengali Sweets", slug: "bengali-sweets", description: "Soft chhena and creamy milk sweets", image: productImages[1030], subcuts: ["Rasmalai", "Cham Cham", "Rajbhog"] },
  { id: 5, name: "Snacks & Chaat", slug: "snacks-chaat", description: "Hot samosa, kachori and chaat", image: productImages[1040], subcuts: ["Samosa", "Kachori", "Chana Chaat", "Jalebi Combo"] },
  { id: 6, name: "Gift Boxes", slug: "gift-boxes", description: "Curated boxes for every celebration", image: productImages[1050], subcuts: ["Assorted Mithai", "Dry Fruit Box"] },
  { id: 7, name: "Namkeen", slug: "namkeen", description: "Crispy savoury tea-time favourites", image: productImages[1060], subcuts: ["Mixture"] },
  { id: 8, name: "Beverages", slug: "beverages", description: "Cold drinks and fresh lassi", image: productImages[1071], subcuts: ["Cold Drink", "Lassi"] },
];

const item = (id: number, name: string, category: string, subcut: string, price: number, weight: string, tag: string, description: string, variants?: ProductItem["variants"]): ProductItem => ({
  id, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), category, subcut, image: productImages[id] || hero,
  price, originalPrice: Math.ceil(price * 1.12 / 10) * 10, weight, tag, rating: 4.8, cutType: subcut, description, inStock: true, variants,
});

const kg = (half: number, full: number) => [{ weight: "500 g", price: half }, { weight: "1 kg", price: full }];

export const SWEET_PRODUCTS: ProductItem[] = [
  item(1001, "Gulab Jamun", "Traditional Sweets", "Gulab Jamun", 220, "500 g", "Bestseller", "Soft khoya dumplings soaked in fragrant cardamom-rose syrup.", kg(220, 420)),
  item(1002, "Rasgulla", "Traditional Sweets", "Rasgulla", 190, "500 g", "Fresh Chhena", "Light, spongy chhena balls in delicate sugar syrup.", kg(190, 360)),
  item(1003, "Desi Ghee Jalebi", "Traditional Sweets", "Jalebi", 180, "500 g", "Served Hot", "Crisp golden spirals fried fresh and dipped in saffron syrup.", kg(180, 340)),
  item(1004, "Imarti", "Traditional Sweets", "Imarti", 210, "500 g", "Traditional", "Rich urad dal imarti with a crisp lace and juicy centre.", kg(210, 400)),
  item(1010, "Kaju Katli", "Barfi & Kaju", "Kaju Katli", 480, "500 g", "Premium", "Silky cashew diamonds finished with edible silver leaf.", kg(480, 920)),
  item(1011, "Malai Barfi", "Barfi & Kaju", "Barfi", 260, "500 g", "Creamy", "Slow-cooked milk barfi with cardamom and pistachio.", kg(260, 500)),
  item(1012, "Milk Cake", "Barfi & Kaju", "Milk Cake", 250, "500 g", "House Special", "Caramel-toned grainy milk cake, rich and gently sweet.", kg(250, 480)),
  item(1013, "Kalakand", "Barfi & Kaju", "Kalakand", 280, "500 g", "Fresh Daily", "Moist, crumbly fresh-milk kalakand topped with pistachio.", kg(280, 540)),
  item(1020, "Motichoor Laddoo", "Laddoo & Dry Sweets", "Motichoor Laddoo", 240, "500 g", "Celebration Favourite", "Fine saffron boondi pearls shaped into melt-in-mouth laddoos.", kg(240, 460)),
  item(1021, "Besan Laddoo", "Laddoo & Dry Sweets", "Besan Laddoo", 220, "500 g", "Desi Ghee", "Roasted gram flour laddoos with ghee, nuts and cardamom.", kg(220, 420)),
  item(1022, "Soan Papdi", "Laddoo & Dry Sweets", "Soan Papdi", 180, "500 g", "Flaky", "Feather-light flaky cubes layered with cardamom and nuts.", kg(180, 340)),
  item(1023, "Kesar Peda", "Laddoo & Dry Sweets", "Peda", 260, "500 g", "Temple Classic", "Rich khoya peda perfumed with saffron and cardamom.", kg(260, 500)),
  item(1030, "Rasmalai", "Bengali Sweets", "Rasmalai", 240, "6 pcs", "Chilled", "Soft chhena patties in saffron-pistachio rabri.", [{ weight: "6 pcs", price: 240 }, { weight: "12 pcs", price: 450 }]),
  item(1031, "Malai Cham Cham", "Bengali Sweets", "Cham Cham", 230, "500 g", "Creamy", "Tender chhena rolls filled with light malai and coconut.", kg(230, 440)),
  item(1032, "Kesar Rajbhog", "Bengali Sweets", "Rajbhog", 220, "6 pcs", "Royal Pick", "Large saffron chhena sweets with a delicate dry-fruit centre.", [{ weight: "6 pcs", price: 220 }, { weight: "12 pcs", price: 420 }]),
  item(1040, "Aloo Samosa", "Snacks & Chaat", "Samosa", 20, "1 pc", "Hot & Crispy", "Crisp pastry packed with spiced potato and peas.", [{ weight: "1 pc", price: 20 }, { weight: "6 pcs", price: 110 }, { weight: "12 pcs", price: 210 }]),
  item(1041, "Khasta Kachori", "Snacks & Chaat", "Kachori", 25, "1 pc", "Fresh Batch", "Flaky kachori with a savoury dal and spice filling.", [{ weight: "1 pc", price: 25 }, { weight: "6 pcs", price: 140 }]),
  item(1042, "Samosa Chana Chaat", "Snacks & Chaat", "Chana Chaat", 80, "1 plate", "Street Favourite", "Crushed samosa, spicy chana, chutneys, onion and crunchy sev."),
  item(1043, "Samosa Jalebi Combo", "Snacks & Chaat", "Jalebi Combo", 99, "1 combo", "Value Combo", "Two hot samosas paired with fresh jalebi — the classic desi treat."),
  item(1050, "Classic Mithai Gift Box", "Gift Boxes", "Assorted Mithai", 599, "1 kg", "Gift Ready", "A colourful assortment of barfi, laddoo, peda and kaju katli."),
  item(1051, "Premium Dry Fruit Box", "Gift Boxes", "Dry Fruit Box", 899, "1 box", "Premium Gifting", "Elegant selection of cashew and dry-fruit mithai in festive packing."),
  item(1060, "Special Namkeen Mixture", "Namkeen", "Mixture", 110, "500 g", "Tea-Time", "Crunchy house mixture with sev, peanuts and aromatic spices.", kg(110, 200)),
  item(1070, "Chilled Soft Drink", "Beverages", "Cold Drink", 40, "750 ml", "Chilled", "Popular chilled soft drink; brand served as available."),
  item(1071, "Sweet Lassi", "Beverages", "Lassi", 70, "300 ml", "Fresh", "Thick chilled yoghurt lassi finished with malai and cardamom."),
];
