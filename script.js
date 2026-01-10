// Replace this with your Google Sheets API URL
const API_URL = "https://script.google.com/macros/s/AKfycbzVqy_P9-HXu6sw-ubiSWCFmRubLUkxv2BbH01cYO_ai--udIxoq0VltPpSfvtwacrsOA/exec";

async function fetchVehicles() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    displayVehicles(data);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    document.getElementById("vehicle-list").innerHTML = "<p>Unable to load vehicles.</p>";
  }
}

function displayVehicles(data) {
  const container = document.getElementById("vehicle-list");
  container.innerHTML = ""; // Clear previous content

  // Assume first row is header
  const headers = data[0];
  const rows = data.slice(1);

  rows.forEach(row => {
    const vehicle = {};
    headers.forEach((header, i) => vehicle[header] = row[i]);

    const card = document.createElement("div");
    card.className = "vehicle-card";
    card.innerHTML = `
      <h2>${vehicle.Name} (${vehicle.Year})</h2>
      <p><strong>Make:</strong> ${vehicle.Make}</p>
      <p><strong>Model:</strong> ${vehicle.Model}</p>
      <p><strong>VIN:</strong> ${vehicle.VIN}</p>
      <p><strong>Start Mileage:</strong> ${vehicle.Start_Mileage}</p>
    `;
    container.appendChild(card);
  });
}

// Load vehicles on page load

fetchVehicles();

