// -----------------------------
// Replace with your Web App URL
// -----------------------------
const API_URL = "https://script.google.com/macros/s/AKfycby6ebYaX33JVaysalB1JHmNmgywk6V7l6OFGvFuZ7Oe7BpZ_qiChnPAmbt68NEHazO7Fw/exec";

// -----------------------------
// Get URL query parameter
// -----------------------------
function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

// -----------------------------
// Bind Vehicle Dashboard Buttons
// -----------------------------
function bindVehicleButtons() {
  const vin = getQueryParam("vin");
  if (!vin) return;

  document.getElementById("addMaintenanceBtn")?.addEventListener("click", () => {
    window.location.href = `maintenance.html?vin=${encodeURIComponent(vin)}`;
  });

  document.getElementById("viewHistoryBtn")?.addEventListener("click", () => {
    window.location.href = `history.html?vin=${encodeURIComponent(vin)}`;
  });

  document.getElementById("scheduleBtn")?.addEventListener("click", () => {
    window.location.href = `schedule.html?vin=${encodeURIComponent(vin)}`;
  });
}

// -----------------------------
// Fetch Vehicles (for index.html)
// -----------------------------
async function fetchVehicles() {
  try {
    const response = await fetch(`${API_URL}?sheet=Vehicles`);
    const data = await response.json();
    displayVehicles(data);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    document.getElementById("vehicle-list").innerHTML = "<p>Unable to load vehicles.</p>";
  }
}

// -----------------------------
// Render Vehicle Cards (index.html)
// -----------------------------
function displayVehicles(vehicles) {
  const container = document.getElementById("vehicle-list");
  if (!container) return;
  container.innerHTML = "";

  vehicles.forEach(vehicle => {
    const card = document.createElement("div");
    card.className = "vehicle-card";
    card.innerHTML = `
      <h2>${vehicle.name} (${vehicle.year})</h2>
      <p><strong>Make:</strong> ${vehicle.make}</p>
      <p><strong>Model:</strong> ${vehicle.model}</p>
      <p><strong>VIN:</strong> ${vehicle.vin}</p>
    `;
    card.addEventListener("click", () => {
      window.location.href = `vehicle.html?vin=${encodeURIComponent(vehicle.vin)}`;
    });
    container.appendChild(card);
  });
}

// -----------------------------
// Load Emails for schedule.html
// -----------------------------
async function loadEmails() {
  try {
    const response = await fetch(`${API_URL}?emails=true`);
    const contacts = await response.json();
    return contacts; // array of {name, email}
  } catch (err) {
    console.error("Error loading emails:", err);
    return [];
  }
}
