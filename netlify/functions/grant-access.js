const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  if (event.headers['x-admin-key'] !== process.env.ADMIN_SECRET) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };

  try {
    const { email, reason } = JSON.parse(event.body);
    if (!email) return { statusCode: 400, body: JSON.stringify({ error: 'Email required' }) };

    const { data: users, error: lookupErr } = await supabase.auth.admin.listUsers();
    if (lookupErr) throw lookupErr;
    const user = users.users.find(u => u.email === email);
    if (!user) return { statusCode: 404, body: JSON.stringify({ error: `No account found for ${email}` }) };

    const { error } = await supabase.from('user_access').upsert({
      user_id: user.id, has_access: true, access_type: 'granted',
      granted_by: reason || 'Manual grant', updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (error) throw error;

    return { statusCode: 200, body: JSON.stringify({ success: true, message: `Access granted to ${email}` }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
