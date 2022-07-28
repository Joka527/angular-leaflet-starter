import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VeevaService {
  
  sessionId:string;

  constructor(private http: HttpClient) { }
  
  getAllStudies(){

  }

  getAllLocations(){

  }

  getAllCountries(id){
    let sessionId = id; 
    let httpOptions = { 
        headers: new HttpHeaders({Authorization: sessionId})
    };
    return this.http.get('http://127.0.0.1:8080/veeva/countries', httpOptions);
  }

  getAllSites(id) {
    let sessionId = id; 
    let httpOptions = { 
        headers: new HttpHeaders({Authorization: sessionId})
    };
    return this.http.get('http://127.0.0.1:8080/veeva/sites', httpOptions);
  }
}
