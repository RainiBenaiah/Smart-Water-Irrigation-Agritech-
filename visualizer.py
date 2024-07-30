# visualizer.py
import matplotlib.pyplot as plt
import numpy as np 

def plot_moisture_levels(weather_data):
    vegetables_moisture = [data["moisture"]["vegetables"] for data in weather_data]
    fruits_moisture = [data["moisture"]["fruits"] for data in weather_data]
    times = [data["timestamp"] for data in weather_data]

    plt.figure(figsize=(10, 6))
    plt.plot(times, vegetables_moisture, label="Vegetables")
    plt.plot(times, fruits_moisture, label="Fruits")
    plt.xlabel("Time")
    plt.ylabel("Moisture Level")
    plt.title("Moisture Levels over Time")
    plt.legend()
    plt.grid(True)
    plt.show()

def plot_temperature(weather_data):
    temperatures = [data["temperature"] for data in weather_data]
    times = [data["timestamp"] for data in weather_data]

    plt.figure(figsize=(10, 6))
    plt.plot(times, temperatures)
    plt.xlabel("Time")
    plt.ylabel("Temperature (°C)")
    plt.title("Temperature over Time")
    plt.grid(True)
    plt.show()

def plot_rainfall(weather_data):
    rainfall = [int(data["rain"]) for data in weather_data]
    times = [data["timestamp"] for data in weather_data]

    plt.figure(figsize=(10, 6))
    plt.bar(times, rainfall)
    plt.xlabel("Time")
    plt.ylabel("Rainfall (1=Yes, 0=No)")
    plt.title("Rainfall Occurrences")
    plt.grid(True)
    plt.show()