import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function handleBlock(req: Request) {
  const body = await req.json().catch(() => ({}));
  const blocked_id = body.blocked_id;
  const reason = body.reason || null;

  // derive requester id from bearer token
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.split(' ')[1];
  if (!token) return new Response(JSON.stringify({ error: 'missing auth token' }), { status: 401 });

  const { data: userData, error: userErr } = await supabase.auth.getUser(token as string);
  if (userErr || !userData?.user) {
    console.error('auth error', userErr);
    return new Response(JSON.stringify({ error: 'invalid auth token' }), { status: 401 });
  }
  const blocker_id = userData.user.id;

  if (!blocker_id || !blocked_id) {
    return new Response(JSON.stringify({ error: 'missing blocker_id or blocked_id' }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('blocked_users')
    .upsert({ blocker_id, blocked_id, reason }, { onConflict: '(blocker_id, blocked_id)' })
    .select('*')
    .single();

  if (error) {
    console.error('block error', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, blocked: data }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleMute(req: Request, convId: string) {
  const body = await req.json().catch(() => ({}));
  const muted = typeof body.muted === 'boolean' ? body.muted : true;

  // derive requester id from bearer token
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.split(' ')[1];
  if (!token) return new Response(JSON.stringify({ error: 'missing auth token' }), { status: 401 });

  const { data: userData, error: userErr } = await supabase.auth.getUser(token as string);
  if (userErr || !userData?.user) {
    console.error('auth error', userErr);
    return new Response(JSON.stringify({ error: 'invalid auth token' }), { status: 401 });
  }
  const requester_id = userData.user.id;

  const { data: conv, error: gerr } = await supabase
    .from('conversations')
    .select('id,buyer_id,seller_id,buyer_muted,seller_muted')
    .eq('id', convId)
    .single();

  if (gerr || !conv) {
    return new Response(JSON.stringify({ error: 'conversation not found' }), { status: 404 });
  }

  const updates: any = { updated_at: new Date().toISOString() };
  if (conv.buyer_id === requester_id) updates.buyer_muted = muted;
  if (conv.seller_id === requester_id) updates.seller_muted = muted;

  const { data: upd, error: uerr } = await supabase
    .from('conversations')
    .update(updates)
    .eq('id', convId)
    .select('*')
    .single();

  if (uerr) {
    return new Response(JSON.stringify({ error: uerr.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, conversation: upd }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace(/\/+$/, '');

    if (req.method === 'POST' && pathname.endsWith('/block')) {
      return await handleBlock(req);
    }

    // mute: PATCH /mute/:conversation_id or /conversations/:id/mute
    if ((req.method === 'PATCH' || req.method === 'POST') && pathname.includes('/mute')) {
      const parts = pathname.split('/').filter(Boolean);
      const convId = parts[parts.length - 1];
      return await handleMute(req, convId);
    }

    return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'internal' }), { status: 500 });
  }
});
