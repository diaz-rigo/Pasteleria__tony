// color.helpers.ts

/**
 * Calcula el color de texto óptimo (claro u oscuro) basado en el color de fondo
 * usando el algoritmo de contraste YIQ
 * @param bg - Color de fondo en formato hexadecimal (#RRGGBB o #RGB)
 * @returns Color de texto recomendado (#000000 para fondos claros, #ffffff para fondos oscuros)
 */
export function getTextColor(bg: string): string {
    // Normalizar el color a formato #RRGGBB
    let bgColor = bg;
    if (bgColor.length === 4) {
        bgColor = '#' + [...bgColor.slice(1)].map(c => c + c).join('');
    }

    if (!isValidHexColor(bgColor)) {
        return '#000000'; // Valor por defecto si el color no es válido
    }

    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);

    // Luminancia relativa
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255 * 100;
    return luminance > 50 ? '#000000' : '#ffffff';
}

/**
 * Aclara u oscurece un color hexadecimal
 * @param color - Color en formato #RRGGBB o #RGB
 * @param percent - Porcentaje (-100 a 100)
 * @returns Color modificado
 */
export function adjustColorBrightness(color: string, percent: number): string {
    if (!isValidHexColor(color)) {
        return color; // Devuelve el color original si no es válido
    }

    // Normalizar el color a formato #RRGGBB
    let hexColor = color;
    if (hexColor.length === 4) {
        hexColor = '#' + [...hexColor.slice(1)].map(c => c + c).join('');
    }

    const num = parseInt(hexColor.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    
    const r = Math.max(0, Math.min(255, (num >> 16) + amt));
    const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));

    return '#' + (r * 0x10000 + g * 0x100 + b).toString(16).padStart(6, '0');
}

/**
 * Convierte un color hexadecimal a RGBA
 * @param hex - Color en formato #RRGGBB o #RGB
 * @param alpha - Opacidad (0-1)
 * @returns Cadena rgba(r, g, b, a)
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
    if (!isValidHexColor(hex)) {
        return `rgba(0, 0, 0, ${alpha})`; // Valor por defecto si el color no es válido
    }

    // Normalizar el color a formato #RRGGBB
    let hexColor = hex;
    if (hexColor.length === 4) {
        hexColor = '#' + [...hexColor.slice(1)].map(c => c + c).join('');
    }

    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Valida si un string es un color hexadecimal válido
 * @param color - Color a validar
 * @returns true si es válido
 */
export function isValidHexColor(color: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
}

/**
 * Genera un color hexadecimal aleatorio
 * @returns Color hexadecimal
 */
export function getRandomColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}
/**
 * Genera un color más fuerte para un degradado
 */
export function generateStrongGradientColor(baseColor: string): string {
    // Oscurecemos un poco el color base
    return adjustColorBrightness(baseColor, -30);
}

/**
 * Genera un degradado dinámico desde un color base
 * @param fromColor Color inicial
 */
export function getDynamicGradient(fromColor: string = '#fbeded'): string {
    const toColor = generateStrongGradientColor(fromColor);
    return `linear-gradient(to bottom right, ${fromColor}, ${toColor})`;
}
