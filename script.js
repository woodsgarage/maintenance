// Replace this with your Google Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbw5d9RE81_h7rIG5wP9RKXWHwd173Dq-0v-Xz6ftcnte5s5MefeIC4zZ-yFogB3TSRYGQ/exec";

// Fetch vehicle data from Google Sheets API
async function fetchVehicles() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("API data:", data); // Debug: shows the JSON in console

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

// Render vehicle data into the page
function displayVehicles(vehicles) {
  const container = document.getElementById("vehicle-list");
  if (!container) {
    console.error("Container element #vehicle-list not found");
    return;
  }

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
    container.appendChild(card);
  });
}

// Load vehicles on page load
fetchVehicles();





