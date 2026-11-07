export const MAX_PHOTO_MB = 8;
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const SIZE = 256;

// Recorta la imagen al centro (cuadrada), la reduce a 256×256 y la devuelve como JPEG liviano
export async function toAvatarBlob(file) {
  if (!PHOTO_TYPES.includes(file.type)) throw new Error('tipo');
  if (file.size > MAX_PHOTO_MB * 1024 * 1024) throw new Error('tamano');
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; // los PNG con fondo transparente quedan sobre blanco
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
  bmp.close?.();
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('blob'))), 'image/jpeg', 0.85));
}

export const photoPath = (userId) => `${userId}/avatar.jpg`;
