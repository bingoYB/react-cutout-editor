export function createTransparentGridPattern(
  ctx: CanvasRenderingContext2D,
  size: {
    width: number;
    height: number;
  }
) {
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 16;
  patternCanvas.height = 16;
  const patternCtx = patternCanvas.getContext('2d');

  if (patternCtx) {
    // 设置背景
    patternCtx.fillStyle = '#dfdfdf';
    patternCtx.fillRect(0, 0, 16, 16);

    // 绘制方格
    patternCtx.fillStyle = '#d4d4d4';
    patternCtx.beginPath();
    patternCtx.moveTo(0, 0);
    patternCtx.lineTo(8, 0);
    patternCtx.lineTo(8, 8);
    patternCtx.lineTo(0, 8);
    patternCtx.closePath();
    patternCtx.fill();

    patternCtx.beginPath();
    patternCtx.moveTo(8, 8);
    patternCtx.lineTo(16, 8);
    patternCtx.lineTo(16, 16);
    patternCtx.lineTo(8, 16);
    patternCtx.closePath();
    patternCtx.fill();
  }

  ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat') as CanvasPattern;
  ctx.fillRect(0, 0, size.width, size.height);
}

export function getImageData(url: string) {
  return new Promise<{
    width: number;
    height: number;
    img: HTMLImageElement;
  }>((resolve, reject) => {
    const img = new Image(); // 创建一个 Image 对象
    img.crossOrigin = 'anonymous';
    img.src = url; // 设置图片 URL

    img.onload = () => {
      resolve({
        width: img.width, // 获取图片宽度
        height: img.height, // 获取图片高度
        img,
      });
    };

    img.onerror = error => {
      reject(new Error('image load error: ' + url + error));
    };

    img.onabort = () => {
      reject(new Error('image load abort: ' + url));
    };

    // 加载超时
    setTimeout(() => {
      reject(new Error('image load timeout: ' + url));
    }, 100000);
  });
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

export function defaultIsMaskFn(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b > 50;
}
export function isSameColor(color1: [number, number, number], color2: [number, number, number]) {
  const [r1, g1, b1] = color1;
  const [r2, g2, b2] = color2;
  return Math.abs(r1 - r2) < 5 && Math.abs(g1 - g2) < 5 && Math.abs(b1 - b2) < 5;
}

/**
 * 裁剪 Canvas 中的透明边界，只保留有内容的部分
 */
export function trimTransparent(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixels.data;
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = 0;
  let maxY = 0;

  // 扫描所有像素，找出非透明区域的边界
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];
      if (alpha > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // 如果没有非透明像素，返回原始 canvas
  if (minX > maxX || minY > maxY) {
    return canvas;
  }

  // 创建新的 canvas 并复制裁剪区域
  const trimmedCanvas = document.createElement('canvas');
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  trimmedCanvas.width = width;
  trimmedCanvas.height = height;

  const trimmedCtx = trimmedCanvas.getContext('2d');
  if (!trimmedCtx) return canvas;

  trimmedCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);

  return trimmedCanvas;
}
