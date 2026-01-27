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
  activeBird: null
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
  image: document.getElementById('sidebar-image')
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
    app.birds = await response.json();
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

  // Show Sidebar
  ui.sidebar.classList.remove('translate-x-full');
}

const closeSidebar = () => {
  ui.sidebar.classList.add('translate-x-full');

  // Optionally zoom out slightly or return to bounds? 
  // For now, let's just keep position to not annoy user
}

// --- Event Listeners ---
// --- Event Listeners ---
if (ui.closeBtn) {
  ui.closeBtn.addEventListener('click', closeSidebar);
}

// Start App
if (document.getElementById('map')) {
  initMap();
  loadData();
}
