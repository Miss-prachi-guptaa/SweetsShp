import { NextResponse } from 'next/server';
import { getContactInquiries, createContactInquiry } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();

    let items = getContactInquiries();

    if (status && status !== 'ALL') {
      items = items.filter((item) => item.status === status);
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.phone.includes(search) ||
          (item.email && item.email.toLowerCase().includes(search)) ||
          item.message.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, data: items, count: items.length });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, requirement, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, phone number, and message are required fields.' },
        { status: 400 }
      );
    }

    const inquiry = createContactInquiry({
      name,
      phone,
      email,
      requirement,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been submitted to the Chicksum team.',
        data: inquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
