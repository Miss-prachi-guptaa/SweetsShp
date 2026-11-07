import { NextResponse } from 'next/server';
import { updateContactStatus, deleteContactInquiry } from '@/lib/store';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['UNREAD', 'READ', 'REPLIED', 'RESOLVED'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status value.' }, { status: 400 });
    }

    const updated = updateContactStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Inquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteContactInquiry(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Inquiry not found or already deleted.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
