// ============================
// CONFIGURATION
// ============================
const VEHICLES_API_URL = "https://script.google.com/macros/s/AKfycby6ebYaX33JVaysalB1JHmNmgywk6V7l6OFGvFuZ7Oe7BpZ_qiChnPAmbt68NEHazO7Fw/exec?sheet=Vehicles";
const MAINTENANCE_API_URL = "https://script.google.com/macros/s/AKfycby6ebYaX33JVaysalB1JHmNmgywk6V7l6OFGvFuZ7Oe7BpZ_qiChnPAmbt68NEHazO7Fw/exec?sheet=Maintenance";
const SCHEDULE_API_URL = "https://script.google.com/macros/s/AKfycby6ebYaX33JVaysalB1JHmNmgywk6V7l6OFGvFuZ7Oe7BpZ_qiChnPAmbt68NEHazO7Fw/exec"; // POST endpoint for schedule submissions
const EMAILS_API_URL = "https://script.google.com/macros/s/AKfycby6ebYaX33JVaysalB1JHmNmgywk6V7l6OFGvFuZ7Oe7BpZ_qiChnPAmbt68NEHazO7Fw/exec?emails=true"; // GET endpoint for Contacts sheet

// ============================
// UTILITY FUNCTIONS
// ============================
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatDate(ts) {
  if (!ts) return "N/A";
  const date = new Date(ts);
  if (isNaN(date)) return ts;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// ============================
// VEHICLE LIST FUNCTIONS
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
// MAINTENANCE FUNCTIONS
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
// VEHICLE DASHBOARD BUTTONS
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
// SCHEDULE EMAILS DROPDOWN
// ============================
async function loadEmailsDropdown(selectId) {
  try {
    const response = await fetch(EMAILS_API_URL);
    const data = await response.json();
    const select = document.getElementById(selectId);
    if (!select) return;

    data.forEach(entry => {
      const option = document.createElement("option");
      option.value = entry.email;
      option.textContent = `${entry.name} (${entry.email})`;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading emails:", err);
  }
}

// ============================
// SCHEDULE FORM SUBMISSION
// ============================
async function submitScheduleForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const vin = getQueryParam("vin");
    if (!vin) { alert("VIN missing"); return; }

    const data = {
      type: "future",
      vin: vin.toString().trim(),
      planned_date: document.getElementById("plannedDate").value,
      service: document.getElementById("service").value,
      notes: document.getElementById("notes").value,
      email: document.getElementById("emailSelect").value
    };

    if (!data.planned_date || !data.service || !data.email) {
      alert("Please fill in date, service, and select an email.");
      return;
    }

    try {
      const response = await fetch(SCHEDULE_API_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.status === "success") {
        alert("Future maintenance scheduled successfully!");
        form.reset();
      } else {
        alert("Error scheduling maintenance: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error submitting schedule:", err);
      alert("Error submitting schedule. Check console for details.");
    }
  });
}

// ============================
// INITIALIZATION
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // Vehicle list page
  if (document.getElementById("vehicle-list")) loadVehiclesPage();

  // Vehicle dashboard buttons
  if (document.getElementById("addMaintenanceBtn") ||
      document.getElementById("viewHistoryBtn") ||
      document.getElementById("scheduleBtn")) bindVehicleButtons();

  // Schedule page email dropdown & form
  if (document.getElementById("emailSelect")) loadEmailsDropdown("emailSelect");
  if (document.getElementById("scheduleForm")) submitScheduleForm("scheduleForm");
});
