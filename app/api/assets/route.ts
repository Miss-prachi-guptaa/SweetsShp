import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getAssetsList, addAssetRecord, AssetRecord } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();

    let items = getAssetsList();

    if (category && category !== 'ALL') {
      items = items.filter((item) => item.category === category);
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.filename.toLowerCase().includes(search) ||
          item.originalName.toLowerCase().includes(search) ||
          item.url.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, data: items, count: items.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const categoryParam = (formData.get('category') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
    }

    // Verify it is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files (JPEG, PNG, WebP, AVIF, TIFF) can be uploaded and compressed.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalSize = buffer.length;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Clean original base name
    const rawName = path.parse(file.name).name;
    const cleanBase = rawName
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'photo';

    const timestamp = Date.now();
    const finalFilename = `${cleanBase}-${timestamp}.webp`;
    const targetFilePath = path.join(uploadsDir, finalFilename);

    // Compress using Sharp:
    // 1. Auto-orient / rotate
    // 2. Resize to max 800px width/height for instant loading
    // 3. Convert to ultra-fast modern WebP at 80% quality
    const compressedBuffer = await sharp(buffer)
      .rotate()
      .resize({
        width: 800,
        height: 600,
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({
        quality: 80,
        effort: 5,
      })
      .toBuffer();

    const compressedSize = compressedBuffer.length;
    const reductionPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

    // Save compressed file to disk
    fs.writeFileSync(targetFilePath, compressedBuffer);

    const assetRecord: AssetRecord = {
      id: `ast-upload-${timestamp}-${Math.floor(100 + Math.random() * 900)}`,
      filename: finalFilename,
      originalName: file.name,
      url: `/uploads/${finalFilename}`,
      size: originalSize,
      compressedSize,
      reductionPercent,
      category: (['products', 'categories', 'hero', 'brand', 'uploads'].includes(categoryParam)
        ? categoryParam
        : 'uploads') as AssetRecord['category'],
      createdAt: new Date().toISOString(),
    };

    addAssetRecord(assetRecord);

    return NextResponse.json(
      {
        success: true,
        message: `Image compressed successfully! Reduced by ${reductionPercent}% (${(originalSize / 1024).toFixed(1)} KB → ${(compressedSize / 1024).toFixed(1)} KB).`,
        data: assetRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Image compression error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Image compression and upload failed.' },
      { status: 500 }
    );
  }
}
