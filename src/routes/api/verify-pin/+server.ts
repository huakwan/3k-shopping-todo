import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { APP_PIN } from '$env/static/private';

// Endpoint นี้รับ PIN จาก client แล้วเทียบกับค่าใน .env (APP_PIN)
// PIN ที่ถูกต้องจะไม่ถูกส่งไปให้ client เห็นเด็ดขาด — เทียบกันฝั่ง server เท่านั้น
export const POST: RequestHandler = async ({ request }) => {
	const { pin } = await request.json();

	if (typeof pin !== 'string') {
		return json({ ok: false, error: 'รูปแบบ PIN ไม่ถูกต้อง' }, { status: 400 });
	}

	if (!APP_PIN) {
		console.error('APP_PIN ยังไม่ได้ตั้งค่าใน .env');
		return json({ ok: false, error: 'ระบบยังไม่ได้ตั้งค่า PIN กรุณาติดต่อผู้ดูแล' }, { status: 500 });
	}

	const isValid = pin === APP_PIN;

	if (!isValid) {
		return json({ ok: false, error: 'รหัสไม่ถูกต้อง' }, { status: 401 });
	}

	return json({ ok: true });
};
