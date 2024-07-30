# sensors.py
import random
import datetime

class DataGenerator:
    def __init__(self):
        self.moisture_range = (0.1, 1.0)
        self.temperature_range = (15, 35)
        self.rain_probability = 0.2

    def generate_moisture(self, zone):
        moisture = random.uniform(*self.moisture_range)
        return moisture

    def generate_temperature(self):
        return random.uniform(*self.temperature_range)

    def generate_rainfall(self):
        return bool(random.random() < self.rain_probability)

    def generate_data(self):
        data = {
            "moisture": {
                "vegetables": self.generate_moisture("Vegetables"),
                "fruits": self.generate_moisture("Fruits")
            },
            "temperature": self.generate_temperature(),
            "rain": self.generate_rainfall(),
            "timestamp": datetime.datetime.now()
        }
        return data

class Sensor:
    def __init__(self, type, location, zone=None):
        self.type = type
        self.location = location
        self.zone = zone
        self.data = None
        self.data_generator = DataGenerator()

    def get_data(self):
        self.data = self.data_generator.generate_data()
        return self.data