// Base Apps Script URL (no ?sheet parameter)
const API_URL = "https://script.google.com/macros/s/AKfycbyeNNBAnSdUm07YsJkUjfzbztn8pEnEBZ9cJJZo2HbVOlmEySYKnHPYKeGe-1i9bPE4iw/exec";

/* -----------------------------
   Helpers
------------------------------ */
function normalizeVin(v) {
  return String(v ?? "").trim();
}

function parseDateSafe(v) {
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function parseOdoSafe(v) {
  const n = Number(String(v ?? "").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

function buildLastOdoMap(maintenanceRows) {
  // vin -> { odo, dt }
  const map = new Map();
  const rows = Array.isArray(maintenanceRows) ? maintenanceRows : [];

  for (const r of rows) {
    const vin = normalizeVin(r.vin || r.VIN);
    if (!vin) continue;

    const odo = parseOdoSafe(r.odometer);
    if (odo === null) continue;

    const dt = parseDateSafe(r.timestamp);

    if (!map.has(vin)) {
      map.set(vin, { odo, dt });
      continue;
    }

    const prev = map.get(vin);

    // Prefer valid timestamp ordering. Fallback: if timestamps not usable, "last seen" wins.
    if (dt && prev.dt) {
      if (dt > prev.dt) map.set(vin, { odo, dt });
    } else if (dt && !prev.dt) {
      map.set(vin, { odo, dt });
    } else if (!dt && !prev.dt) {
      map.set(vin, { odo, dt: null });
    }
  }

  return map;
}

/* -----------------------------
   Fetch Vehicles for Index Page
   (Now includes Last Mileage from Maintenance)
------------------------------ */
async function fetchVehicles() {
  try {
    // Pull Vehicles + Maintenance in parallel
    const [vehiclesResp, maintResp] = await Promise.all([
      fetch(`${API_URL}?sheet=Vehicles`),
      fetch(`${API_URL}?sheet=Maintenance`)
    ]);

    if (!vehiclesResp.ok) throw new Error(`Vehicles HTTP error! status: ${vehiclesResp.status}`);
    if (!maintResp.ok) throw new Error(`Maintenance HTTP error! status: ${maintResp.status}`);

    const vehicles = await vehiclesResp.json();
    const maintenance = await maintResp.json();

    console.log("Vehicles API data:", vehicles);
    console.log("Maintenance API data:", maintenance);

    if (Array.isArray(vehicles) && vehicles.length > 0) {
      const lastOdoMap = buildLastOdoMap(maintenance);
      displayVehicles(vehicles, lastOdoMap);
    } else {
      document.getElementById("vehicle-list").innerHTML =
        "<p>No vehicles found.</p>";
    }
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    const el = document.getElementById("vehicle-list");
    if (el) el.innerHTML = "<p>Unable to load vehicles.</p>";
  }
}

/* -----------------------------
   Render vehicle cards
   (Replaces Start Mileage with Last Mileage)
------------------------------ */
function displayVehicles(vehicles, lastOdoMap) {
  const container = document.getElementById("vehicle-list");
  if (!container) return;

  container.innerHTML = "";

  vehicles.forEach(vehicle => {
    const vin = normalizeVin(vehicle.vin);
    if (!vin) return;

    const year = String(vehicle.year ?? "").trim();
    const make = String(vehicle.make ?? "").trim();
    const model = String(vehicle.model ?? "").trim();
    const name = String(vehicle.name ?? "").trim();

    const last = lastOdoMap instanceof Map ? lastOdoMap.get(vin) : null;
    const lastMileageText = last && typeof last.odo === "number"
      ? last.odo.toLocaleString()
      : "—";

    const card = document.createElement("div");
    card.className = "card vehicle-card";
    card.innerHTML = `
      <h2>${name}${year ? ` (${year})` : ""}</h2>
      <p><strong>Make:</strong> ${make || "—"}</p>
      <p><strong>Model:</strong> ${model || "—"}</p>
      <p><strong>VIN:</strong> ${vin}</p>
      <p><strong>Last Mileage:</strong> ${lastMileageText}</p>
    `;

    card.addEventListener("click", () => {
      window.location.href = `vehicle.html?vin=${encodeURIComponent(vin)}`;
    });

    container.appendChild(card);
  });
}

/* -----------------------------
   Fetch Maintenance History
------------------------------ */
async function fetchMaintenance(vin, containerId) {
  try {
    const response = await fetch(`${API_URL}?sheet=Maintenance`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    const vehicleVin = normalizeVin(vin);
    const vehicleRecords = (Array.isArray(data) ? data : [])
      .filter(r => normalizeVin(r.vin || r.VIN) === vehicleVin);

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    if (vehicleRecords.length === 0) {
      container.innerHTML = "<p>No maintenance records found.</p>";
      return;
    }

    vehicleRecords.forEach(r => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <p><strong>Date:</strong> ${formatDate(r.timestamp)}</p>
        <p><strong>Odometer:</strong> ${r.odometer || "N/A"}</p>
        <p><strong>Service:</strong> ${r.service || "N/A"}</p>
        <p><strong>Parts:</strong> ${r.parts || "N/A"}</p>
        <p><strong>Notes:</strong> ${r.notes || "N/A"}</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading maintenance:", err);
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = "<p>Unable to load maintenance records.</p>";
  }
}

/* -----------------------------
   Format Date as Month Day, Year
------------------------------ */
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d)) return "N/A";
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

/* -----------------------------
   Fetch Contacts for Schedule Email Dropdown
------------------------------ */
async function fetchContacts(selectId) {
  try {
    const response = await fetch(`${API_URL}?sheet=Contacts`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const contacts = await response.json();

    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = `<option value="">Select email</option>`;

    (Array.isArray(contacts) ? contacts : []).forEach(c => {
      if (c.email) {
        const option = document.createElement("option");
        option.value = c.email;
        option.textContent = `${c.name || c.email} (${c.email})`;
        select.appendChild(option);
      }
    });
  } catch (err) {
    console.error("Failed to load contacts:", err);
  }
}

/* -----------------------------
   Submit Scheduled Maintenance
   NOTE: Kept intact for compatibility with existing site,
   even though schedule.html uses hidden iframe POST.
------------------------------ */
async function submitSchedule(vin, serviceId, dueId, emailId, notifyIds) {
  const payload = {
    type: "schedule",
    vin,
    service: document.getElementById(serviceId).value,
    due_date: document.getElementById(dueId).value,
    email: document.getElementById(emailId).value,
    notify_14: document.getElementById(notifyIds[0]).checked,
    notify_7: document.getElementById(notifyIds[1]).checked,
    notify_3: document.getElementById(notifyIds[2]).checked,
    notify_1: document.getElementById(notifyIds[3]).checked
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    alert("Maintenance scheduled successfully!");
  } catch (err) {
    console.error("Failed to save schedule:", err);
    alert("Failed to save schedule.");
  }
}

/* -----------------------------
   Auto-run index page load
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("vehicle-list")) fetchVehicles();
});






