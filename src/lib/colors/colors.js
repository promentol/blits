import colorsMap from './htmlColors'

const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const rgba =
  /^(rgba?)\((\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*),(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*),(\s*(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\s*)(,(\s*(-?\d+(?:\.\d+)?)\s*))?\)$/
const hsla =
  /^(hsla?)\((\s*(360|3[0-5][0-9]|[12]?[0-9]{1,2})\s*),(\s*(100|[1-9]?[0-9])\s*)%,(\s*(100|[1-9]?[0-9])\s*)%(,(\s*(1|0(?:\.\d+)?)\s*))?\)$/

const hexLookup = {}

const decimalToHex = (decimal) => {
  if (hexLookup[decimal] !== undefined) {
    return hexLookup[decimal]
  }

  const resp = parseInt(decimal).toString(16).padStart(2, '0')
  hexLookup[decimal] = resp
  return resp
}

export default {
  normalize: (color = '', defaultColor = '0xffffffff') => {
    color = color.toString()

    // its mappable, map it
    if (colorsMap[color] !== undefined) {
      return colorsMap[color]
    }

    // its a 0xRRGGBBAA color, store it and return it
    if (color.startsWith('0x') && color.length === 10) {
      colorsMap[color] = color
      return color
    }

    // check for hex color
    if (hex.test(color)) {
      color = color.replace('#', '').toLowerCase()
      if (color.length === 3) {
        color = color
          .split('')
          .map((c) => c + c)
          .join('')
      }

      const colorRGBA = '0x' + color.padEnd(8, 'f')
      colorsMap[color] = colorRGBA
      return colorRGBA
    }

    //rgb/a
    const rgbaMatch = rgba.exec(color)
    if (rgbaMatch) {
      const r = decimalToHex(rgbaMatch[3])
      const g = decimalToHex(rgbaMatch[5])
      const b = decimalToHex(rgbaMatch[7])
      let a = 'ff'

      if (rgbaMatch[10] && rgbaMatch[1] === 'rgba') {
        const alpha = Math.min(Math.max(Math.round(parseFloat(rgbaMatch[10]) * 255), 0), 255)
        a = decimalToHex(alpha)
      }

      const resp = '0x' + r + g + b + a
      colorsMap[color] = resp
      return resp
    }

    if (hsla.test(color)) {
      console.warn('HSL(A) color format is not supported yet')
      return '0xffffffff'
    }

    return defaultColor
  },
}
