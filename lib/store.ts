import fs from 'fs';
import path from 'path';
import { SWEET_CATEGORIES, SWEET_PRODUCTS } from '@/data/sweetsCatalog';

export interface ProductVariant {
  weight: string;
  price: number;
  originalPrice?: number;
}

export interface ProductItem {
  id: number;
  name: string;
  slug?: string;
  weight: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcut?: string;
  image: string;
  tag?: string;
  rating?: number;
  cutType?: string;
  description?: string;
  inStock?: boolean;
  variants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  count?: number;
  productCount?: number;
  subcuts?: string[];
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  requirement?: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'RESOLVED';
  createdAt: string;
}

export interface AssetRecord {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number; // in bytes
  compressedSize?: number; // in bytes
  reductionPercent?: number; // e.g. 75
  category: 'products' | 'categories' | 'hero' | 'brand' | 'uploads';
  createdAt: string;
}

interface DataStore {
  products: ProductItem[];
  categories: CategoryItem[];
  contacts: ContactInquiry[];
  assets: AssetRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 1,
    name: 'Chicken',
    slug: 'chicken',
    description: 'Tender cuts, curry cuts, and farm-fresh choices',
    image: '/categories/chicken.png',
    count: 6,
  },
  {
    id: 2,
    name: 'Mutton',
    slug: 'mutton',
    description: 'Rich, flavourful & hand-cut pasture goat meat',
    image: '/categories/mutton.png',
    count: 2,
  },
  {
    id: 3,
    name: 'Seafood',
    slug: 'seafood',
    description: 'Fresh daily catch, cleaned and portioned',
    image: '/categories/seafood.png',
    count: 4,
  },
];

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 380,
    name: "Desi Cockrel Chicken",
    slug: "desi-cockrel-chicken",
    weight: "1 kg",
    price: 400,
    originalPrice: 450,
    category: "Chicken",
    image: "/products/desi-chicken.jpeg",
    tag: "Farm fresh",
    rating: 4.9,
    cutType: "Curry Cut (Medium)",
    description: "Free-range country rooster meat with authentic rustic flavour. Firm, lean, perfect for slow-cooked home curries.",
    inStock: true,
  },
  {
    id: 396,
    name: "Chicken Lollipop",
    slug: "chicken-lollipop",
    weight: "1 kg (16-18 pcs)",
    price: 360,
    originalPrice: 400,
    category: "Chicken",
    image: "/products/chicken-lollipop.jpeg",
    tag: "Bestseller",
    rating: 4.8,
    cutType: "Frenched Lollipops",
    description: "Cleanly frenched wingettes ready for frying, tossing in Schezwan or tandoori marination.",
    inStock: true,
  },
  {
    id: 406,
    name: "Chicken Keema (Minced)",
    slug: "chicken-keema",
    weight: "500 g",
    price: 200,
    originalPrice: 230,
    category: "Chicken",
    image: "/products/chicken-keema.png",
    tag: "High Protein",
    rating: 4.7,
    cutType: "Finely Minced",
    description: "Prime chicken breast and thigh meat freshly minced. Smooth, juicy, and 100% free of bone shards.",
    inStock: true,
  },
  {
    id: 403,
    name: "Chicken Curry Cut",
    slug: "chicken-curry-cut",
    weight: "500 g",
    price: 135,
    originalPrice: 160,
    category: "Chicken",
    image: "/products/chicken-curry.png",
    tag: "Everyday value",
    rating: 4.8,
    cutType: "Curry Cut (12-14 pcs)",
    description: "Hygienically dressed skinless bone-in chicken with drumstick, thigh, breast and wing portions.",
    inStock: true,
  },
  {
    id: 404,
    name: "Boneless Chicken Breast",
    slug: "chicken-breast",
    weight: "500 g",
    price: 175,
    originalPrice: 210,
    category: "Chicken",
    image: "/products/chicken-breast.png",
    tag: "Lean & Clean",
    rating: 4.9,
    cutType: "Clean Fillets",
    description: "Tender, high-protein white meat fillets with zero skin and fat trim. Great for fitness and quick sauté dishes.",
    inStock: true,
  },
  {
    id: 423,
    name: "Chicken Liver — Kaleji",
    slug: "chicken-liver",
    weight: "500 g",
    price: 180,
    originalPrice: 200,
    category: "Chicken",
    image: "/products/chicken-liver.png",
    tag: "Iron Rich",
    rating: 4.6,
    cutType: "Whole Cleaned",
    description: "Rich and wholesome fresh liver pieces, carefully handled with zero bile contamination.",
    inStock: true,
  },
  {
    id: 415,
    name: "Mutton Curry Pieces",
    slug: "mutton-curry-pieces",
    weight: "500 g",
    price: 340,
    originalPrice: 390,
    category: "Mutton",
    image: "/products/mutton.png",
    tag: "Hand cut",
    rating: 4.9,
    cutType: "Curry Cut (Bone-in)",
    description: "Pasture-raised young goat meat cut from shoulder, chops, and ribs. Succulent, tender, and intensely flavourful.",
    inStock: true,
  },
  {
    id: 384,
    name: "Mutton Liver (Kaleji)",
    slug: "mutton-liver",
    weight: "500 g",
    price: 360,
    originalPrice: 420,
    category: "Mutton",
    image: "/products/mutton-liver.jpeg",
    tag: "Chef Choice",
    rating: 4.7,
    cutType: "Diced Cubes",
    description: "Fresh goat liver, washed and cubed into bite-sized pieces. Ideal for spicy dry fry or traditional liver gravy.",
    inStock: true,
  },
  {
    id: 393,
    name: "Tengra Fish (River Ar)",
    slug: "tengra-fish",
    weight: "600 g",
    price: 430,
    originalPrice: 490,
    category: "Seafood",
    image: "/products/tengra.jpeg",
    tag: "Fresh catch",
    rating: 4.8,
    cutType: "Cleaned & Degutted",
    description: "Daily fresh catch sweetwater river fish. Degutted and cleaned, perfect for traditional spicy mustard gravy.",
    inStock: true,
  },
  {
    id: 428,
    name: "Payasi Boneless Fillets",
    slug: "payasi-boneless-fillets",
    weight: "1 kg",
    price: 480,
    originalPrice: 550,
    category: "Seafood",
    image: "/products/fish-fillet.png",
    tag: "Zero Bone",
    rating: 4.9,
    cutType: "Boneless Fillets",
    description: "Mild tasting white meat fillets completely free of pin-bones. Perfect for children, fish fingers, and tawa fry.",
    inStock: true,
  },
  {
    id: 387,
    name: "Papda Fish",
    slug: "papda-fish",
    weight: "600 g",
    price: 450,
    originalPrice: 510,
    category: "Seafood",
    image: "/products/papda.jpeg",
    tag: "Delicacy",
    rating: 4.7,
    cutType: "Whole Cleaned",
    description: "Silky soft freshwater catfish variety prized for its melting texture and delicate sweetness.",
    inStock: true,
  },
  {
    id: 420,
    name: "King Prawns (Jumbo)",
    slug: "king-prawns-jumbo",
    weight: "250 g cleaned",
    price: 680,
    originalPrice: 780,
    category: "Seafood",
    image: "/products/prawns.jpeg",
    tag: "Premium",
    rating: 5.0,
    cutType: "Deveined Tail-On",
    description: "Plump, juicy coastal jumbo prawns peeled and deveined with tail intact. Naturally sweet and firm.",
    inStock: true,
  },
];

