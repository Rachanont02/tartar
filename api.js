// === ตั้งค่าให้ตรงของคุณ ===
const API_BASE = 'https://script.google.com/macros/s/AKfycbzWk999jjvPybkLUgLsz5qpGfaJ4CqiSMO_opNvGYbIAOpMxGLirlpKC8bc29effFLt6g/exec'; // URL /exec จาก Deploy
const API_TOKEN = 'TOKEN = XksbUeMRS34MVhFfvyY3zyQYi2Z7HADX';

export async function listTrips() {
  const url = `${API_BASE}?action=list&token=${encodeURIComponent(API_TOKEN)}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Network error');
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'API error');
  return json.data.rows;
}

export async function addTrip(row) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ action: 'add', token: API_TOKEN, row })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'API error');
  return json.data.id;
}

export async function updateTrip(row) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ action: 'update', token: API_TOKEN, row })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'API error');
  return json.data.id;
}

export async function deleteTrip(id) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ action: 'delete', token: API_TOKEN, id })
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'API error');
  return json.data.id;
}
