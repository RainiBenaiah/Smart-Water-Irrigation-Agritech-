// script.js
// Example placeholder data (replace with actual data from your system)
const soilMoistureData = [
  { x: 1, y: 50 },
  { x: 2, y: 60 },
  { x: 3, y: 45 },
  { x: 4, y: 55 },
  { x: 5, y: 65 }
];

const temperatureData = [
  { x: 1, y: 25 },
  { x: 2, y: 28 },
  { x: 3, y: 23 },
  { x: 4, y: 27 },
  { x: 5, y: 26 }
];

// Function to update card values
function updateCardValue(id, value, unit) {
  document.getElementById(id).textContent = `${value}${unit}`;
}

// Example data (replace with actual values)
updateCardValue("soil-moisture-value", 55, "%");
updateCardValue("temperature-value", 27, "°C");
updateCardValue("humidity-value", 70, "%");
updateCardValue("water-level-value", 100, "L");

// Chart.js setup
const moistureChartCanvas = document.getElementById("moistureChart");
const moistureChart = new Chart(moistureChartCanvas, {
  type: "line", // or 'bar', 'radar', etc.
  data: {
    labels: soilMoistureData.map(item => item.x),
    datasets: [{
      label: "Soil Moisture (%)",
      data: soilMoistureData.map(item => item.y),
      borderColor: "blue",
      fill: false, // or true for filled areas
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

const temperatureChartCanvas = document.getElementById("temperatureChart");
const temperatureChart = new Chart(temperatureChartCanvas, {
  type: "line",
  data: {
    labels: temperatureData.map(item => item.x),
    datasets: [{
      label: "Temperature (°C)",
      data: temperatureData.map(item => item.y),
      borderColor: "red",
      fill: false
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Event listeners for irrigation controls
document.getElementById("start-irrigation").addEventListener("click", () => {
  // Start irrigation logic (send command to your system)
  console.log("Irrigation started!");
});

document.getElementById("stop-irrigation").addEventListener("click", () => {
  // Stop irrigation logic (send command to your system)
  console.log("Irrigation stopped!");
});

// script.js
// ... your existing JavaScript code ...

// Alerts & Notifications
const notificationList = document.getElementById("notification-list");

function addNotification(message) {
  const listItem = document.createElement("li");
  listItem.textContent = message;
  notificationList.appendChild(listItem);
}

// Example notification trigger (replace with actual logic)
setInterval(() => {
  if (Math.random() < 0.1) { // Simulate a random notification
    addNotification("Warning: Low water level in Zone 1");
  }
}, 5000); // Trigger notifications every 5 seconds (for demonstration)

// Settings
const notificationFrequencySelect = document.getElementById("notification-frequency");
const notificationChannelSelect = document.getElementById("notification-channel");

// Handle setting changes (replace with actual logic to save settings)
notificationFrequencySelect.addEventListener("change", () => {
  console.log("Notification frequency changed to:", notificationFrequencySelect.value);
});

notificationChannelSelect.addEventListener("change", () => {
  console.log("Notification channel changed to:", notificationChannelSelect.value);
});

// Zones Management
const zone1NameInput = document.getElementById("zone1-name");
const zone1ScheduleInput = document.getElementById("zone1-schedule");

// Handle zone edit actions (replace with actual logic to update zone settings)
document.getElementById("zone1-edit").addEventListener("click", () => {
  console.log("Zone 1 name updated to:", zone1NameInput.value);
});

document.getElementById("zone1-schedule-edit").addEventListener("click", () => {
  console.log("Zone 1 schedule updated to:", zone1ScheduleInput.value);
});

// ... rest of your JavaScript code ...