const INITIAL_CONTACTS: ContactInquiry[] = [
  {
    id: 'cnt-101',
    name: 'Amitabh Sharma',
    phone: '9839123456',
    email: 'amitabh.s@example.com',
    requirement: 'Need 5kg Boneless Chicken Breast & 3kg Mutton for Sunday family gathering',
    message: 'Can you deliver early morning by 8:30 AM in Lanka, Varanasi?',
    status: 'UNREAD',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'cnt-102',
    name: 'Rajesh Verma (Banaras Restro)',
    phone: '9123456789',
    email: 'rajesh@banarasbites.in',
    requirement: 'Bulk weekly supply of Chicken Keema (15kg) and Frenched Lollipops (10kg)',
    message: 'Looking for a B2B butcher partnership for restaurant supply with daily fresh dispatch.',
    status: 'REPLIED',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

function scanExistingPublicAssets(): AssetRecord[] {
  const assets: AssetRecord[] = [];
  const folders: Array<{ folder: string; category: AssetRecord['category'] }> = [
    { folder: 'products', category: 'products' },
    { folder: 'categories', category: 'categories' },
    { folder: 'hero', category: 'hero' },
    { folder: 'brand', category: 'brand' },
    { folder: 'uploads', category: 'uploads' },
  ];

  for (const item of folders) {
    const dir = path.join(process.cwd(), 'public', item.folder);
    if (!fs.existsSync(dir)) {
      if (item.folder === 'uploads') {
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch {
          // Ignore
        }
      }
      continue;
    }

    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          assets.push({
            id: `ast-${item.folder}-${file.replace(/[^a-zA-Z0-9]/g, '_')}`,
            filename: file,
            originalName: file,
            url: `/${item.folder}/${file}`,
            size: stat.size,
            category: item.category,
            createdAt: stat.birthtime.toISOString() || new Date().toISOString(),
          });
        }
      }
    } catch {
      // Ignore directory read errors
    }
  }

  return assets;
}

