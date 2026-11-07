import { NextResponse } from 'next/server';
import { deleteAssetFile } from '@/lib/store';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const decodedFilename = decodeURIComponent(filename);

    const success = deleteAssetFile(decodedFilename);

    if (!success) {
      return NextResponse.json(
        { success: false, error: `Asset '${decodedFilename}' not found or could not be removed.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Asset '${decodedFilename}' permanently deleted from disk and library.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
