// ---------------------------
// CONFIG
// ---------------------------

// Replace with your Google Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbweRW0iNKaGhtzgoB3KsoCGdWaHuIGb2v8JajWKVcVwBQQEbDu8y6mksrv5xRi2sc-Zjw/exec";

// ---------------------------
// HELPER FUNCTION: Get query parameter from URL
// ---------------------------
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// ---------------------------
// INDEX PAGE: Fetch and display vehicles
// ---------------------------
async function fetchVehicles() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      displayVehicles(data);
    } else {
      document.getElementById("vehicle-list").innerHTML =
        "<p>No vehicles found.</p>";
    }
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    document.getElementById("vehicle-list").innerHTML =
      "<p>Unable to load vehicles.</p>";
  }
}

// Render vehicle cards
function displayVehicles(vehicles) {
  const container = document.getElementById("vehicle-list");
  if (!container) return;

  container.innerHTML = ""; // Clear previous content

  vehicles.forEach(vehicle => {
    const card = document.createElement("div");
    card.className = "vehicle-card";
    card.innerHTML = `
      <h2>${vehicle.name} (${vehicle.year})</h2>
      <p><strong>Make:</strong> ${vehicle.make}</p>
      <p><strong>Model:</strong> ${vehicle.model}</p>
      <p><strong>VIN:</strong> ${vehicle.vin}</p>
      <p><strong>Start Mileage:</strong> ${vehicle.start_mileage}</p>
    `;

    // On click, go to vehicle dashboard
    card.onclick = () => {
      window.location.href = `vehicle.html?vin=${encodeURIComponent(vehicle.vin)}`;
    };

    container.appendChild(card);
  });
}

// ---------------------------
// VEHICLE DASHBOARD PAGE
// ---------------------------
async function loadVehicleDashboard() {
  const vin = getQueryParam("vin");
  if (!vin) return;

  try {
    const response = await fetch(API_URL);
    const vehicles = await response.json();
    const vehicle = vehicles.find(v => v.vin === vin);
    if (!vehicle) return;

    document.getElementById("vehicleTitle").textContent =
      `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

    // Dashboard buttons
    const viewHistoryBtn = document.getElementById("viewHistoryBtn");
    const addMaintenanceBtn = document.getElementById("addMaintenanceBtn");

    if (viewHistoryBtn) {
      viewHistoryBtn.onclick = () => {
        // Placeholder: go to history page
        window.location.href = `history.html?vin=${encodeURIComponent(vin)}`;
      };
    }

    if (addMaintenanceBtn) {
      addMaintenanceBtn.onclick = () => {
        // Go to maintenance form page
        window.location.href = `maintenance.html?vin=${encodeURIComponent(vin)}`;
      };
    }

  } catch (error) {
    console.error("Error loading vehicle dashboard:", error);
  }
}

// ---------------------------
// DETECT PAGE AND INIT
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  // INDEX PAGE
  if (document.getElementById("vehicle-list")) {
    fetchVehicles();
  }

  // VEHICLE DASHBOARD PAGE
  if (document.getElementById("vehicleTitle")) {
    loadVehicleDashboard();
  }
});