function ensureDataStore(): DataStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialAssets = scanExistingPublicAssets();
    const initialStore: DataStore = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      contacts: INITIAL_CONTACTS,
      assets: initialAssets,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
    return initialStore;
  }

  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(content) as DataStore;

    // Rescan uploads/assets if needed
    const currentAssets = scanExistingPublicAssets();
    const existingMap = new Map(parsed.assets?.map((a) => [a.url, a]) || []);
    for (const a of currentAssets) {
      if (!existingMap.has(a.url)) {
        parsed.assets = parsed.assets || [];
        parsed.assets.push(a);
      }
    }

    parsed.products = SWEET_PRODUCTS;
    parsed.categories = SWEET_CATEGORIES;
    return parsed;
  } catch {
    const fallbackStore: DataStore = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      contacts: INITIAL_CONTACTS,
      assets: scanExistingPublicAssets(),
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(fallbackStore, null, 2), 'utf-8');
    return fallbackStore;
  }
}

function saveDataStore(store: DataStore) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

// Store Accessors

export function getStoreData(): DataStore {
  return ensureDataStore();
}

// Contacts CRUD
export function getContactInquiries(): ContactInquiry[] {
  const store = ensureDataStore();
  return store.contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createContactInquiry(data: {
  name: string;
  phone: string;
  email?: string;
  requirement?: string;
  message: string;
}): ContactInquiry {
  const store = ensureDataStore();
  const newInquiry: ContactInquiry = {
    id: `cnt-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || undefined,
    requirement: data.requirement?.trim() || undefined,
    message: data.message.trim(),
    status: 'UNREAD',
    createdAt: new Date().toISOString(),
  };
  store.contacts.unshift(newInquiry);
  saveDataStore(store);
  return newInquiry;
}

export function updateContactStatus(id: string, status: ContactInquiry['status']): ContactInquiry | null {
  const store = ensureDataStore();
  const item = store.contacts.find((c) => c.id === id);
  if (!item) return null;
  item.status = status;
  saveDataStore(store);
  return item;
}

export function deleteContactInquiry(id: string): boolean {
  const store = ensureDataStore();
  const initialLen = store.contacts.length;
  store.contacts = store.contacts.filter((c) => c.id !== id);
  if (store.contacts.length !== initialLen) {
    saveDataStore(store);
    return true;
  }
  return false;
}

// Assets CRUD
export function getAssetsList(): AssetRecord[] {
  const store = ensureDataStore();
  return store.assets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addAssetRecord(asset: AssetRecord): AssetRecord {
  const store = ensureDataStore();
  // Filter out any duplicates
  store.assets = store.assets.filter((a) => a.url !== asset.url);
  store.assets.unshift(asset);
  saveDataStore(store);
  return asset;
}

export function deleteAssetFile(urlOrFilename: string): boolean {
  const store = ensureDataStore();
  const target = store.assets.find(
    (a) => a.url === urlOrFilename || a.filename === urlOrFilename || a.id === urlOrFilename
  );

  let deletedFromDisk = false;
  if (target) {
    // Delete file from public directory
    const relativePath = target.url.startsWith('/') ? target.url.slice(1) : target.url;
    const diskPath = path.join(process.cwd(), 'public', relativePath);
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
        deletedFromDisk = true;
      } catch (err) {
        console.error('Failed to unlink disk file:', err);
      }
    }
    store.assets = store.assets.filter((a) => a.id !== target.id && a.url !== target.url);
    saveDataStore(store);
    return true;
  }

  // Fallback direct disk check in public/uploads
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', urlOrFilename);
  if (fs.existsSync(uploadPath)) {
    try {
      fs.unlinkSync(uploadPath);
      deletedFromDisk = true;
    } catch {
      // Ignore
    }
  }

  store.assets = store.assets.filter((a) => !a.url.includes(urlOrFilename) && a.filename !== urlOrFilename);
  saveDataStore(store);
  return deletedFromDisk;
}

// Products CRUD
export function getAllProducts(): ProductItem[] {
  const store = ensureDataStore();
  return store.products;
}

export function createProduct(product: Omit<ProductItem, 'id'> & { id?: number }): ProductItem {
  const store = ensureDataStore();
  const newId = product.id || (store.products.length > 0 ? Math.max(...store.products.map((p) => p.id)) + 1 : 101);
  const newProduct: ProductItem = {
    ...product,
    id: newId,
    slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    inStock: product.inStock !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.products.push(newProduct);
  saveDataStore(store);
  return newProduct;
}

export function updateProduct(id: number, updates: Partial<ProductItem>): ProductItem | null {
  const store = ensureDataStore();
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  store.products[index] = {
    ...store.products[index],
    ...updates,
    id, // Preserve id
    updatedAt: new Date().toISOString(),
  };
  saveDataStore(store);
  return store.products[index];
}

export function deleteProduct(id: number): boolean {
  const store = ensureDataStore();
  const initialLen = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length !== initialLen) {
    saveDataStore(store);
    return true;
  }
  return false;
}

// Categories CRUD
export function getAllCategories(): CategoryItem[] {
  const store = ensureDataStore();
  return store.categories;
}

export function createCategory(cat: Omit<CategoryItem, 'id'>): CategoryItem {
  const store = ensureDataStore();
  const newId = store.categories.length > 0 ? Math.max(...store.categories.map((c) => c.id)) + 1 : 1;
  const newCat: CategoryItem = {
    ...cat,
    id: newId,
    slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    count: 0,
  };
  store.categories.push(newCat);
  saveDataStore(store);
  return newCat;
}

export function deleteCategory(id: number): boolean {
  const store = ensureDataStore();
  const initialLen = store.categories.length;
  store.categories = store.categories.filter((c) => c.id !== id);
  if (store.categories.length !== initialLen) {
    saveDataStore(store);
    return true;
  }
  return false;
}

// Stats for Admin Dashboard
export function getAdminStats() {
  const store = ensureDataStore();
  const unreadContacts = store.contacts.filter((c) => c.status === 'UNREAD').length;
  const inStockProducts = store.products.filter((p) => p.inStock !== false).length;
  const outOfStockProducts = store.products.length - inStockProducts;

  return {
    totalProducts: store.products.length,
    inStockProducts,
    outOfStockProducts,
    totalCategories: store.categories.length,
    totalContacts: store.contacts.length,
    unreadContacts,
    totalAssets: store.assets.length,
  };
}


export interface PincodeEntry {
  area: string;
  fee: number;
  time: string;
  active: boolean;
}

export interface StoreSettings {
  isStoreOpen: boolean;
  closedNotice?: string;
  pincodes: Record<string, PincodeEntry>;
}

export function getStoreSettings(): StoreSettings {
  const store = ensureDataStore() as any;
  if (!store.settings) {
    store.settings = {
      isStoreOpen: true,
      closedNotice: 'We are currently closed. Orders placed now will be prepared when the shop reopens.',
      pincodes: {
        '284128': { area: 'Ghosi — within 2 km of shop', fee: 0, time: '30-45 mins', active: true }
      }
    };
    saveDataStore(store);
  }
  store.settings.pincodes = {
    '284128': { area: 'Ghosi — within 2 km of shop', fee: 0, time: '30-45 mins', active: true }
  };
  return store.settings;
}

export function updateStoreSettings(updates: Partial<StoreSettings>): StoreSettings {
  const store = ensureDataStore() as any;
  const current = getStoreSettings();
  store.settings = {
    ...current,
    ...updates,
  };
  saveDataStore(store);
  return store.settings;
}

export function updateOrderStatus(orderId: string, status: string): boolean {
  const store = ensureDataStore() as any;
  if (!Array.isArray(store.orders)) return false;
  const ord = store.orders.find((o: any) => o.orderId === orderId);
  if (ord) {
    ord.status = status;
    ord.updatedAt = new Date().toISOString();
    saveDataStore(store);
    return true;
  }
  return false;
}
