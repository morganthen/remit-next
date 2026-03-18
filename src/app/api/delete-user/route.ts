// src/app/api/delete-user/route.ts
import { NextResponse } from 'next/server';
import { adminCreateClient, createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const ct = request.headers.get('content-type') || '';
    let id: string | undefined;

    if (ct.includes('application/json')) {
      const body = await request.json().catch(() => ({}));
      id = body?.id;
    } else {
      const form = await request.formData().catch(() => new FormData());
      id = form.get('id') as string | undefined;
    }

    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: 'not authenticated' }, { status: 401 });

    const admin = await adminCreateClient();

    const { error: deleteError } = await admin.auth.admin.deleteUser(id);
    if (deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 });

    if (user.id === id) {
      await supabase.auth.signOut();
      return NextResponse.json({ ok: true, redirect: '/login' });
    }

    return NextResponse.json({ ok: true, redirect: '/' });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'unknown error' },
      { status: 500 }
    );
  }
}
