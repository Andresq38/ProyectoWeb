let map;
let directionsService;
let directionsRenderer;
let userMarker; // marcador del usuario
let userLocation; // ubicación actual del usuario

// Coordenadas de la sucursal
const tiendaCoords = { lat: 10.005097, lng: -84.218776 };

function initMap() {
  // Crear mapa centrado en la tienda
  map = new google.maps.Map(document.getElementById("map"), {
    center: tiendaCoords,
    zoom: 15,
  });

  // Marcador de la tienda
  new google.maps.Marker({
    position: tiendaCoords,
    map: map,
    title: "Sucursal ClassyShaps",
  });

  // Inicializar servicios de direcciones
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // Obtener ubicación inicial del usuario
  actualizarUbicacion();

  // Asignar evento al botón
  document.getElementById("refreshLocation").addEventListener("click", () => {
    actualizarUbicacion();
  });

  // Crear inputs para ubicación manual
  const manualDiv = document.createElement("div");
  manualDiv.className = "text-center mt-3";
  manualDiv.innerHTML = `
    <label for="manualLat" class="form-label">Latitud manual:</label>
    <input type="number" step="any" id="manualLat" class="form-control mb-2" style="max-width:200px;display:inline-block;">
    <label for="manualLng" class="form-label">Longitud manual:</label>
    <input type="number" step="any" id="manualLng" class="form-control mb-2" style="max-width:200px;display:inline-block;">
    <button id="setManualLocation" class="btn btn-secondary mt-2">Usar ubicación manual</button>
  `;
  const container = document.querySelector(".container.my-5");
  if (container) container.appendChild(manualDiv);

  document.getElementById("setManualLocation").addEventListener("click", () => {
    const lat = parseFloat(document.getElementById("manualLat").value);
    const lng = parseFloat(document.getElementById("manualLng").value);
    if (!isNaN(lat) && !isNaN(lng)) {
      setManualLocation(lat, lng);
    } else {
      alert("Por favor ingresa valores válidos para latitud y longitud.");
    }
  });

  // Si el usuario ya ingresó manualmente, usar esa ubicación
  if (window.manualUserLocation) {
    setManualLocation(window.manualUserLocation.lat, window.manualUserLocation.lng);
  }
function setManualLocation(lat, lng) {
  userLocation = { lat, lng };
  window.manualUserLocation = userLocation;
  document.getElementById("distancia").innerHTML = `<strong>Tu ubicación (manual):</strong> ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  if (userMarker) {
    userMarker.setPosition(userLocation);
  } else {
    userMarker = new google.maps.Marker({
      position: userLocation,
      map: map,
      title: "Tu ubicación (manual)",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      },
    });
  }
  map.setCenter(userLocation);
  calcularDistancia(userLocation);
  trazarRuta(userLocation, tiendaCoords);
}
}

function actualizarUbicacion() {
  const btn = document.getElementById("refreshLocation");
  if (btn) btn.disabled = true;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("Ubicación obtenida:", userLocation);
        document.getElementById("distancia").innerHTML = `<strong>Tu ubicación:</strong> ${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`;

        // Si ya existe un marcador de usuario, actualizarlo
        if (userMarker) {
          userMarker.setPosition(userLocation);
        } else {
          // Si no, crearlo
          userMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Tu ubicación",
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            },
          });
        }

        // Centrar mapa en el usuario
        map.setCenter(userLocation);

        // Calcular distancia y trazar ruta
        calcularDistancia(userLocation);
        trazarRuta(userLocation, tiendaCoords);
        if (btn) btn.disabled = false;
      },
      (error) => {
        alert("No se pudo obtener tu ubicación.");
        console.error("Error de geolocalización:", error);
        if (btn) btn.disabled = false;
      }
    );
  } else {
    alert("Tu navegador no soporta geolocalización.");
    if (btn) btn.disabled = false;
  }
}

function calcularDistancia(origen) {
  const servicio = new google.maps.DistanceMatrixService();
  servicio.getDistanceMatrix(
    {
      origins: [origen],
      destinations: [tiendaCoords],
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        const distancia = response.rows[0].elements[0].distance.text;
        const duracion = response.rows[0].elements[0].duration.text;
        // Añadir info de distancia debajo de la ubicación
        document.getElementById("distancia").innerHTML += `<br><strong>Distancia a tienda:</strong> ${distancia} <br><strong>Duración estimada:</strong> ${duracion}`;
      } else {
        document.getElementById("distancia").innerHTML += `<br>No se pudo calcular distancia.`;
      }
    }
  );
}

function trazarRuta(origen, destino) {
  directionsService.route(
    {
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
      } else {
        alert("No se pudo trazar la ruta.");
      }
    }
  );
}

window.initMap = initMap;
