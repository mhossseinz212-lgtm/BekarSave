/**
 * Utility functions for Persian digits and text formatting
 */

export const persianDigitsMap: { [key: string]: string } = {
  '0': '۰',
  '1': '۱',
  '2': '۲',
  '3': '۳',
  '4': '۴',
  '5': '۵',
  '6': '۶',
  '7': '۷',
  '8': '۸',
  '9': '۹',
};

/**
 * Converts English ASCII digits (0-9) to Persian digits (۰-۹)
 */
export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  return str.replace(/[0-9]/g, digit => persianDigitsMap[digit] || digit);
}

/**
 * Converts Persian (۰-۹) and Arabic (٠-٩) digits to English ASCII digits (0-9)
 */
export function toEnglishDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const aDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str
    .replace(/[۰-۹]/g, w => pDigits.indexOf(w).toString())
    .replace(/[٠-٩]/g, w => aDigits.indexOf(w).toString());
}

/**
 * Formats a 11-digit Iranian mobile phone with Persian digits
 * e.g. "09124551750" -> "۰۹۱۲۴۵۵۱۷۵۰" or "۰۹۱۲-۴۵۵-۱۷۵۰"
 */
export function formatPersianPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  return toPersianDigits(phone);
}

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage setItem failed:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.warn('sessionStorage setItem failed:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
};

/**
 * Compresses an image file (e.g. uploaded photo) to a lightweight JPEG Base64 string (max ~100-200KB).
 * Uses URL.createObjectURL and HTMLCanvasElement for fast, reliable compression without quota errors.
 */
export function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve) => {
    if (!file) {
      resolve('');
      return;
    }

    // For tiny files or SVG, use direct FileReader DataURL
    if (file.size < 60 * 1024 || file.type === 'image/svg+xml') {
      fallbackFileReader(file).then(resolve);
      return;
    }

    let objectUrl = '';
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      fallbackFileReader(file).then(resolve);
      return;
    }

    const img = new Image();

    const cleanup = () => {
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {
          // ignore
        }
      }
    };

    img.onload = () => {
      try {
        let width = img.width || 800;
        let height = img.height || 600;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          fallbackFileReader(file).then(resolve);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        cleanup();
        resolve(compressedDataUrl);
      } catch {
        cleanup();
        fallbackFileReader(file).then(resolve);
      }
    };

    img.onerror = () => {
      cleanup();
      fallbackFileReader(file).then(resolve);
    };

    img.src = objectUrl;
  });
}

function fallbackFileReader(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve((e.target?.result as string) || '');
      };
      reader.onerror = () => {
        resolve('');
      };
      reader.readAsDataURL(file);
    } catch {
      resolve('');
    }
  });
}
