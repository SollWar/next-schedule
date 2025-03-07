/**
 * Вычисляет относительную luminance (светимость) цвета в формате RGB.
 * @param r - Красный канал (0-255)
 * @param g - Зеленый канал (0-255)
 * @param b - Синий канал (0-255)
 * @returns Luminance (светимость) в диапазоне от 0 до 1
 */
function getLuminance(r: number, g: number, b: number): number {
  const sRGB = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
}

/**
 * Определяет, является ли цвет светлым.
 * @param r - Красный канал (0-255)
 * @param g - Зеленый канал (0-255)
 * @param b - Синий канал (0-255)
 * @returns true, если цвет светлый, иначе false
 */
function isLightColor(r: number, g: number, b: number): boolean {
  const luminance = getLuminance(r, g, b)
  return luminance > 0.5 // Порог для определения светлого цвета
}

/**
 * Возвращает контрастный цвет текста для заданного цвета фона.
 * @param backgroundColor - Цвет фона в формате RGB (например, { r: 255, g: 255, b: 255 })
 * @returns Контрастный цвет текста в формате RGB (черный или белый)
 */
export function getContrastTextColor(backgroundColor: string) {
  try {
    const { r, g, b } = hexToRgb(backgroundColor)

    // Если цвет светлый, возвращаем черный, иначе — белый
    return isLightColor(r, g, b) ? 'black' : 'white'
  } catch (error) {
    console.warn(error)
    return 'black'
  }
}

/**
 * Преобразует HEX-цвет в RGB.
 * @param hex - HEX-цвет (например, "#FFA500")
 * @returns Объект с RGB-значениями
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    throw new Error('Invalid HEX color')
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

// /**
//  * Преобразует RGB-цвет в HEX-строку.
//  * @param r - Красный канал (0-255)
//  * @param g - Зеленый канал (0-255)
//  * @param b - Синий канал (0-255)
//  * @returns HEX-строка (например, "#FFA500")
//  */
// function rgbToHex(r: number, g: number, b: number): string {
//   // Преобразуем каждое значение в HEX и добавляем ведущий ноль, если необходимо
//   const toHex = (value: number) => {
//     const hex = value.toString(16)
//     return hex.length === 1 ? `0${hex}` : hex
//   }

//   // Объединяем HEX-значения и добавляем префикс "#"
//   return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
// }
