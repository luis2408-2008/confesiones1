/**
 * Generador de avatares dinámicos
 * Genera avatares SVG coloridos y únicos basados en identificadores
 */

class AvatarGenerator {
    constructor() {
        this.colors = [
            '#7209b7', // primary
            '#560bad', // primary-dark
            '#4cc9f0', // secondary
            '#3a86ff', // secondary-dark
            '#f72585', // accent
            '#7b2cbf',
            '#9d4edd',
            '#6930c3',
            '#5e60ce',
            '#5390d9',
            '#48bfe3',
            '#56cfe1',
            '#64dfdf',
            '#80ffdb'
        ];
        
        this.patterns = [
            this.generateCircles,
            this.generateTriangles,
            this.generateHexagons,
            this.generateWaves,
            this.generateZigzag,
            this.generateCrossPattern,
            this.generateDots,
            this.generateCheckered
        ];
    }
    
    // Hash simple para generar un número a partir de una cadena
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }
    
    // Obtiene un color aleatorio basado en un hash
    getColor(hash, index = 0) {
        return this.colors[(hash + index) % this.colors.length];
    }
    
    // Genera círculos aleatorios
    generateCircles(hash, bgColor) {
        let circles = '';
        const numCircles = 3 + (hash % 5);
        
        for (let i = 0; i < numCircles; i++) {
            const x = 10 + (hash * (i + 1)) % 80;
            const y = 10 + (hash * (i + 2)) % 80;
            const radius = 5 + (hash * (i + 3)) % 20;
            const color = this.getColor(hash, i);
            const opacity = 0.2 + ((hash * (i + 4)) % 6) / 10;
            
            circles += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="${opacity}" />`;
        }
        
        return circles;
    }
    
    // Genera triángulos aleatorios
    generateTriangles(hash, bgColor) {
        let triangles = '';
        const numTriangles = 2 + (hash % 4);
        
        for (let i = 0; i < numTriangles; i++) {
            const x1 = (hash * (i + 1)) % 100;
            const y1 = (hash * (i + 2)) % 100;
            const x2 = (hash * (i + 3)) % 100;
            const y2 = (hash * (i + 4)) % 100;
            const x3 = (hash * (i + 5)) % 100;
            const y3 = (hash * (i + 6)) % 100;
            const color = this.getColor(hash, i);
            const opacity = 0.2 + ((hash * (i + 7)) % 6) / 10;
            
            triangles += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="${color}" opacity="${opacity}" />`;
        }
        
        return triangles;
    }
    
    // Genera hexágonos aleatorios
    generateHexagons(hash, bgColor) {
        let hexagons = '';
        const numHexagons = 2 + (hash % 3);
        
        for (let i = 0; i < numHexagons; i++) {
            const centerX = 20 + (hash * (i + 1)) % 60;
            const centerY = 20 + (hash * (i + 2)) % 60;
            const radius = 10 + (hash * (i + 3)) % 30;
            const color = this.getColor(hash, i);
            const opacity = 0.2 + ((hash * (i + 4)) % 6) / 10;
            const rotation = (hash * (i + 5)) % 60;
            
            let points = '';
            for (let j = 0; j < 6; j++) {
                const angle = ((j * 60) + rotation) * Math.PI / 180;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                points += `${x},${y} `;
            }
            
            hexagons += `<polygon points="${points}" fill="${color}" opacity="${opacity}" />`;
        }
        
        return hexagons;
    }
    
    // Genera ondas aleatorias
    generateWaves(hash, bgColor) {
        let waves = '';
        const numWaves = 1 + (hash % 3);
        
        for (let i = 0; i < numWaves; i++) {
            const startY = 20 + (hash * (i + 1)) % 60;
            const amplitude = 5 + (hash * (i + 2)) % 15;
            const frequency = 2 + (hash * (i + 3)) % 4;
            const color = this.getColor(hash, i);
            const opacity = 0.2 + ((hash * (i + 4)) % 6) / 10;
            const strokeWidth = 1 + (hash * (i + 5)) % 5;
            
            let path = `M 0,${startY} `;
            for (let x = 0; x <= 100; x += 5) {
                const y = startY + amplitude * Math.sin((x / 100) * Math.PI * frequency);
                path += `L ${x},${y} `;
            }
            
            waves += `<path d="${path}" stroke="${color}" stroke-width="${strokeWidth}" fill="none" opacity="${opacity}" />`;
        }
        
        return waves;
    }
    
    // Genera patrón de zigzag
    generateZigzag(hash, bgColor) {
        let zigzag = '';
        const numLines = 1 + (hash % 4);
        
        for (let i = 0; i < numLines; i++) {
            const startY = 10 + (hash * (i + 1)) % 80;
            const height = 5 + (hash * (i + 2)) % 20;
            const width = 10 + (hash * (i + 3)) % 20;
            const color = this.getColor(hash, i);
            const opacity = 0.2 + ((hash * (i + 4)) % 6) / 10;
            const strokeWidth = 1 + (hash * (i + 5)) % 3;
            
            let path = `M 0,${startY} `;
            for (let x = 0; x <= 100; x += width) {
                path += `L ${x},${startY + height} `;
                x += width;
                if (x <= 100) {
                    path += `L ${x},${startY} `;
                }
            }
            
            zigzag += `<path d="${path}" stroke="${color}" stroke-width="${strokeWidth}" fill="none" opacity="${opacity}" />`;
        }
        
        return zigzag;
    }
    
    // Genera patrón de cruces
    generateCrossPattern(hash, bgColor) {
        let crosses = '';
        const numCrosses = 3 + (hash % 6);
        
        for (let i = 0; i < numCrosses; i++) {
            const x = 10 + (hash * (i + 1)) % 80;
            const y = 10 + (hash * (i + 2)) % 80;
            const size = 3 + (hash * (i + 3)) % 12;
            const color = this.getColor(hash, i);
            const opacity = 0.2 + ((hash * (i + 4)) % 6) / 10;
            const strokeWidth = 1 + (hash * (i + 5)) % 3;
            const rotation = (hash * (i + 6)) % 45;
            
            crosses += `
                <g transform="rotate(${rotation}, ${x}, ${y})">
                    <path d="M ${x - size},${y} L ${x + size},${y} M ${x},${y - size} L ${x},${y + size}" 
                          stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}" />
                </g>
            `;
        }
        
        return crosses;
    }
    
    // Genera puntos aleatorios
    generateDots(hash, bgColor) {
        let dots = '';
        const numDots = 8 + (hash % 15);
        
        for (let i = 0; i < numDots; i++) {
            const x = 5 + (hash * (i + 1)) % 90;
            const y = 5 + (hash * (i + 2)) % 90;
            const radius = 1 + (hash * (i + 3)) % 5;
            const color = this.getColor(hash, i % 5);
            const opacity = 0.2 + ((hash * (i + 4)) % 6) / 10;
            
            dots += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="${opacity}" />`;
        }
        
        return dots;
    }
    
    // Genera patrón de cuadros
    generateCheckered(hash, bgColor) {
        let rects = '';
        const gridSize = 3 + (hash % 4);
        const cellSize = 100 / gridSize;
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if ((i + j) % 2 == (hash % 2)) {
                    const x = i * cellSize;
                    const y = j * cellSize;
                    const color = this.getColor(hash, (i * gridSize + j) % this.colors.length);
                    const opacity = 0.15 + ((hash * (i + j + 1)) % 3) / 10;
                    
                    rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" opacity="${opacity}" />`;
                }
            }
        }
        
        return rects;
    }
    
    // Genera el avatar SVG completo
    generateAvatar(id, size = 100) {
        const hash = this.hashCode(id.toString());
        const bgColor = this.getColor(hash);
        const patternFn = this.patterns[hash % this.patterns.length].bind(this);
        const pattern = patternFn(hash, bgColor);
        
        const svg = `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="${bgColor}" />
                ${pattern}
            </svg>
        `;
        
        return svg;
    }
    
    // Genera un avatar y lo establece como contenido de un elemento
    setAvatarForElement(element, id, size = 100) {
        if (!element) return;
        
        const avatar = this.generateAvatar(id, size);
        element.innerHTML = avatar;
    }
    
    // Genera avatar y devuelve la URL de datos
    generateAvatarUrl(id, size = 100) {
        const avatar = this.generateAvatar(id, size);
        return `data:image/svg+xml;charset=utf8,${encodeURIComponent(avatar)}`;
    }
    
    // Genera y establece avatares para múltiples elementos
    initAvatars() {
        document.querySelectorAll('[data-avatar-id]').forEach(element => {
            const id = element.getAttribute('data-avatar-id');
            if (id) {
                if (element.tagName.toLowerCase() === 'img') {
                    // Si es una imagen, establecer src
                    element.src = this.generateAvatarUrl(id, element.getAttribute('data-avatar-size') || 100);
                } else {
                    // Si es otro elemento, insertar SVG
                    this.setAvatarForElement(element, id, element.getAttribute('data-avatar-size') || 100);
                }
            }
        });
    }
}

// Crear instancia y ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    window.avatarGenerator = new AvatarGenerator();
    window.avatarGenerator.initAvatars();
});