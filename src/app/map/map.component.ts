import {Component, OnInit} from '@angular/core';
import * as Leaflet from 'leaflet';
import {DEFAULT_LATITUDE, DEFAULT_LONGITUDE} from '../app.constants';
import {MapPoint} from '../shared/models/map-point.model';
import {NominatimResponse} from '../shared/models/nominatim-response.model';
import { VeevaService } from '../services/veeva.service';
import "leaflet-control-geocoder";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  sessionId: string;
  map: any;
  initSites: any;
  sitesWithCoords: any;
  mapPoint: MapPoint;
  lastLayer: any;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap:true,
        accessToken: 'BDD1xd7oLlKhmn8tN1zhzAVe8dTTlbw9hKSSLFnmRCA9qVA5bR2HrqaAU3bXvvrv'
      // Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   noWrap:true,
      //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 3,
    center: { lat: 30.626137, lng: 79.821603 }
  }
  results: NominatimResponse[];
  test:any;

  constructor (private veevaService: VeevaService) {
    if (window.addEventListener) {
      window.addEventListener("load", () => {
        let readyMessage = JSON.stringify({'message_id': 'ready', 'data': {}});
        window.parent.postMessage(readyMessage, '*');
      });
      window.addEventListener("message", (e:any) => {
        if(e.originalEvent){
          let message = JSON.parse(e.originalEvent.data);
          if (message['message_id'] == 'session_id') {
            this.sessionId = message['data']['session_id'];
          }
        }
      });
     } 
  }

  ngOnInit () {
    this.initSites = this.veevaService.getAllSites(this.sessionId);
    this.updateWithCoords(this.initSites)
      .then(results=> {
      this.sitesWithCoords = results;
      this.plotMarkers(this.sitesWithCoords);
    });
  }

  refreshSearchList (results: NominatimResponse[]) {
    this.results = results;
  }

  onMapClick (e: any) {
    // this.clearMap();
    this.updateMapPoint(e.latlng.lat, e.latlng.lng);
  }

  private updateMapPoint (latitude: number, longitude: number, name?: string) {
    this.mapPoint = {
      latitude: latitude,
      longitude: longitude,
      name: name ? name : this.mapPoint.name
    };
  }

  updateWithCoords(sites) {
    return Promise.all(sites.map(site => this.getCoords(site)))
            .then( data => {
                  let results: any = data;
                  for (let result of results){
                    result.position = { lat: result.center.lat, lng: result.center.lng }; 
                  }
                return results;
            });
  }

  plotMarkers(siteLocations) {
    for (let index = 0; index < siteLocations.length; index++) {
      const data = siteLocations[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map)
        .bindPopup(
          `<div class="tooltip">
            <div class="right">
                <div class="text-content">
                    <h3>${data.name}</h3>
                    <hr>
                    <ul>
                        <li>This demo has fade in/out effect.</li>
                        <li>It is using CSS opacity, visibility, and transition property to toggle the tooltip.</li>
                        <li>Other demos are using display property<em>(none or block)</em> for the toggle.</li>
                    </ul>
                </div>
                <i></i>
            </div>
        </div>`);
      // this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  generateMarker(data: any, index: number) {
    let gIcon;
    switch(data.site_status_color) {
      case "Green":
        gIcon = Leaflet.icon({iconUrl: './assets/images/hospital-green-48.png', iconSize:[30, 30]})
        break;
      case "Blue":
        gIcon = Leaflet.icon({iconUrl: './assets/images/hospital-blue-48.png', iconSize:[30, 30]})
        break;
      case "Orange":
        gIcon = Leaflet.icon({iconUrl: './assets/images/hospital-orange-48.png', iconSize:[30, 30]})
        break;  
      case "Yellow":
        gIcon = Leaflet.icon({iconUrl: './assets/images/hospital-yellow-48.png', iconSize:[30, 30]})
        break;  
      case "Red":
        gIcon = Leaflet.icon({iconUrl: './assets/images/hospital-red-48.png', iconSize:[30, 30]})
        break;  
      case "Black":
        gIcon = Leaflet.icon({iconUrl: './assets/images/hospital-black-48.png', iconSize:[30, 30]})
        break;  
      case "Gray":
        gIcon = Leaflet.icon({iconUrl: './assets/images/hospital-gray-48.png', iconSize:[30, 30]})
        break;  
      default:
        gIcon = Leaflet.icon({iconUrl: './assets/images/hospital-black-48.png', iconSize:[30, 30]})
    }
        
    return Leaflet.marker(data.position, { icon: gIcon })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  initializeMap($event: Leaflet.Map) {
    this.map = $event;
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }

    // getAddress (result: NominatimResponse) {
  //   this.updateMapPoint(result.latitude, result.longitude, result.displayName);
  //   this.createMarker();
  // }

  // getAddress(lat: number, lng: number) {
  //   const geocoder = (Leaflet.Control as any).Geocoder.nominatim();
  //   return new Promise((resolve, reject) => {
  //       geocoder.reverse(
  //           { lat, lng },
  //           this.options.zoom,
  //           (results: any) => results.length ? resolve(results[0].name) : reject(null)
  //       );
  //   })
  // }

  getCoords(siteObj) {
    const geocoder = (Leaflet.Control as any).Geocoder.nominatim();
    return new Promise((resolve, reject) => {
        geocoder.geocode(
            siteObj.site_name__v,
            (results: any) => {
              if(results.length){
                results[0].site_status_color = siteObj.site_status_color__c;
                resolve(results[0]);
              }
              reject(null);
            } 
        );
    })
  }

}
