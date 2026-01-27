# Guía de Diseño - Mapa de Aves Rapaces

## Filosofía Visual
Un diseño **Minimalista**, **Moderno** y **Premium**. Enfocado en la claridad, la luz y la naturaleza, utilizando el púrpura como color primario para evocar sofisticación y misterio, complementado con toques dorados y verdes suaves.

## Paleta de Colores

### Primarios (Púrpura)
- **Primary 500**: `#8B5CF6` (Base Púrpura Vibrante)
- **Primary 700**: `#6D28D9` (Púrpura Profundo - Textos/Bordes)
- **Primary 100**: `#EDE9FE` (Fondos Suaves)

### Acentos (Complementarios)
- **Gold/Yellow**: `#F59E0B` (Detalles, Iconos, Call to Action)
- **Soft Green**: `#10B981` (Indicadores de naturaleza/hábitat)

### Neutros (Light Mode)
- **Background**: `#F9FAFB` (Off-white / Gris muy claro)
- **Surface**: `#FFFFFF` (Blanco puro para tarjetas)
- **Text Main**: `#1F2937` (Gris oscuro, casi negro)
- **Text Muted**: `#6B7280` (Gris medio)

## Tipografía
**Familia**: `Inter` (Sans-serif moderna).
- **H1/Títulos**: Bold, Tracking tight.
- **Body**: Regular, buena legibilidad.

## Componentes y Estilos

### Glassmorphism (Efecto Vidrio)
Utilizado en tarjetas flotantes y modales.
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Sombras y Bordes
- Sombras suaves y difusas para dar elevación.
- Bordes redondeados amplios (`rounded-2xl` o `rounded-3xl`) para una sensación orgánica y amigable.

### Logo
Minimalista, geométrico, usando el púrpura primario. Ubicado en la esquina superior izquierda sobre el mapa.
