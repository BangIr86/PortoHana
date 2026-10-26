import fs from 'fs';
import path from 'path';

// Daftar direktori dan file cache yang dibersihkan
const cacheTargets = [
  'node_modules/.vite',
  '.vite',
  'node_modules/.cache',
  'tsconfig.tsbuildinfo'
];

console.log('🧹 Membersihkan cache sistem...');

for (const target of cacheTargets) {
  try {
    const fullPath = path.resolve(process.cwd(), target);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✓ Cache dihapus: ${target}`);
    }
  } catch (err) {
    // Abaikan jika tidak ada izin khusus atau file sedang digunakan
    console.warn(`! Lewati ${target}: ${err.message}`);
  }
}

console.log('✨ Selesai: Semua cache berhasil dibersihkan.');
