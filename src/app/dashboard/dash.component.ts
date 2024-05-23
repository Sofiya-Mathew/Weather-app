import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, interval } from 'rxjs';
import { WeatherService } from '../weather.service';
import { Chart, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  @ViewChild('barChart') barChart!: ElementRef;
  chart: Chart | null = null;

  carouselChartData: any;
  private myChart!: Chart;
  private carouselSubscription!: Subscription;

  chartData: any;
  selectedCardIndex: number | null = null;
  chartLabels: any;
  cardData: any;

  chartOptions = {
    indexAxis: 'y',
    responsive: true
  };
  //setting cities defaultly
  cities = ['New York', 'London', 'Tokyo', 'Sydney'];
  //To show details in card
  props1 = [
    { label: 'Temperature', key: 'temperature' },
    { label: 'Humidity', key: 'humidity' },
    { label: 'Wind Speed', key: 'windSpeed' }
  ];

  props2 = [
    { key: 'Precipitation', label: 'Precipitation' },
    { key: 'Pressure', label: 'Pressure' },
    { key: 'Condition', label: 'Condition' }
  ];

  constructor(private weatherService: WeatherService) {
    // Initialize chartLabels and chartData as empty arrays
    this.chartLabels = [];
    this.chartData = [];
  }

  ngOnInit(): void {
    //Getting weather data from api
    this.getWeatherData('New York'); // Example city
    this.getWeatherDataForChart('New York')
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  getWeatherData(city: any): void {
    this.weatherService.getWeather(city)
      .pipe(
        map(data => {
          const weatherData = {
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            windSpeed: data.current.wind_kph,
            Precipitation: data.current.precip_mm,
            Pressure: data.current.pressure_in,
            Condition: data.current.condition.text // Include condition text directly in the weatherData object
          };
          return weatherData;
        })
      )
      .subscribe(mappedData => {
        this.cardData = mappedData;
      });
  }

  getWeatherDataForChart(city: any): void {
    this.weatherService.getWeather(city)
      .pipe(
        map(data => {
          const weatherData = {
            temperature: data.current.temp_c,
            humidity: data.current.humidity,
            windSpeed: data.current.wind_kph,
            Precipitation: data.current.precip_mm,
            Pressure: data.current.pressure_in,
            Condition: data.current.condition.text // Include condition text directly in the weatherData object
          };
          return weatherData;
        })
      )
      .subscribe(mappedData => {
        this.carouselChartData = mappedData
        this.updateChartData();
      });
  }
  renderChart() {
    if (this.barChart) {
      const ctx = this.barChart.nativeElement.getContext('2d');
      if (ctx) {
        if (this.chart) {
          this.chart.destroy();
        }
        this.myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(this.carouselChartData),
            datasets: [{
              label: 'Weather Data',
              data: Object.values(this.carouselChartData).map(value =>
                typeof value === 'number' ? value : 0 // Ensure non-number values are set to 0
              ),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }]
          },
          options: {
            indexAxis: 'y', // Set the index axis to 'y' for horizontal bars
            responsive: true,
            maintainAspectRatio: false, // Allow chart to adjust its aspect ratio
            scales: {
              x: {
                display: false // Hide the x-axis
              },
              y: {
                grid: {
                  display: false // Hide the horizontal grid lines
                },
                ticks: {
                  display: true // Show the y-axis values
                }
              }
            },
            layout: {
              margin: {
                left: 0, // Adjust as needed
                right: 0, // Adjust as needed
                top: 0, // Adjust as needed
                bottom: 0 // Adjust as needed
              },
              padding: {
                top: 0, // Adjust as needed
                bottom: 0 // Adjust as needed
              }
            },
          } as ChartOptions
        });

        this.setupCarousel();
      } else {
        console.error('Unable to get canvas context.');
      }
    } else {
      console.error('barChart ViewChild is not available.');
    }
  }

  selectCard(index: number): void {
    if (this.selectedCardIndex === index) {
      this.selectedCardIndex = null;
    } else {
      this.selectedCardIndex = index;
    }
  }

  ngOnDestroy() {
    if (this.carouselSubscription) {
      this.carouselSubscription.unsubscribe();
    }
  }

  setupCarousel() {
    if (!this.carouselSubscription) { // Check if carousel subscription already exists
      const cities = ['London', 'New York', 'Tokyo', 'Sydney']; // Example cities
      let currentIndex = 0;

      this.carouselSubscription = interval(5000).subscribe(() => {
        const city = cities[currentIndex];
        this.getWeatherDataForChart(city);

        currentIndex = (currentIndex + 1) % cities.length; // Move to the next city or wrap around to the beginning
      });
    }
  }



  updateChartData() {
    this.chartLabels = Object.keys(this.carouselChartData);
    this.chartData = Object.values(this.carouselChartData);

    if (this.myChart) {
      this.myChart.data.labels = this.chartLabels;
      this.myChart.data.datasets[0].data = this.chartData;
      this.myChart.update();
    } else {
      this.renderChart();
    }
  }

  updateChartDataForCarousel(index: number) {
    this.myChart.data.labels = [this.chartLabels[index]];
    this.myChart.data.datasets[0].data = [this.chartData[index]];
    this.myChart.update();
  }

  //Change data when switching between cities
  onCityChange(index: number): void {
    const selectedCity = this.cities[index];
    this.getWeatherData(selectedCity);
  }
}
