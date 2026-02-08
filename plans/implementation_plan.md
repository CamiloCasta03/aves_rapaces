# Implementation Plan - User Reporting Feature

## Goal Description
Enhance the "Add Bird" functionality to allow users to interactively report sightings. This includes clicking on the map to define the location, uploading local photos, and selecting species from a suggestion list.

## User Review Required
> [!NOTE]
> Images will be stored in `LocalStorage` as Base64 strings. This is suitable for a prototype but has a storage limit (usually ~5MB). Large images might be rejected or fill the storage quickly.

## Proposed Changes

### Logic (`src/main.js`)
#### [MODIFY] [main.js](file:///c:/Users/sacos/Desktop/proyectos/aves_rapaces/src/main.js)
- **Map Interaction**:
  - Implement a "Pick Location" mode.
  - When active, change cursor to `crosshair`.
  - On map click: capture `lat/lng`, fill form inputs, and restore normal cursor.
- **Image Handling**:
  - Add `handleImageUpload` helper using `FileReader` to convert files to Base64.
  - Update `handleAddBird` to use the Base64 string instead of a URL.
- **Species Data**:
  - Extract unique species names from `app.birds`.
  - Populate a new `<datalist id="species-list">`.

### UI/HTML (`app.html`)
#### [MODIFY] [app.html](file:///c:/Users/sacos/Desktop/proyectos/aves_rapaces/app.html)
- **Form Formats**:
  - Change `common_name` input to use `list="species-list"`.
  - Add `<datalist id="species-list">`.
  - Change `image` input type from `url` to `file`.
  - Add an `<img id="image-preview">` to show the selected photo.
- **Location Controls**:
  - Add a "📍 Pick on Map" button next to coordinates.

### Styling (`src/style.css`)
- Ensure file input triggers a nice custom button style if possible, or just standard styling matching the theme.

## Verification Plan
### Manual Verification
1. **Selection on Map**:
   - Open specific "Add" modal.
   - Click "Pick on Map".
   - Click a location on the map.
   - Verify Lat/Lng inputs are updated.
2. **Photo Upload**:
   - Upload a `.jpg` or `.png`.
   - Verify preview appears.
   - Save bird.
   - Verify the new bird marker appears and sidebar shows the uploaded image.
3. **Species Autocomplete**:
   - Type "Aguila" and see suggestions.
4. **Button Sanity Check**:
   - Test all close/cancel buttons.
