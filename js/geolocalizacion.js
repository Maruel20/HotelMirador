// geolocalizacion.js - Script para Azure Maps

let map;
let marker;
let trafficVisible = false;
let currentStyle = 'road';

// Coordenadas del hotel (Chinú/Córdoba aprox basado en tus datos)
const hotelCoords = [-75.4044635, 9.104011];
const subscriptionKey = '2xmlGYCQi06PDLTHZbde9qo6vUo98f36Fyljx1PuMXl0b8jnFJLGJQQJ99BKACYeBjFaWbJDAAAgAZMP3GRv';

// --- MAPA PRINCIPAL (CONTACTO / INICIO) ---
function initAzureMap() {
    const mapContainer = document.getElementById('azureMap');
    
    // Si no existe el contenedor (ej. estamos en otra página), no hacemos nada
    if (!mapContainer) return;

    map = new atlas.Map('azureMap', {
        center: hotelCoords,
        zoom: 15,
        language: 'es-ES',
        authOptions: {
            authType: 'subscriptionKey',
            subscriptionKey: subscriptionKey
        },
        style: 'road',
        showFeedbackLink: false,
        showLogo: false
    });

    map.events.add('ready', function() {
        // Controles
        map.controls.add([
            new atlas.control.ZoomControl(),
            new atlas.control.StyleControl({
                mapStyles: ['road', 'satellite', 'satellite_road_labels', 'grayscale_dark', 'night']
            })
        ], { position: 'top-right' });

        // Marcador HTML personalizado
        const htmlMarker = new atlas.HtmlMarker({
            position: hotelCoords,
            htmlContent: `<div class="hotel-marker">🏨</div>`,
            pixelOffset: [0, -15]
        });
        map.markers.add(htmlMarker);

        // Popup
        const popup = new atlas.Popup({
            content: `
                <div class="map-popup">
                    <h3>🏨 Hotel Mirador</h3>
                    <p class="mb-1">¡Te esperamos!</p>
                    <p class="popup-details">📞 324 465 3741</p>
                </div>
            `,
            position: hotelCoords,
            pixelOffset: [0, -35]
        });
        popup.open(map); // Abrir por defecto

        // Obtener dirección texto
        getHotelAddress();
    });
}

// --- MINI MAPA EN FOOTER ---
// Esta función la llamaremos desde main.js cuando el footer se haya cargado
window.initFooterMap = function() {
  const footerContainer = document.getElementById('footer-map');
  if (!footerContainer) return;

  const footerMap = new atlas.Map('footer-map', {
    center: hotelCoords,
    zoom: 14,
    language: 'es-ES',
    authOptions: {
      authType: 'subscriptionKey',
      subscriptionKey: subscriptionKey
    },
    style: 'grayscale_light', // Estilo más sutil para el footer
    showFeedbackLink: false,
    showLogo: false,
    interactive: false // Desactivar zoom/scroll en el footer para no molestar
  });

  footerMap.events.add('ready', function () {
    const miniMarker = new atlas.HtmlMarker({
      position: hotelCoords,
      color: '#2aa9df'
    });
    footerMap.markers.add(miniMarker);
  });
};

// Obtener dirección (Geocodificación inversa)
function getHotelAddress() {
    const url = `https://atlas.microsoft.com/search/address/reverse/json?api-version=1.0&subscription-key=${subscriptionKey}&query=${hotelCoords[1]},${hotelCoords[0]}&language=es-ES`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.addresses && data.addresses.length > 0) {
                const address = data.addresses[0].address.freeformAddress;
                const el = document.getElementById('hotel-address');
                if (el) el.textContent = address;
            }
        })
        .catch(console.error);
}

// Utilidades globales
function openDirections() {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${hotelCoords[1]},${hotelCoords[0]}`, '_blank');
}

function shareLocation() {
    const url = `https://www.google.com/maps/search/?api=1&query=${hotelCoords[1]},${hotelCoords[0]}`;
    if (navigator.share) {
        navigator.share({ title: 'Hotel Mirador', url: url }).catch(console.error);
    } else {
        navigator.clipboard.writeText(url).then(() => alert('Link copiado'));
    }
}

function toggleMapSatellite() {
    if (!map) return;
    const newStyle = currentStyle === 'road' ? 'satellite_road_labels' : 'road';
    map.setStyle({ style: newStyle });
    currentStyle = newStyle;
}

function toggleMapTraffic() {
    if (!map) return;
    trafficVisible = !trafficVisible;
    map.setTraffic({ flow: trafficVisible ? 'relative' : 'none', incidents: trafficVisible });
    const btn = document.getElementById('btn-traffic');
    if (btn) btn.textContent = trafficVisible ? '🚦 Ocultar' : '🚦 Tráfico';
}

// Inicializar mapa principal al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAzureMap, 100);
});