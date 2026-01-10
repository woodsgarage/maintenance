const API_URL = "https://script.google.com/macros/s/AKfycbweRW0iNKaGhtzgoB3KsoCGdWaHuIGb2v8JajWKVcVwBQQEbDu8y6mksrv5xRi2sc-Zjw/exec";

/* Utility */
function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

/* Fetch vehicles */
async function fetchVehicles() {
  const response = await fetch(API_URL);
  const vehicles = await response.json();
  displayVehicles(vehicles);
}

/* Display vehicle cards */
function displayVehicles(vehicles) {
  const container = document.getElementById("vehicle-list");
  if (!container) return;

  vehicles.forEach(v => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.margin = "10px";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <strong>${v.year} ${v.make} ${v.model}</strong><br>
      VIN: ${v.vin}
    `;

    card.onclick = () => {
      window.location.href =
        `maintenance.html?vin=${encodeURIComponent(v.vin)}`;
    };

    container.appendChild(card);
  });
}

/* Load selected vehicle */
async function loadVehicle() {
  const vin = getQueryParam("vin");
  if (!vin) return;

  const response = await fetch(API_URL);
  const vehicles = await response.json();
  const vehicle = vehicles.find(v => v.vin === vin);
  if (!vehicle) return;

  document.getElementById("vehicleTitle").textContent =
    `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  document.getElementById("vin").value = vin;
}

/* Submit maintenance */
document.addEventListener("submit", async (e) => {
  if (e.target.id !== "maintenanceForm") return;
  e.preventDefault();

  const payload = {
    vin: vin.value,
    odometer: odometer.value,
    service: service.value,
    parts: parts.value,
    notes: notes.value
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  alert("Maintenance saved!");
  e.target.reset();
});

/* Detect page */
if (document.getElementById("vehicle-list")) fetchVehicles();
if (document.getElementById("maintenanceForm")) loadVehicle();

