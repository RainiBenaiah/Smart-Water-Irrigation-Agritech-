# irrigation_system.py
import datetime

class Zone:
    def __init__(self, name):
        self.name = name
        self.plants = []
        self.watering_duration = 30
        self.watering_frequency = "daily"
        self.moisture_level = None
        self.watering_plan = None

    def add_plant(self, plant):
        self.plants.append(plant)

    def calculate_water_needs(self):
        # determine water needs based on plants and weather
        pass

class Plant:
    def __init__(self, name, water_needs, sun_exposure):
        self.name = name
        self.water_needs = water_needs
        self.sun_exposure = sun_exposure

    def get_watering_needs(self):
        return self.water_needs

class Schedule:
    def __init__(self):
        self.zones = {}

    def set_schedule(self, zone_name, schedule_data):
        self.zones[zone_name] = schedule_data

    def get_schedule(self, zone_name):
        return self.zones.get(zone_name)

class IrrigationSystem:
    def __init__(self):
        self.zones = []
        self.sensors = []
        self.schedule = Schedule()
        self.current_date_time = datetime.datetime.now()

    def add_zone(self, zone):
        self.zones.append(zone)

    def add_sensor(self, sensor):
        self.sensors.append(sensor)

    def get_weather_data(self):
        weather_data = {}
        for sensor in self.sensors:
            sensor_data = sensor.get_data()
            weather_data[sensor.type] = sensor_data
        return weather_data

    def update_schedule(self, moisture_threshold, watering_duration):
        weather_data = self.get_weather_data()

        for zone in self.zones:
            # Get the current schedule for the zone
            schedule = self.schedule.get_schedule(zone.name)

            # Check moisture level and adjust watering duration
            moisture_level = weather_data["moisture"][zone.name]
         #I will add logic to check if it's raining and adjust watering duration
            if moisture_level < moisture_threshold:
                schedule["duration"] = watering_duration  # Set the new duration
        

            # Update the schedule in the Schedule object
            self.schedule.set_schedule(zone.name, schedule)

    def run_irrigation(self):
        for zone in self.zones:
            schedule = self.schedule.get_schedule(zone.name)
            if schedule:
                print(f"Watering {zone.name} for {schedule['duration']} minutes.")
                #I will add logic to skip watering if it's raining