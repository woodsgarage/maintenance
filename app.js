// Base Apps Script URL (no ?sheet parameter)
const API_URL = "https://script.google.com/macros/s/AKfycbx-DLNrwvrkUdchq2YmibeEwr3LBmWTVpXtpg9Iz1O_o4cyVv9cfEaL40N1AsVegjUhqA/exec"; 

/* -----------------------------
   Fetch Vehicles for Index Page
------------------------------ */
async function fetchVehicles() {
  try {
    // Explicitly request the Vehicles sheet
    const response = await fetch(`${API_URL}?sheet=Vehicles`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("Vehicles API data:", data);

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

/* -----------------------------
   Render vehicle cards
------------------------------ */
function displayVehicles(vehicles) {
  const container = document.getElementById("vehicle-list");
  if (!container) return;

  container.innerHTML = "";

  vehicles.forEach(vehicle => {
    const card = document.createElement("div");
    card.className = "card vehicle-card";
    card.innerHTML = `
      <h2>${vehicle.name} (${vehicle.year})</h2>
      <p><strong>Make:</strong> ${vehicle.make}</p>
      <p><strong>Model:</strong> ${vehicle.model}</p>
      <p><strong>VIN:</strong> ${vehicle.vin}</p>
      <p><strong>Start Mileage:</strong> ${vehicle.start_mileage}</p>
    `;
    card.addEventListener("click", () => {
      window.location.href = `vehicle.html?vin=${vehicle.vin}`;
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
    const data = await response.json();

    const vehicleRecords = data.filter(r => (r.vin || r.VIN || "").toString().trim() === vin.trim());

    const container = document.getElementById(containerId);
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
    const contacts = await response.json();

    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">Select email</option>`;

    contacts.forEach(c => {
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
   Export functions
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("vehicle-list")) fetchVehicles();
});


