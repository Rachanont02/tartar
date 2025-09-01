# TarTar — PWA (iOS Add to Home Screen)
ธีมพาสเทล เทา/ขาว/เหลืองทอง สำหรับเก็บความทรงจำคู่รักและผู้ช่วยท่องเที่ยว

## Deploy บน GitHub Pages
1) สร้าง repo Public (เช่น `tartar`)
2) อัปโหลดไฟล์ทั้งหมดไปยัง branch `main`
3) Settings → Pages → Source: Deploy from a branch → Branch: `main` / `(root)`
4) เปิด URL `https://<user>.github.io/<repo>/` ด้วย Safari → Share → Add to Home Screen

> ถ้าเสิร์ฟภายใต้ subpath (เช่น `/tartar/`) ให้แก้ `manifest.json`:
```
"start_url": "/tartar/",
"scope": "/tartar/"
```
และพิจารณาใช้พาธสัมพัทธ์ใน `sw.js` (ตั้งไว้แล้วเป็นสัมพัทธ์)
