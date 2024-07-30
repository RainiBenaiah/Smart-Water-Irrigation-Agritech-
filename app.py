from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mysqldb import MySQL
from irrigation_system import IrrigationSystem, Zone, Plant, Schedule
from sensors import Sensor, DataGenerator

app = Flask(__name__, template_folder='templates')

app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'test'

@app.route('/')
def another_page():
  return render_template('front.html') 

mysql = MySQL(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'

# User model
class User(UserMixin):
    def __init__(self, id, username, email):
        self.id = id
        self.username = username
        self.email = email

    def get_id(self):
        return self.id

@login_manager.user_loader
def load_user(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM registration WHERE id = %s", (user_id,))
    user_data = cursor.fetchone()
    cursor.close()
    if user_data:
        return User(user_data[0], user_data[1], user_data[2])
    return None

# Initialize your irrigation system
system = IrrigationSystem()

# Create zones, sensors, and plants
vegetables = Zone("Vegetables")
fruits = Zone("Fruits")

vegetables_moisture_sensor = Sensor("Moisture Sensor", "Zone 1", zone=vegetables)
fruits_moisture_sensor = Sensor("Moisture Sensor", "Zone 2", zone=fruits)
rain_sensor = Sensor("Rain Sensor", "Central")
temperature_sensor = Sensor("Temperature Sensor", "Central")

cabbage = Plant("Cabbage", "Medium", "Full Sun")
sukumawiki = Plant("Sukumawiki", "Medium", "Partial Shade")
passion_fruit = Plant("Passion Fruit", "High", "Full Sun")
grape = Plant("Grape", "Medium", "Full Sun")

system.add_zone(vegetables)
system.add_zone(fruits)
system.add_sensor(vegetables_moisture_sensor)
system.add_sensor(fruits_moisture_sensor)
system.add_sensor(rain_sensor)
system.add_sensor(temperature_sensor)

vegetables.add_plant(cabbage)
vegetables.add_plant(sukumawiki)
fruits.add_plant(passion_fruit)
fruits.add_plant(grape)

system.schedule.set_schedule("Vegetables", {"duration": 30, "frequency": "daily"})
system.schedule.set_schedule("Fruits", {"duration": 30, "frequency": "daily"})


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM registration WHERE username = %s", (username,))
        user_data = cursor.fetchone()
        cursor.close()
        if user_data and user_data[3] == password:
            user = User(user_data[0], user_data[1], user_data[2])
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            error = 'Invalid username or password'
            return render_template('login.html', error=error)
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('index.html')

@app.route('/get_data')
def get_data():
    weather_data = system.get_weather_data()
    return jsonify(weather_data)

@app.route('/update_schedule', methods=['POST'])
def update_schedule():
    moisture_threshold = float(request.form.get('moisture_threshold'))
    watering_duration = int(request.form.get('watering_duration'))

    system.update_schedule(moisture_threshold, watering_duration)
    return jsonify({'message': 'Schedule updated successfully!'})

@app.route('/api/irrigate', methods=['POST'])
def irrigate():
    data = request.get_json()
    zone_name = data.get('zone')
    duration = data.get('duration')
    system.schedule.set_schedule(zone_name, {"duration": duration, "frequency": "manual"})
    system.run_irrigation()
    return jsonify({'message': 'Irrigation started!'})

# Route for adding a zone
@app.route('/add_zone', methods=['POST'])
def add_zone():
  zone_name = request.form.get('zone_name')
  # Create a new zone object and add it to the irrigation system
  new_zone = Zone(zone_name)
  system.add_zone(new_zone)
  # Create a default schedule for the new zone
  system.schedule.set_schedule(zone_name, {"duration": 30, "frequency": "daily"})
  # Add a sensor for the new zone (you might need to adjust this based on your setup)
  sensor_name = f"Moisture Sensor (Zone {len(system.zones)})"
  system.add_sensor(Sensor("Moisture Sensor", sensor_name, zone=new_zone))
  # Return a success message or redirect
  return jsonify({'message': f'Zone "{zone_name}" added successfully!'})

# Route for editing a zone
@app.route('/edit_zone', methods=['POST'])
def edit_zone():
  zone_id = request.form.get('zone_id')
  new_zone_name = request.form.get('zone_name')
  # Find the zone in the system
  zone = next((z for z in system.zones if z.name == zone_id), None)
  if zone:
    zone.name = new_zone_name
    # Update the schedule key if the zone name changes
    system.schedule.set_schedule(new_zone_name, system.schedule.get_schedule(zone_id))
    # You may also need to update other data related to the zone (like sensor names, etc.)
    return jsonify({'message': f'Zone "{zone_id}" updated to "{new_zone_name}" successfully!'})
  else:
    return jsonify({'error': 'Zone not found'}), 404

# Route for deleting a zone
@app.route('/delete_zone', methods=['POST'])
def delete_zone():
  zone_id = request.form.get('zone_id')
  # Find the zone in the system
  zone = next((z for z in system.zones if z.name == zone_id), None)
  if zone:
    system.zones.remove(zone)
    # Remove the schedule for this zone
    del system.schedule.zones[zone_id]
    # You might need to remove related sensors or other data as well
    return jsonify({'message': f'Zone "{zone_id}" deleted successfully!'})
  else:
    return jsonify({'error': 'Zone not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
