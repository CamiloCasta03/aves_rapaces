# Implementation Plan - Mapa de Aves Rapaces

## Goal Description
Create a premium, interactive web application that maps raptor birds ("Aves Rapaces") in **Colombia**. Users can view birds geographically based on their "Department of Origin". 
Key features:
- Interactive Map using Leaflet.js, centered on Colombia.
- Bird details including: Image, Family, Department, and Regular Food.
- High-end visual aesthetics: **Light Mode**, Minimalist, Purple color palette with complementary accents.

## User Review Required
- **Data Source**: JSON file.
- **Map Focus**: **Colombia**.
- **Design System**: TailwindCSS.
- **Logo**: Custom generated minimalist logo.

## Proposed Changes

### Project Structure (Vite + Vanilla JS + TailwindCSS)
- `index.html`: Main entry point.
- `main.js`: Application logic.
- `style.css`: Tailwind directives and custom overlays.
- `tailwind.config.js`: Configuration for Purple/Light theme.
- `data/birds.json`: JSON array containing bird objects.
    ```json
    {
      "id": 1,
      "name": "Águila Real",
      "image": "path/to/image.jpg",
      "family": "Accipitridae",
      "department": "Cundinamarca",
      "food": "Pequeños mamíferos",
      "coordinates": [4.6, -74.08] 
    }
    ```

### Aesthetics & Design
- **Theme**: **Light Mode**.
- **Color Palette**: 
    - Primary: Purple (various shades).
    - Accents: Complementary colors (e.g., Yellow/Gold, Soft Greens for nature).
    - Backgrounds: White/Off-white with soft purple tints.
- **UI Elements**: 
  - Glassmorphic overlay cards (Frosted glass effect, light borders).
  - Minimalist Logo (generated):
    ![Minimalist Purple Raptor Logo](C:/Users/sacos/.gemini/antigravity/brain/bb837a6d-abb4-49c0-bd6a-f35a65568feb/raptor_logo_minimalist_purple_1769550811875.png)
  - Clean typography (Inter or modern sans-serif).

### User Reporting Feature (New)
- **Interactive Reporting**: Users can click directly on the map to set location for a sighting.
- **Form Enhancements**: 
  - **Species Selection**: Autocomplete/Select for known species.
  - **Photo Upload**: Ability to upload local files (stored via Base64/LocalStorage).

## Verification Plan
### Automated Tests
- None planned for this MVP.

### Manual Verification (Critical)
- **Button Functionality Check**: Verify all interactive elements:
  - [ ] Sidebar Close Button.
  - [ ] "Add Species" FAB.
  - [ ] Modal Close Button.
  - [ ] Form Submit Button.
  - [ ] "Use Map Center" Button.
  - [ ] Landing Page "Explore" Button.
- **Map Interaction**: 
  - [ ] Click markers to open sidebar.
  - [ ] Click map (in reporting mode) to set coordinates.
- **Data Persistence**: Verify custom birds survive page reload.
- **Responsiveness**: Check mobile vs desktop layout.
