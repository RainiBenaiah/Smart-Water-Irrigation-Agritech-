Smart Water Irrigation System Dashboard
This project implements a web-based dashboard for a smart irrigation system. The dashboard allows users to monitor sensor data, adjust irrigation schedules, and manage zones.

Project Structure
└── app.py
└── irrigation_system.py
└── sensors.py
└── visualizer.py
└── templates
    └── index.html
└── styles.css
└── script.js
└── requirements.txt

Setup
Install Python and Libraries:
Make sure you have Python installed.
Install the required libraries:

pip install -r requirements.txt

Create a Database:
Create a MySQL database (or use a different database) named "test" (or your preferred name).
Create a table called registration within the database:

CREATE TABLE registration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);

Configure Database Connection:
Update the 
 file to configure the database connection:

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'test'
(Replace the placeholder values with your actual database credentials.)

Running the System
Start the Flask App:
Open a terminal and navigate to the project directory.
Run the Flask application:
flask run

Access the Dashboard:
Open your web browser and go to 
.
Register:
If you haven't already, register a user using the registration form (you'll need to create this in PHP).
Login:
Log in with your registered credentials to access the dashboard.

Functionality
Dashboard:
Overview: Displays sensor readings (soil moisture, temperature, rainfall).
Charts: Shows line charts for recent soil moisture and temperature data.
Controls: Allows users to start and stop irrigation, and set irrigation duration.
Alerts & Notifications: Displays notifications for events like low water levels.
Settings: Allows users to configure notification frequency and channels.
Zones Management: Allows users to add, edit, and delete zones.
Schedule Update: Allows users to modify the moisture threshold and watering duration for the entire system.
Data Fetching: The dashboard periodically fetches data from the sensors.
Irrigation Control: The dashboard allows users to start and stop irrigation for specific zones.

Future Improvements
Real-Time Updates: Implement WebSockets for real-time updates of sensor data and notifications.
Data Persistence: Store data and settings persistently using a database.
User Management: Implement more comprehensive user management features (e.g., role-based access).
Visualization: Integrate more advanced charting libraries (like Chart.js or D3.js) for better visualizations.
Authentication: Secure the login and registration process with robust password hashing and other security measures.
Sensor Integration: Connect the dashboard to real-world sensors using a communication protocol (e.g., SPI, I2C, MQTT)

Notes
This project uses simulated sensor data. You'll need to modify it to interact with actual sensors.
The code for adding and removing zones from the UI is a placeholder. You'll need to implement the JavaScript code to dynamically create and remove zone elements in the dashboard.
Consider using a front-end framework (like React, Vue, or Angular) for a more robust and scalable dashboard.
