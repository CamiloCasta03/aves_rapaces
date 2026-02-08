import './style.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// --- Configuration ---
const MAP_CONFIG = {
  center: [4.5709, -74.2973],
  zoom: 6,
  tileLayer: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}

// --- App State ---
const app = {
  map: null,
  birds: [],
  activeBird: null,
  markers: [] // Track markers for clearing
}

// --- UI Elements ---
const ui = {
  sidebar: document.getElementById('bird-sidebar'),
  closeBtn: document.getElementById('close-sidebar'),
  title: document.getElementById('sidebar-title'),
  scientific: document.getElementById('sidebar-scientific'),
  family: document.getElementById('sidebar-family'),
  description: document.getElementById('sidebar-description'),
  location: document.getElementById('sidebar-location'),
  food: document.getElementById('sidebar-food'),
  image: document.getElementById('sidebar-image'),
  // New UI Elements
  addBtn: document.getElementById('add-bird-btn'),
  modal: document.getElementById('add-bird-modal'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  addForm: document.getElementById('add-bird-form'),
  useMapCenterBtn: document.getElementById('use-map-center-btn'),
  latInput: document.getElementById('form-lat'),
  lngInput: document.getElementById('form-lng'),
  // New Reporting Feature Elements
  pickOnMapBtn: document.getElementById('pick-on-map-btn'),
  speciesList: document.getElementById('species-list'),
  imageFileInput: document.getElementById('image-file-input'),
  imagePreview: document.getElementById('image-preview'),
  imageBase64: document.getElementById('image-base64'),
  // Delete Feature
  deleteBtn: document.getElementById('delete-bird-btn')
}

// --- Initialization ---
const initMap = () => {
  // Create Map Container if not exists (handled by HTML structure, but good for safety)
  if (!document.getElementById('map')) return;

  app.map = L.map('map', {
    zoomControl: false,
    zoomAnimation: true,
    fadeAnimation: true,
    markerZoomAnimation: true
  }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

  L.tileLayer(MAP_CONFIG.tileLayer, {
    attribution: MAP_CONFIG.attribution,
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(app.map);

  L.control.zoom({ position: 'bottomright' }).addTo(app.map);

  // Close sidebar on map click
  app.map.on('click', () => {
    closeSidebar();
  });
}

const loadData = async () => {
  try {
    const response = await fetch('/data/birds.json');
    const staticBirds = await response.json();

    // Load custom birds from LocalStorage
    const storedBirds = localStorage.getItem('custom_birds');
    const customBirds = storedBirds ? JSON.parse(storedBirds) : [];

    app.birds = [...staticBirds, ...customBirds];
    renderMarkers();
  } catch (error) {
    console.error("Error loading bird data:", error);
  }
}

const renderMarkers = () => {
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="w-6 h-6 bg-primary-500 rounded-full border-4 border-white shadow-lg shadow-primary-500/40 transform hover:scale-110 transition-transform duration-300 flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  app.birds.forEach(bird => {
    const marker = L.marker([bird.location.lat, bird.location.lng], {
      icon: customIcon
    }).addTo(app.map);

    // Interaction
    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e); // Prevent map click
      openSidebar(bird);
      app.map.flyTo([bird.location.lat, bird.location.lng], 9, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    });

    // Track marker for cleanup
    app.markers.push(marker);
  });
}

// --- UI Logic ---
const openSidebar = (bird) => {
  app.activeBird = bird;

  // Populate Data
  ui.title.innerText = bird.common_name;
  ui.scientific.innerText = bird.scientific_name;
  ui.family.innerText = bird.family;
  ui.description.innerText = bird.description;
  ui.location.innerText = bird.location.department;
  ui.food.innerText = bird.food;
  ui.image.src = bird.image;

  // Show/hide delete button based on if bird is custom (has numeric id)
  if (ui.deleteBtn) {
    const isCustomBird = typeof bird.id === 'number';
    if (isCustomBird) {
      ui.deleteBtn.classList.remove('hidden');
    } else {
      ui.deleteBtn.classList.add('hidden');
    }
  }

  // Show Sidebar
  ui.sidebar.classList.remove('translate-x-full');
}

const closeSidebar = () => {
  ui.sidebar.classList.add('translate-x-full');
  app.activeBird = null;
}

// --- Delete Bird Feature ---
const clearMarkers = () => {
  app.markers.forEach(marker => marker.remove());
  app.markers = [];
}

