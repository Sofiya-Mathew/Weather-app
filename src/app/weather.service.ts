import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '9471b6bf5dc847deaa1162818242205';
  private apiUrl = 'https://api.weatherapi.com/v1';

  constructor(private http: HttpClient) { }

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/current.json?key=${this.apiKey}&q=${city}`);
  }
}
