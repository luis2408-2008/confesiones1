/**
 * Generador de avatares dinámicos
 * Genera avatares SVG coloridos y únicos basados en identificadores
 */

class AvatarGenerator {
    constructor() {
        this.colors = [
            '#7209b7', // Morado
            '#3a0ca3', // Azul Oscuro
            '#4361ee', // Azul 
            '#4cc9f0', // Azul Claro
            '#f72585', // Rosa
            '#7209b7', // Morado
            '#560bad', // Morado Oscuro
            '#480ca8', // Violeta
            '#3a0ca3', // Índigo
            '#3f37c9', // Azul Eléctrico
            '#4361ee', // Azul Medio
            '#4895ef', // Azul Cielo
            '#4cc9f0'  // Turquesa
        ];
        
        this.patternTypes = [
            'circles',
            'triangles',
            'hexagons',
            'waves',
            'zigzag',
            'crossPattern',
            'dots',
            'checkered'
        ];
    }
    
    /**
     * Genera un código hash para una cadena
     * @param {string} str - La cadena a convertir en hash
     * @return {number} El código hash
     */
    hashCode(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Conversión a entero de 32 bits
        }
        
        return Math.abs(hash);
    }
    
    /**
     * Obtiene un color basado en un hash y un índice
     * @param {number} hash - El valor hash
     * @param {number} index - El índice de color (opcional)
     * @return {string} El código de color hexadecimal
     */
    getColor(hash, index = 0) {
        const colorIndex = (hash + index) % this.colors.length;
        return this.colors[colorIndex];
    }
    
    /**
     * Genera patrón de círculos
     * @param {number} hash - El valor hash
     * @param {string} bgColor - El color de fondo
     * @return {string} El SVG generado
     */
    generateCircles(hash, bgColor) {
        let svg = `<rect width="100" height="100" fill="${bgColor}" />`;
        const circleCount = (hash % 8) + 3;
        
        for (let i = 0; i < circleCount; i++) {
            const cx = (hash + i * 5) % 100;
            const cy = (hash + i * 7) % 100;
            const r = ((hash + i) % 20) + 5;
            const color = this.getColor(hash, i);
            const opacity = ((hash + i) % 70 + 30) / 100;
            
            svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}" />`;
        }
        
        return svg;
    }
    
    /**
     * Genera patrón de triángulos
     * @param {number} hash - El valor hash
     * @param {string} bgColor - El color de fondo
     * @return {string} El SVG generado
     */
    generateTriangles(hash, bgColor) {
        let svg = `<rect width="100" height="100" fill="${bgColor}" />`;
        const triangleCount = (hash % 5) + 2;
        
        for (let i = 0; i < triangleCount; i++) {
            const x1 = (hash + i * 3) % 100;
            const y1 = (hash + i * 5) % 100;
            const x2 = (hash + i * 7) % 100;
            const y2 = (hash + i * 11) % 100;
            const x3 = (hash + i * 13) % 100;
            const y3 = (hash + i * 17) % 100;
            const color = this.getColor(hash, i);
            const opacity = ((hash + i) % 70 + 30) / 100;
            
            svg += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="${color}" opacity="${opacity}" />`;
        }
        
        return svg;
    }
    
    /**
     * Genera patrón de hexágonos
     * @param {number} hash - El valor hash
     * @param {string} bgColor - El color de fondo
     * @return {string} El SVG generado
     */
    generateHexagons(hash, bgColor) {
        let svg = `<rect width="100" height="100" fill="${bgColor}" />`;
        const hexSize = (hash % 15) + 10;
        
        for (let y = 0; y < 100; y += hexSize * 1.5) {
            for (let x = 0; x < 100; x += hexSize * 2) {
                const points = [];
                for (let i = 0; i < 6; i++) {
                    const angle = 2 * Math.PI / 6 * i;
                    const xPos = x + hexSize * Math.cos(angle);
                    const yPos = y + hexSize * Math.sin(angle);
                    points.push(`${xPos},${yPos}`);
                }
                
                const color = this.getColor(hash, x + y);
                const opacity = ((hash + x + y) % 40 + 10) / 100;
                
                svg += `<polygon points="${points.join(' ')}" fill="${color}" opacity="${opacity}" />`;
            }
        }
        
        return svg;
    }
    
    /**
     * Genera patrón de ondas
     * @param {number} hash - El valor hash
     * @param {string} bgColor - El color de fondo
     * @return {string} El SVG generado
     */
    generateWaves(hash, bgColor) {
        let svg = `<rect width="100" height="100" fill="${bgColor}" />`;
        const waveCount = (hash % 5) + 2;
        const amplitude = (hash % 10) + 5;
        const frequency = (hash % 5) + 1;
        
        for (let i = 0; i < waveCount; i++) {
            let path = `<path d="M0,${30 + i * 20} `;
            
            for (let x = 0; x <= 100; x += 10) {
                const y = 30 + i * 20 + Math.sin(x * frequency * 0.1) * amplitude;
                path += `L${x},${y} `;
            }
            
            const color = this.getColor(hash, i);
            const opacity = ((hash + i) % 70 + 30) / 100;
            const strokeWidth = (hash % 3) + 1;
            
            path += `" stroke="${color}" stroke-width="${strokeWidth}" fill="none" opacity="${opacity}" />`;
            svg += path;
        }
        
        return svg;
    }
    
    /**
     * Genera patrón de zigzag
     * @param {number} hash - El valor hash
     * @param {string} bgColor - El color de fondo
     * @return {string} El SVG generado
     */
    generateZigzag(hash, bgColor) {
        let svg = `<rect width="100" height="100" fill="${bgColor}" />`;
        const lineCount = (hash % 5) + 3;
        const amplitude = (hash % 15) + 10;
        
        for (let i = 0; i < lineCount; i++) {
            let path = `<path d="M0,${20 + i * 20} `;
            let up = true;
            
            for (let x = 0; x <= 100; x += 10) {
                const y = 20 + i * 20 + (up ? -amplitude : amplitude);
                path += `L${x},${y} `;
                up = !up;
            }
            
            const color = this.getColor(hash, i);
            const opacity = ((hash + i) % 70 + 30) / 100;
            const strokeWidth = (hash % 3) + 1;
            
            path += `" stroke="${color}" stroke-width="${strokeWidth}" fill="none" opacity="${opacity}" />`;
            svg += path;
        }
        
        return svg;
    }
    
    /**
     * Genera patrón de cruces
     * @param {number} hash - El valor hash
     * @param {string} bgColor - El color de fondo
     * @return {string} El SVG generado
     */
    generateCrossPattern(hash, bgColor) {
        let svg = `<rect width="100" height="100" fill="${bgColor}" />`;
        const gridSize = (hash % 5) + 3;
        const cellSize = 100 / gridSize;
        const crossSize = cellSize * 0.6;
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const centerX = x * cellSize + cellSize / 2;
                const centerY = y * cellSize + cellSize / 2;
                const color = this.getColor(hash, x + y * gridSize);
                const opacity = ((hash + x + y) % 70 + 30) / 100;
                const strokeWidth = (hash % 3) + 1;
                
                svg += `<line x1="${centerX - crossSize/2}" y1="${centerY}" x2="${centerX + crossSize/2}" y2="${centerY}" 
                         stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
                svg += `<line x1="${centerX}" y1="${centerY - crossSize/2}" x2="${centerX}" y2="${centerY + crossSize/2}" 
                         stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
            }
        }
        
        return svg;
    }
    
    /**
     * Genera patrón de puntos
     * @param {number} hash - El valor hash
     * @param {string} bgColor - El color de fondo
     * @return {string} El SVG generado
     */
    generateDots(hash, bgColor) {
        let svg = `<rect width="100" height="100" fill="${bgColor}" />`;
        const gridSize = (hash % 8) + 5;
        const cellSize = 100 / gridSize;
        const dotSize = (hash % 5) + 1;
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if ((x + y) % 2 === (hash % 2)) {
                    const centerX = x * cellSize + cellSize / 2;
                    const centerY = y * cellSize + cellSize / 2;
                    const color = this.getColor(hash, x + y * gridSize);
                    const opacity = ((hash + x + y) % 70 + 30) / 100;
                    
                    svg += `<circle cx="${centerX}" cy="${centerY}" r="${dotSize}" fill="${color}" opacity="${opacity}" />`;
                }
            }
        }
        
        return svg;
    }
    
    /**
     * Genera patrón de tablero de ajedrez
     * @param {number} hash - El valor hash
     * @param {string} bgColor - El color de fondo
     * @return {string} El SVG generado
     */
    generateCheckered(hash, bgColor) {
        let svg = `<rect width="100" height="100" fill="${bgColor}" />`;
        const gridSize = (hash % 4) + 2;
        const cellSize = 100 / gridSize;
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if ((x + y) % 2 === (hash % 2)) {
                    const color = this.getColor(hash, x + y * gridSize);
                    const opacity = ((hash + x + y) % 50 + 10) / 100;
                    
                    svg += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" 
                             fill="${color}" opacity="${opacity}" />`;
                }
            }
        }
        
        return svg;
    }
    
    /**
     * Genera un avatar basado en un ID
     * @param {string|number} id - El identificador para generar el avatar
     * @param {number} size - El tamaño del avatar en píxeles
     * @return {string} El SVG generado
     */
    generateAvatar(id, size = 100) {
        // Convertir el ID a cadena y generar el hash
        const idStr = String(id);
        const hash = this.hashCode(idStr);
        
        // Seleccionar color de fondo
        const bgColor = this.getColor(hash);
        
        // Seleccionar tipo de patrón basado en el hash
        const patternIndex = hash % this.patternTypes.length;
        const patternType = this.patternTypes[patternIndex];
        
        // Generar SVG según el tipo de patrón
        let patternSvg;
        switch (patternType) {
            case 'circles':
                patternSvg = this.generateCircles(hash, bgColor);
                break;
            case 'triangles':
                patternSvg = this.generateTriangles(hash, bgColor);
                break;
            case 'hexagons':
                patternSvg = this.generateHexagons(hash, bgColor);
                break;
            case 'waves':
                patternSvg = this.generateWaves(hash, bgColor);
                break;
            case 'zigzag':
                patternSvg = this.generateZigzag(hash, bgColor);
                break;
            case 'crossPattern':
                patternSvg = this.generateCrossPattern(hash, bgColor);
                break;
            case 'dots':
                patternSvg = this.generateDots(hash, bgColor);
                break;
            case 'checkered':
                patternSvg = this.generateCheckered(hash, bgColor);
                break;
            default:
                patternSvg = this.generateCircles(hash, bgColor);
        }
        
        // Generar SVG completo
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  ${patternSvg}
</svg>`;
    }
    
    /**
     * Establece el avatar para un elemento HTML
     * @param {HTMLElement} element - El elemento para establecer el avatar
     * @param {string|number} id - El identificador para generar el avatar
     * @param {number} size - El tamaño del avatar en píxeles
     */
    setAvatarForElement(element, id, size = 100) {
        const avatarSvg = this.generateAvatar(id, size);
        const dataUrl = 'data:image/svg+xml;base64,' + btoa(avatarSvg);
        
        if (element.tagName.toLowerCase() === 'img') {
            element.src = dataUrl;
        } else {
            element.style.backgroundImage = `url(${dataUrl})`;
        }
    }
    
    /**
     * Genera una URL de avatar
     * @param {string|number} id - El identificador para generar el avatar
     * @param {number} size - El tamaño del avatar en píxeles
     * @return {string} La URL de datos para el avatar
     */
    generateAvatarUrl(id, size = 100) {
        const avatarSvg = this.generateAvatar(id, size);
        return 'data:image/svg+xml;base64,' + btoa(avatarSvg);
    }
    
    /**
     * Inicializa avatares para elementos con data-avatar-id
     */
    initAvatars() {
        const avatarElements = document.querySelectorAll('[data-avatar-id]');
        
        avatarElements.forEach(element => {
            const id = element.getAttribute('data-avatar-id');
            const size = parseInt(element.getAttribute('data-avatar-size') || '100');
            
            this.setAvatarForElement(element, id, size);
        });
    }
}

// Crear instancia global
window.avatarGenerator = new AvatarGenerator();