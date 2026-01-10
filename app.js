// ---------------------------
// CONFIG
// ---------------------------
const API_URL = "https://script.google.com/macros/s/AKfycby6ebYaX33JVaysalB1JHmNmgywk6V7l6OFGvFuZ7Oe7BpZ_qiChnPAmbt68NEHazO7Fw/exec?sheet=Vehicles"; // Replace with your Google Apps Script URL

// ---------------------------
// HELPER: Get query parameter
// ---------------------------
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// ---------------------------
// INDEX: Load and display vehicles
// ---------------------------
async function fetchVehicles() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const container = document.getElementById("vehicle-list");

    if (!container) return;

    if (!data.length) {
      container.innerHTML = "<p>No vehicles found.</p>";
      return;
    }

    container.innerHTML = "";

    data.forEach(vehicle => {
      const card = document.createElement("div");
      card.className = "vehicle-card";
      card.innerHTML = `
        <h2>${vehicle.name} (${vehicle.year})</h2>
        <p><strong>Make:</strong> ${vehicle.make}</p>
        <p><strong>Model:</strong> ${vehicle.model}</p>
        <p><strong>VIN:</strong> ${vehicle.vin}</p>
        <p><strong>Start Mileage:</strong> ${vehicle.start_mileage}</p>
      `;

      card.onclick = () => {
        window.location.href = `vehicle.html?vin=${encodeURIComponent(vehicle.vin)}`;
      };

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
  }
}

// ---------------------------
// VEHICLE DASHBOARD
// ---------------------------
async function loadVehicleDashboard() {
  const vin = getQueryParam("vin");
  if (!vin) return;

  const response = await fetch(API_URL);
  const vehicles = await response.json();
  const vehicle = vehicles.find(v => v.vin === vin);
  if (!vehicle) return;

  document.getElementById("vehicleTitle").textContent =
    `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  const addBtn = document.getElementById("addMaintenanceBtn");
  const historyBtn = document.getElementById("viewHistoryBtn");

  if (addBtn) addBtn.onclick = () => {
    window.location.href = `maintenance.html?vin=${encodeURIComponent(vin)}`;
  };

  if (historyBtn) historyBtn.onclick = () => {
    window.location.href = `history.html?vin=${encodeURIComponent(vin)}`;
  };
}

// ---------------------------
// MAINTENANCE FORM PAGE
// ---------------------------
async function loadMaintenanceForm() {
  const vin = getQueryParam("vin");
  if (!vin) return;

  const response = await fetch(API_URL);
  const vehicles = await response.json();
  const vehicle = vehicles.find(v => v.vin === vin);
  if (!vehicle) return;

  document.getElementById("maintenanceVehicleTitle").textContent =
    `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  const form = document.getElementById("maintenanceForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      vin: vin,
      date: form.date.value,
      mileage: form.mileage.value,
      description: form.description.value,
      parts: form.parts.value
    };

    try {
      const res = await fetch(API_URL + "?action=add", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Maintenance record added!");
        form.reset();
      } else {
        alert("Error submitting maintenance");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting maintenance");
    }
  });
}

// ---------------------------
// HISTORY PAGE
// ---------------------------
async function loadMaintenanceHistory() {
  const vin = getQueryParam("vin");
  if (!vin) return;

  const response = await fetch(API_URL);
  const records = await response.json();

  const historyDiv = document.getElementById("maintenanceHistory");
  if (!historyDiv) return;

  const vehicleRecords = records.filter(r => r.vin === vin);
  const title = document.getElementById("historyVehicleTitle");
  if (title && vehicleRecords.length) {
    title.textContent = `${vehicleRecords[0].make} ${vehicleRecords[0].model} Maintenance History`;
  }

  historyDiv.innerHTML = "";

  if (!vehicleRecords.length) {
    historyDiv.innerHTML = "<p>No maintenance records found.</p>";
    return;
  }

  vehicleRecords.forEach(record => {
    const card = document.createElement("div");
    card.className = "vehicle-card";
    card.innerHTML = `
      <p><strong>Date:</strong> ${record.date}</p>
      <p><strong>Mileage:</strong> ${record.mileage}</p>
      <p><strong>Description:</strong> ${record.description}</p>
      <p><strong>Parts:</strong> ${record.parts || "N/A"}</p>
    `;
    historyDiv.appendChild(card);
  });
}

// ---------------------------
// PAGE INIT
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("vehicle-list")) fetchVehicles();
  if (document.getElementById("vehicleTitle")) loadVehicleDashboard();
  if (document.getElementById("maintenanceForm")) loadMaintenanceForm();
  if (document.getElementById("maintenanceHistory")) loadMaintenanceHistory();
});

