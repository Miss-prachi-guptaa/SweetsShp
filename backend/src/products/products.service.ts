import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { QueryProductDto } from './dto/query-product.dto';

const FALLBACK_PRODUCTS = [
  { id: 380, name: "Desi Cockrel Chicken", weight: "1 kg", price: 400, category: "Chicken", image: "/products/desi-chicken.jpeg", tag: "Farm fresh", rating: 4.9, cutType: "Curry Cut (Medium)" },
  { id: 396, name: "Chicken Lollipop", weight: "1 kg", price: 360, category: "Chicken", image: "/products/chicken-lollipop.jpeg", tag: "Bestseller", rating: 4.8, cutType: "Frenched Lollipops" },
  { id: 406, name: "Chicken Keema", weight: "500 g", price: 200, category: "Chicken", image: "/products/chicken-keema.png", tag: "High Protein", rating: 4.7, cutType: "Finely Minced" },
  { id: 403, name: "Chicken Curry Cut", weight: "500 g", price: 135, category: "Chicken", image: "/products/chicken-curry.png", tag: "Everyday value", rating: 4.8, cutType: "Standard Curry Cut" },
  { id: 404, name: "Boneless Chicken Breast", weight: "500 g", price: 175, category: "Chicken", image: "/products/chicken-breast.png", tag: "Lean & Clean", rating: 4.9, cutType: "Tender Fillets" },
  { id: 423, name: "Chicken Liver — Kaleji", weight: "500 g", price: 180, category: "Chicken", image: "/products/chicken-liver.png", tag: "Iron Rich", rating: 4.6, cutType: "Whole Cleaned" },
  { id: 415, name: "Mutton Curry Pieces", weight: "500 g", price: 340, category: "Mutton", image: "/products/mutton.png", tag: "Hand cut", rating: 4.9, cutType: "Curry Cut (Bone-in)" },
  { id: 384, name: "Mutton Liver", weight: "500 g", price: 360, category: "Mutton", image: "/products/mutton-liver.jpeg", tag: "Chef Choice", rating: 4.7, cutType: "Diced Cubes" },
  { id: 393, name: "Tengra Fish", weight: "600 g", price: 430, category: "Seafood", image: "/products/tengra.jpeg", tag: "Fresh catch", rating: 4.8, cutType: "Cleaned & Gutted" },
  { id: 428, name: "Payasi Boneless Fillets", weight: "1 kg", price: 480, category: "Seafood", image: "/products/fish-fillet.png", tag: "Zero Bone", rating: 4.9, cutType: "Boneless Fillets" },
  { id: 387, name: "Papda Fish", weight: "600 g", price: 450, category: "Seafood", image: "/products/papda.jpeg", tag: "Delicacy", rating: 4.7, cutType: "Whole Cleaned" },
  { id: 420, name: "King Prawns", weight: "250 g cleaned", price: 680, category: "Seafood", image: "/products/prawns.jpeg", tag: "Premium", rating: 5.0, cutType: "Deveined Tail-On" },
];

const FALLBACK_CATEGORIES = [
  { id: 1, name: "Chicken", copy: "Tender cuts, curry cuts & farm-fresh choices", image: "/categories/chicken.png", count: 6 },
  { id: 2, name: "Mutton", copy: "Rich, flavourful & hand-cut pasture goat", image: "/categories/mutton.png", count: 2 },
  { id: 3, name: "Seafood", copy: "Fresh daily river & coastal catch, cleaned", image: "/categories/seafood.png", count: 4 },
];

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll(query: QueryProductDto) {
    const cacheKey = `products:${query.category || 'all'}:${query.search || ''}:${query.featured || ''}`;
    const cached = await this.redis.get<any[]>(cacheKey);
    if (cached) {
      return { source: 'redis_cache', data: cached };
    }

    try {
      const where: any = {};
      if (query.category && query.category !== 'All') {
        where.category = { name: { equals: query.category, mode: 'insensitive' } };
      }
      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ];
      }
      if (query.featured === 'true') {
        where.isFeatured = true;
      }

      const products = await this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { id: 'asc' },
      });

      if (products.length > 0) {
        const formatted = products.map((p) => ({
          ...p,
          price: Number(p.price),
          originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
          category: p.category.name,
        }));
        await this.redis.set(cacheKey, formatted, 180);
        return { source: 'database', data: formatted };
      }
    } catch (err: any) {
      this.logger.warn(`Database query failed (${err.message}). Using seeded fallback.`);
    }

    // Fallback in-memory catalog
    let list = FALLBACK_PRODUCTS;
    if (query.category && query.category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === query.category?.toLowerCase());
    }
    if (query.search) {
      const term = query.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(term));
    }
    return { source: 'static_fallback', data: list };
  }

  async findOne(id: number) {
    const cacheKey = `product:${id}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return { source: 'redis_cache', data: cached };

    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: { category: true },
      });
      if (product) {
        const formatted = {
          ...product,
          price: Number(product.price),
          originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
          category: product.category.name,
        };
        await this.redis.set(cacheKey, formatted, 300);
        return { source: 'database', data: formatted };
      }
    } catch (err: any) {
      this.logger.warn(`Product findUnique failed: ${err.message}`);
    }

    const fallback = FALLBACK_PRODUCTS.find((p) => p.id === id);
    return { source: 'static_fallback', data: fallback || null };
  }

  async getCategories() {
    const cacheKey = 'categories:all';
    const cached = await this.redis.get(cacheKey);
    if (cached) return { source: 'redis_cache', data: cached };

    try {
      const categories = await this.prisma.category.findMany({
        include: { _count: { select: { products: true } } },
      });
      if (categories.length > 0) {
        const result = categories.map((c) => ({
          id: c.id,
          name: c.name,
          copy: c.description,
          image: c.image,
          count: c._count.products,
        }));
        await this.redis.set(cacheKey, result, 600);
        return { source: 'database', data: result };
      }
    } catch (err: any) {
      this.logger.warn(`Categories query failed: ${err.message}`);
    }

    return { source: 'static_fallback', data: FALLBACK_CATEGORIES };
  }

  async create(data: any) {
    try {
      // Find or create category
      let category = await this.prisma.category.findUnique({
        where: { name: data.category },
      });
      if (!category) {
        category = await this.prisma.category.create({
          data: {
            name: data.category,
            slug: data.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          },
        });
      }

      const product = await this.prisma.product.create({
        data: {
          name: data.name,
          slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          price: data.price,
          originalPrice: data.originalPrice,
          weight: data.weight || '500 g',
          cutType: data.cutType,
          image: data.image,
          inStock: data.inStock !== false,
          tag: data.tag,
          categoryId: category.id,
        },
        include: { category: true },
      });

      return { success: true, data: product };
    } catch (err: any) {
      this.logger.error(`Create product failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  async update(id: number, data: any) {
    try {
      const updateData: any = { ...data };
      delete updateData.id;
      delete updateData.category;

      const product = await this.prisma.product.update({
        where: { id },
        data: updateData,
      });
      return { success: true, data: product };
    } catch (err: any) {
      this.logger.error(`Update product failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return { success: true, message: 'Deleted' };
    } catch (err: any) {
      this.logger.error(`Delete product failed: ${err.message}`);
      return { success: false, error: err.message };
    }
  }
}

