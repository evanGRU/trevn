import { NextResponse } from 'next/server';
import {createSupabaseAdminClient, createSupabaseServerClient} from '@/utils/supabase/server';

export async function DELETE() {
    const supabase = await createSupabaseServerClient();
    const supabaseAdmin = await createSupabaseAdminClient();

    const {data: { user }} = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) return NextResponse.json({ error: 'delete_user_failed', status: 500 });

    return NextResponse.json({ success: true });
}
