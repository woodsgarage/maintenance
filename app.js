// ============================
// Configuration
// ============================
const VEHICLES_API_URL = "YOUR_WEB_APP_URL_HERE?sheet=Vehicles";
const MAINTENANCE_API_URL = "YOUR_WEB_APP_URL_HERE?sheet=Maintenance";

// ============================
// Utility Functions
// ============================
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatDate(ts) {
  if (!ts) return "N/A";
  const date = new Date(ts);
  if (isNaN(date)) return ts;
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

// ============================
// Vehicles Functions
// ============================
async function fetchVehicles() {
  try {
    const response = await fetch(VEHICLES_API_URL);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    return [];
  }
}

function displayVehicles(vehicles) {
  const container = document.getElementById("vehicle-list");
  if (!container) return;

  container.innerHTML = "";
  if (!vehicles.length) {
    container.innerHTML = "<p>No vehicles found.</p>";
    return;
  }

  vehicles.forEach(vehicle => {
    const card = document.createElement("div");
    card.className = "vehicle-card";
    card.innerHTML = `
      <h2>${vehicle.name} (${vehicle.year})</h2>
      <p><strong>Make:</strong> ${vehicle.make}</p>
      <p><strong>Model:</strong> ${vehicle.model}</p>
      <p><strong>VIN:</strong> ${vehicle.vin}</p>
      <button class="viewBtn">View Dashboard</button>
    `;
    card.querySelector(".viewBtn").addEventListener("click", () => {
      window.location.href = `vehicle.html?vin=${encodeURIComponent(vehicle.vin)}`;
    });
    container.appendChild(card);
  });
}

async function loadVehiclesPage() {
  const container = document.getElementById("vehicle-list");
  if (!container) return;
  container.innerHTML = "<p>Loading vehicles...</p>";
  const vehicles = await fetchVehicles();
  displayVehicles(vehicles);
}

// ============================
// Maintenance Functions
// ============================
async function fetchMaintenanceRecords() {
  try {
    const response = await fetch(MAINTENANCE_API_URL);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching maintenance records:", err);
    return [];
  }
}

function filterAndSortMaintenance(records, vin) {
  return records
    .filter(r => ((r.vin || r.VIN || "").toString().trim() === vin.trim()))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function displayMaintenance(records, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  if (!records.length) {
    container.innerHTML = "<p>No maintenance records found.</p>";
    return;
  }

  records.forEach(record => {
    const card = document.createElement("div");
    card.className = "vehicle-card";
    card.innerHTML = `
      <p><strong>Date:</strong> ${formatDate(record.timestamp)}</p>
      <p><strong>Mileage:</strong> ${record.odometer || "N/A"}</p>
      <p><strong>Service:</strong> ${record.service || "N/A"}</p>
      <p><strong>Parts:</strong> ${record.parts || "N/A"}</p>
      <p><strong>Notes:</strong> ${record.notes || "N/A"}</p>
    `;
    container.appendChild(card);
  });
}

// ============================
// Vehicle.html Button Bindings
// ============================
function bindVehicleButtons() {
  const vin = getQueryParam("vin");
  if (!vin) return;

  const addBtn = document.getElementById("addMaintenanceBtn");
  const historyBtn = document.getElementById("viewHistoryBtn");
  const scheduleBtn = document.getElementById("scheduleBtn");

  if (addBtn) addBtn.addEventListener("click", () => {
    window.location.href = `maintenance.html?vin=${encodeURIComponent(vin)}`;
  });
  if (historyBtn) historyBtn.addEventListener("click", () => {
    window.location.href = `history.html?vin=${encodeURIComponent(vin)}`;
  });
  if (scheduleBtn) scheduleBtn.addEventListener("click", () => {
    window.location.href = `schedule.html?vin=${encodeURIComponent(vin)}`;
  });
}

// ============================
// Initialization
// ============================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("vehicle-list")) loadVehiclesPage();
  if (document.getElementById("addMaintenanceBtn") ||
      document.getElementById("viewHistoryBtn") ||
      document.getElementById("scheduleBtn")) bindVehicleButtons();
});
