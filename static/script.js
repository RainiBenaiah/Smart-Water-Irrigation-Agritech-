// script.js

function redirecTPage() {
  window.location.href = "demo.html";
}

$(document).ready(function() {
  // Fetch data initially
  fetchData();

  // Fetch data periodically (adjust the interval as needed)
  setInterval(fetchData, 5000);

  // Event listener for irrigation controls
  $("#start-irrigation").click(function() {
    // Get zone and duration from the dashboard
    const zone = $("#zone1-name").val(); // incase I have a single zone for now
    const duration = $("#irrigation-duration").val();

    // Send irrigation command to the backend (using AJAX)
    $.ajax({
      url: '/api/irrigate', // Adjust Flask route if needed
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ zone: zone, duration: duration }),
      success: function(response) {
        console.log(response.message); // Handle response from the backend
      },
      error: function(error) {
        console.error('Error starting irrigation:', error);
      }
    });
  });

  $("#stop-irrigation").click(function() {
    // Stop irrigation logic (send command to your system)
    console.log("Irrigation stopped!");
    //  needed to add the AJAX call to the backend to stop the irrigation.
  });

  // Event listeners for settings
  $("#notification-frequency").change(function() {
    const selectedFrequency = $(this).val();
    console.log("Notification frequency changed to:", selectedFrequency);
    //  save the frequency setting to the backend
  });

  $("#notification-channel").change(function() {
    const selectedChannel = $(this).val();
    console.log("Notification channel changed to:", selectedChannel);
    // save the channel setting to the backend
  });

  $("#notification-target").change(function() {
    const selecteTarget = $(this).val();
    console.log("Notification channel changed to:", selectedTarget);
    // save the ch target to the backend
  });

  $("#notification-system").change(function() {
    const selectedSystem = $(this).val();
    console.log("Notification channel changed to:", selectedSystem);
    //  save the system setting to the backend
  });

  // Event listeners for zones management
  $("#zone1-edit").click(function() {
    const newZone1Name = $("#zone1-name").val();
    $.ajax({
      url: '/edit_zone', // Adjust the Flask route if needed
      type: 'POST',
      data: {
        zone_id: "Vegetables", // Use the current zone name 
        zone_name: newZone1Name
      },
      success: function(response) {
        console.log(response.message);
        // Update the zone name display in the dashboard
        $("#zone1 label[for='zone1-name']").text(`Zone 1 Name:`); 
      },
      error: function(error) {
        console.error('Error editing zone:', error);
      }
    });
  });

  $("#zone1-schedule-edit").click(function() {
    const newZone1Schedule = $("#zone1-schedule").val();
    console.log("Zone 1 schedule updated to:", newZone1Schedule);
    //  update the zone schedule in the backend
  });

  $("#zone2-edit").click(function() {
    const newZone2Name = $("#zone2-name").val();
    $.ajax({
      url: '/edit_zone', // Adjust  Flask route if needed
      type: 'POST',
      data: {
        zone_id: "Fruits", // Use the current zone name 
        zone_name: newZone2Name
      },
      success: function(response) {
        console.log(response.message);
        // Update the zone name display in the dashboard
        $("#zone2 label[for='zone2-name']").text(`Zone 2 Name:`); 
      },
      error: function(error) {
        console.error('Error editing zone:', error);
      }
    });
  });

  $("#zone2-schedule-edit").click(function() {
    const newZone2Schedule = $("#zone2-schedule").val();
    console.log("Zone 2 schedule updated to:", newZone2Schedule);
    // update the zone schedule in the backend
  });

  $("#zone1-delete").click(function() {
    $.ajax({
      url: '/delete_zone',
      type: 'POST',
      data: {
        zone_id: 'Vegetables' 
      },
      success: function(response) {
        console.log(response.message);
        // Remove the zone from the UI
        $("#zone1").remove();
      },
      error: function(error) {
        console.error('Error deleting zone:', error);
      }
    });
  });

  $("#zone2-delete").click(function() {
    $.ajax({
      url: '/delete_zone',
      type: 'POST',
      data: {
        zone_id: 'Fruits' 
      },
      success: function(response) {
        console.log(response.message);
        // Remove the zone from the UI
        $("#zone2").remove();
      },
      error: function(error) {
        console.error('Error deleting zone:', error);
      }
    });
  });

  // Add a new zone
  $("#add-zone-button").click(function() {
    const newZoneName = prompt("Enter the name of the new zone:");
    if (newZoneName) {
      $.ajax({
        url: '/add_zone',
        type: 'POST',
        data: {
          zone_name: newZoneName
        },
        success: function(response) {
          console.log(response.message);
          // Add the new zone to the UI (the HTML needs to be dynamically updated)
          // ... (Code to add new zone elements to the DOM) ...
        },
        error: function(error) {
          console.error('Error adding zone:', error);
        }
      });
    }
  });

  // Schedule Update 
  $("#update-schedule-button").click(function() {
    const moistureThreshold = $("#moisture-threshold").val();
    const wateringDuration = $("#watering-duration").val();

    $.ajax({
      url: '/update_schedule', // Adjust withFlask route if needed
      type: 'POST',
      data: {
        moisture_threshold: moistureThreshold,
        watering_duration: wateringDuration
      },
      success: function(response) {
        console.log("Schedule updated successfully!");
      },
      error: function(error) {
        console.error('Error updating schedule:', error);
      }
    });
  });

  // Fetch data and update the dashboard
  function fetchData() {
    $.ajax({
      url: '/get_data', // Adjust with Flask route if needed
      type: 'GET',
      success: function(data) {
        $("#soil-moisture-vegetables").text(data.moisture.vegetables + "%");
        $("#soil-moisture-fruits").text(data.moisture.fruits + "%");
        $("#temperature").text(data.temperature + "°C");
        $("#rainfall").text(data.rain ? "Yes" : "No");

        // Update Chart.js data
        updateMoistureChart(data.weather.moisture);
        updateTemperatureChart(data.weather.temperature);

        // Update card values
        updateCardValue("soil-moisture-vegetables", data.moisture.vegetables, "%");
        updateCardValue("soil-moisture-fruits", data.moisture.fruits, "%");
        updateCardValue("temperature-value", data.temperature, "°C");
        updateCardValue("rainfall-value", data.rain ? "Yes" : "No");
      },
      error: function(error) {
        console.error('Error fetching data:', error);
      }
    });
  }

  // Update Chart.js charts with new data
  function updateMoistureChart(moistureData) {
    //  'moistureData' is in the format { vegetables: ..., fruits: ... }
    const moistureChartCanvas = document.getElementById("moistureChart");
    const moistureChart = new Chart(moistureChartCanvas, {
      type: "line", // or 'bar', 'radar', etc.
      data: {
        labels: ["Vegetables", "Fruits"], // Labels for the chart
        datasets: [{
          label: "Soil Moisture (%)",
          data: [moistureData.vegetables, moistureData.fruits], // Data for the chart
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
  }

  function updateTemperatureChart(temperatureData) {
    // if 'temperatureData' is a single value (e.g., 25)
    const temperatureChartCanvas = document.getElementById("temperatureChart");
    const temperatureChart = new Chart(temperatureChartCanvas, {
      type: "line", 
      data: {
        labels: ["Time 1", "Time 2", "Time 3", "Time 4", "Time 5"], // Labels for the chart
        datasets: [{
          label: "Temperature (°C)",
          data: [temperatureData, temperatureData, temperatureData, temperatureData, temperatureData], // Data for the chart
          borderColor: "red",
          fill: false, 
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
  }

  // Update card values
  function updateCardValue(id, value, unit = "") {
    document.getElementById(id).textContent = `${value}${unit}`;
  }

  // Alerts & Notifications
  const notificationList = document.getElementById("notification-list");

  function addNotification(message) {
    const listItem = document.createElement("li");
    listItem.textContent = message;
    notificationList.appendChild(listItem);
  }

  //  notification trigger 
  setInterval(() => {
    if (Math.random() < 0.5) { // Simulate a random notification
      addNotification("Warning: Low water level in Zone 1");
    }
  }, 10000); // Trigger notifications every 10 seconds (for demo)

  // Event listeners for settings
  $("#notification-frequency").change(function() {
    const selectedFrequency = $(this).val();
    console.log("Notification frequency changed to:", selectedFrequency);
    // save the frequency setting to your backend
  });

  $("#notification-channel").change(function() {
    const selectedChannel = $(this).val();
    console.log("Notification channel changed to:", selectedChannel);
    // save the channel setting to the backend
  });

  $("#notification-target").change(function() {
    const selectedTarget = $(this).val();
    console.log("Notification Target changed to:", selectedTarget);
    //  save the Target setting to the backend
  });

  $("#notification-system").change(function() {
    const selectedSystem = $(this).val();
    console.log("Notification system status changed to:", selectedSystem);
    // save the channel setting to the backend
  });

  // Event listeners for zones management
  $("#zone1-edit").click(function() {
    const newZone1Name = $("#zone1-name").val();
    console.log("Zone 1 name updated to:", newZone1Name);
    // update the zone name in the backend
  });

  $("#zone1-schedule-edit").click(function() {
    const newZone1Schedule = $("#zone1-schedule").val();
    console.log("Zone 1 schedule updated to:", newZone1Schedule);
    //  update the zone schedule in the backend
  });

  $("#zone2-edit").click(function() {
    const newZone2Name = $("#zone2-name").val();
    console.log("Zone 2 name updated to:", newZone2Name);
    //  update the zone name in the backend
  });

  $("#zone2-schedule-edit").click(function() {
    const newZone2Schedule = $("#zone2-schedule").val();
    console.log("Zone 2 schedule updated to:", newZone2Schedule);
    //  update the zone schedule in the backend
  });
});