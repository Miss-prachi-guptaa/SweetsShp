import { NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();

    let items = getAllProducts();

    if (category && category !== 'All') {
      items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search) ||
          p.tag?.toLowerCase().includes(search) ||
          p.cutType?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, data: items, products: items, count: items.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, weight, price, originalPrice, category, image, cutType, tag, description, inStock } = body;

    if (!name || !price || !category || !image) {
      return NextResponse.json(
        { success: false, error: 'Product name, price, category, and image URL are required.' },
        { status: 400 }
      );
    }

    const created = createProduct({
      name,
      weight: weight || '500 g',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      image,
      cutType: cutType || 'Standard Cut',
      tag: tag || undefined,
      description: description || undefined,
      inStock: inStock !== false,
      rating: 4.8,
    });

    return NextResponse.json({ success: true, message: 'Product added successfully.', data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
