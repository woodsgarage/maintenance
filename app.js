const API_URL = "https://script.google.com/macros/s/AKfycbygOLuRZVHKzNfrdaN_pPleVDjisPgemaXr-LCB1p0WWd97vlQidv0MgCpDsCF8aZ_XlQ/exec";

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

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

async function fetchVehicles() {
  try {
    const response = await fetch(`${API_URL}?sheet=Vehicles`);
    const data = await response.json();
    displayVehicles(data);
  } catch (err) {
    console.error(err);
    document.getElementById("vehicle-list").innerHTML = "<p>Unable to load vehicles.</p>";
  }
}

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

async function loadEmails() {
  try {
    const response = await fetch(`${API_URL}?emails=true`);
    const contacts = await response.json();
    return contacts;
  } catch (err) {
    console.error("Error loading emails:", err);
    return [];
  }
}




