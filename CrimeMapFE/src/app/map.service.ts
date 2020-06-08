import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  baseUrl = 'http://127.0.0.1:8000/';
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private httpClient: HttpClient,
  ) { }

  crimeDataNaselja() {
    return this.httpClient.get(`${this.baseUrl}naselja/`, { headers: this.headers });
  }
  crimeDataOpstine() {
    return this.httpClient.get(`${this.baseUrl}opstine/`, { headers: this.headers });
  }
}