const handleDeleteBird = () => {
  if (!app.activeBird) return;

  const birdId = app.activeBird.id;

  // Only allow deleting custom birds (numeric id)
  if (typeof birdId !== 'number') {
    alert('No se pueden eliminar las especies predeterminadas.');
    return;
  }

  // Confirm deletion
  if (!confirm(`¿Estás seguro de que deseas eliminar "${app.activeBird.common_name}"?`)) {
    return;
  }

  // 1. Remove from app.birds
  app.birds = app.birds.filter(bird => bird.id !== birdId);

  // 2. Remove from LocalStorage
  const storedBirds = localStorage.getItem('custom_birds');
  if (storedBirds) {
    const customBirds = JSON.parse(storedBirds);
    const updatedBirds = customBirds.filter(bird => bird.id !== birdId);
    localStorage.setItem('custom_birds', JSON.stringify(updatedBirds));
  }

  // 3. Clear and re-render markers
  clearMarkers();
  renderMarkers();

  // 4. Close sidebar
  closeSidebar();

  alert('¡Especie eliminada exitosamente!');
}

// --- Add Bird Feature Logic ---
let isPickingLocation = false;

const toggleModal = (show) => {
  if (show) {
    ui.modal.classList.remove('hidden');
    populateSpeciesList(); // Populate suggestions when opening modal
  } else {
    ui.modal.classList.add('hidden');
    exitPickLocationMode(); // Ensure we exit pick mode if modal closes
  }
}

// --- Pick Location Mode ---
const enterPickLocationMode = () => {
  isPickingLocation = true;
  toggleModal(false); // Hide modal temporarily
  app.map.getContainer().style.cursor = 'crosshair';

  // One-time click handler
  app.map.once('click', (e) => {
    ui.latInput.value = e.latlng.lat.toFixed(6);
    ui.lngInput.value = e.latlng.lng.toFixed(6);
    exitPickLocationMode();
    toggleModal(true); // Reopen modal with filled coordinates
  });
}

const exitPickLocationMode = () => {
  isPickingLocation = false;
  if (app.map) {
    app.map.getContainer().style.cursor = '';
  }
}

// --- Image Handling ---
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const base64String = event.target.result;
    ui.imageBase64.value = base64String;
    ui.imagePreview.src = base64String;
    ui.imagePreview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

// --- Species Autocomplete ---
const populateSpeciesList = () => {
  if (!ui.speciesList) return;

  // Get unique species names
  const speciesNames = [...new Set(app.birds.map(bird => bird.common_name))];

  // Clear and populate datalist
  ui.speciesList.innerHTML = '';
  speciesNames.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    ui.speciesList.appendChild(option);
  });
}

const handleAddBird = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  // Use Base64 image if available, otherwise fallback
  const imageValue = ui.imageBase64?.value || "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

  const newBird = {
    id: Date.now(), // Simple unique ID
    common_name: formData.get('common_name'),
    scientific_name: formData.get('scientific_name'),
    family: formData.get('family'),
    description: formData.get('description'),
    food: formData.get('food'),
    location: {
      department: formData.get('department') || "Personalizado",
      lat: parseFloat(formData.get('lat')),
      lng: parseFloat(formData.get('lng'))
    },
    image: imageValue
  };

  // 1. Add to App State
  app.birds.push(newBird);

  // 2. Persist to LocalStorage
  const storedBirds = localStorage.getItem('custom_birds');
  const customBirds = storedBirds ? JSON.parse(storedBirds) : [];
  customBirds.push(newBird);
  localStorage.setItem('custom_birds', JSON.stringify(customBirds));

  // 3. Render and Focus
  renderMarkers(); // Re-render all (inefficient but safe)

  // Fly to new bird
  app.map.flyTo([newBird.location.lat, newBird.location.lng], 10);

  // Close and Reset
  toggleModal(false);
  e.target.reset();

  // Reset preview
  if (ui.imagePreview) {
    ui.imagePreview.classList.add('hidden');
    ui.imagePreview.src = '';
  }
  if (ui.imageBase64) {
    ui.imageBase64.value = '';
  }

  alert('¡Especie agregada exitosamente!');
}

const fillMapCenter = () => {
  if (!app.map) return;
  const center = app.map.getCenter();
  ui.latInput.value = center.lat.toFixed(6);
  ui.lngInput.value = center.lng.toFixed(6);
}

// --- Event Listeners ---
if (ui.closeBtn) {
  ui.closeBtn.addEventListener('click', closeSidebar);
}

if (ui.addBtn) {
  ui.addBtn.addEventListener('click', () => toggleModal(true));
}

if (ui.closeModalBtn) {
  ui.closeModalBtn.addEventListener('click', () => toggleModal(false));
}

if (ui.addForm) {
  ui.addForm.addEventListener('submit', handleAddBird);
}

if (ui.useMapCenterBtn) {
  ui.useMapCenterBtn.addEventListener('click', fillMapCenter);
}

if (ui.pickOnMapBtn) {
  ui.pickOnMapBtn.addEventListener('click', enterPickLocationMode);
}

if (ui.imageFileInput) {
  ui.imageFileInput.addEventListener('change', handleImageUpload);
}

if (ui.deleteBtn) {
  ui.deleteBtn.addEventListener('click', handleDeleteBird);
}

// Start App
if (document.getElementById('map')) {
  initMap();
  loadData();
}
