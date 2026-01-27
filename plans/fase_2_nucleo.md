# Fase 2: Núcleo y Lógica del Mapa

## Objetivo
Implementar la lógica principal del mapa, cargar datos geográficos y mostrar marcadores en Colombia.

## Sprint 1: Modelo de Datos
- [ ] Crear archivo `data/birds.json`
- [ ]  Definir estructura del objeto "Ave":
    ```json
    {
        "id": "unique_id",
        "common_name": "Nombre Común",
        "scientific_name": "Nombre Científico",
        "family": "Familia",
        "description": "Breve descripción",
        "food": "Alimentación principal",
        "location": {
            "department": "Nombre Departamento",
            "lat": 0.0,
            "lng": 0.0
        },
        "image": "url_to_image"
    }
    ```
- [ ] Popular datos de prueba (mocks) para al menos 5 departamentos de Colombia.

## Sprint 2: Implementación de Leaflet
- [ ] Inicializar mapa en `main.js`
- [ ] Configurar vista inicial centrada en Colombia (Lat: 4.5709, Lng: -74.2973, Zoom: 6)
- [ ] Añadir capa de tiles (e.g., CartoDB Positron para estilo "Light/Minimalista")
- [ ] Crear función para leer `birds.json`
- [ ] Renderizar marcadores dinámicamente basados en las coordenadas
