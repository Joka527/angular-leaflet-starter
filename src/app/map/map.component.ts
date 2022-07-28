import {Component, OnInit} from '@angular/core';
import * as Leaflet from 'leaflet';
import {DEFAULT_LATITUDE, DEFAULT_LONGITUDE, VAULT_BASE_URL, VAULT_UI_COUNTRY_DETAILS, VAULT_UI_SITE_DETAILS, VAULT_UI_STUDY_DETAILS} from '../app.constants';
import {MapPoint} from '../shared/models/map-point.model';
import {NominatimResponse} from '../shared/models/nominatim-response.model';
import { VeevaService } from '../services/veeva.service';
import "leaflet-control-geocoder";
import { style } from '@angular/animations';
import * as geojson from 'geojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  sessionId: string;
  map: any;
  initSites: any;
  geojsonLayer:any;
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
      })
    ],
    zoom: 3,
    center: { lat: 30.626137, lng: 10.070092 }
  }
  results: NominatimResponse[];
  test:any;
  vaultUrl: string;
  initCountries: Object;
  countriesWithCoords: any;

  constructor (private veevaService: VeevaService) {
    
  }

  ngOnInit () {
    if (window.addEventListener) {
      window.addEventListener("load", () => {
        let readyMessage = JSON.stringify({'message_id': 'ready', 'data': {}});
        window.parent.postMessage(readyMessage, '*');
      });
      window.addEventListener("message", (e:any) => {
        if(e.data){
          let message = JSON.parse(e.data);
          if (message['message_id'] == 'session_id') {
            this.sessionId = message['data']['session_id'];
            
            this.veevaService.getAllSites(this.sessionId)
              .subscribe(results => {
                this.initSites=results
                this.updateWithGeoCode(this.initSites)
                  .then(results=> {
                  this.sitesWithCoords = results;
                  this.plotMarkers(this.sitesWithCoords);
                });
              });
          }
        }
      });
     } 
    // this.sessionId = '09F7591FACB67AA4A9E5524E4907EE5CEABDABDCD079B2711D792F610A92F2C84737C0FA225B09B74F3E8F62A2DAD3D58D9CA44A622D090BFFF665BD3C22C8D0';

    // this.veevaService.getAllCountries(this.sessionId)
    // .subscribe(results => {
    //   this.initCountries= results;
    //   this.updateWithGeoCode(this.initCountries)
    //     .then(results=> {
    //     this.countriesWithCoords = results;
    //     this.addFeature(this.countriesWithCoords);

    //     this.veevaService.getAllSites(this.sessionId)
    //     .subscribe(results => {
    //       this.initSites= results;
    //       this.updateWithGeoCode(this.initSites)
    //         .then(results=> {
    //         this.sitesWithCoords = results;
    //         this.plotMarkers(this.sitesWithCoords);
    //         this.hideLoader();
    //       });
    //     });
    //   });
    // });
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

  updateWithGeoCode(sitesrsp) {
    let sites = sitesrsp.data;
    return Promise.all(sites.map(site => this.getGeoCode(site)))
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
                    <h3>${data.site_name__v}</h3>
                    <hr>
                    <ul>
                        <li><b>ID:</b> ${data.id}</li>
                        <li><b>Site Rec Name:</b> ${data.name__v}</li>
                        <li><b>Status:</b> ${data.site_status__v[0]}</li>
                        <li><b>Study Name:</b> ${data.study_name__v}</li>
                        <li><b>Address:</b> ${data.properties.display_name}</li>
                        <li><b><a href="${VAULT_BASE_URL}${VAULT_UI_SITE_DETAILS}${data.id}?expanded=details__c" target="_blank">Vault Details Link</a></li>
                        <li><b>Date Created:</b> ${data.created_date__v}</li>
                    </ul>      
                </div>
                <i></i>
            </div>
        </div>`);
      // this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  addFeature(countries) {
    for (let index = 0; index < countries.length; index++) {
      const country = countries[index];
      let geojsonFeature= this.generateGeoJSONFeature(country, index);
      Leaflet.geoJSON(geojsonFeature, {
        style: function(data) {
          switch(country.status__v[0]) {
            case "active__v": return {color:"#26F115"};
            case "inactive__v": return {color:"#CACACA"};
            case "archived__v": return {color:"#7D7D7D"};
          }
        // onEachFeature: this.onEachFeature
        }
    }).bindPopup(
      `<div class="tooltip">
        <div class="right">
            <div class="text-content">
                <h3>${country.name__v}</h3>
                <hr>
                <ul>
                    <li><b>ID:</b> ${country.id}</li>
                    <li><b>Local Name:</b> ${country.name}</li>
                    <li><b>Status:</b> ${country.status__v[0]}</li>
                    <li><b>EC Type:</b> ${country.ec_type__v[0]}</li>
                    <li><b><a href="${VAULT_BASE_URL}${VAULT_UI_STUDY_DETAILS}${country.study__v}?expanded=details__c" target="_blank">Related Study Details</a></li>
                    <li><b><a href="${VAULT_BASE_URL}${VAULT_UI_COUNTRY_DETAILS}${country.id}?expanded=details__c" target="_blank">Country Details</a></li>
                    <li><b>Date Created:</b> ${country.created_date__v}</li>
                </ul>
            </div>
            <i></i>
        </div>
    </div>`).addTo(this.map);
    }
  }

  generateMarker(data: any, index: number) {
    let gIcon;
    switch(data.site_status_color__c) {
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

  generateGeoJSONFeature(data: any, index: number) {
    let geojsonFeature : geojson.Feature = {
      "type": "Feature", 
      "properties": {
          "name": "Coors Field",
          "amenity": "Baseball Stadium",
          "popupContent": "This is where the Rockies play!"
      },
      "geometry": data.properties.geojson
    };
    let options = {style:{}};
    let featureStyle ={color:""};
  

    
    options.style = featureStyle;

    return geojsonFeature;
  }

  initializeMap($event: Leaflet.Map) {
    this.map = $event;
    this.geojsonLayer = Leaflet.geoJSON().addTo(this.map);
    
    (function() {
      let control = new Leaflet.Control({position:'topright'});
      control.onAdd = function(map) {
          let azoom = Leaflet.DomUtil.create('a','resetzoom');
          azoom.innerHTML = "[Reset Zoom]";
          Leaflet.DomEvent
            .disableClickPropagation(azoom)
            .addListener(azoom, 'click', function() {
              map.setView(map.options.center, map.options.zoom);
            },azoom);
          return azoom;
        };
      return control;
    }())
    .addTo(this.map);

    let legend = new Leaflet.Control({position: 'bottomright'});
    legend.onAdd = function (map) {
        let div = Leaflet.DomUtil.create('div', 'info legend'),
            grades = ["Active", "Candidate", "Hold", "Closed", "Inactive/Withdrew", "Archived", "Enroll Complete","No Participation"],
            colors = ["#26F115", "#fcc600", "#fc5d00", "#f00e0e", "#CACACA", "#7D7D7D", "#0e21f0","#030202"]

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' + grades[i] + '<br>';
        }

        return div;
    };
    legend.addTo(this.map);
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    this.map.setView($event.latlng, 15);
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  countryClicked($event: any, index: number) {
    this.map.setView($event.latlng, 15);
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }

  hideLoader(){
    document.getElementById('cover-spin')
    .style.display = 'none';
  }

  getGeoCode(siteObj) {
    let querystring= (siteObj.site_name__v) ? siteObj.site_name__v : siteObj.name__v;
    const geocoder = (Leaflet.Control as any).Geocoder.nominatim({
      geocodingQueryParams: {
          "limit":1,
          "polygon_geojson":1,
          "format":"jsonv2",
          "polygon_threshold":0.009
      }});
    return new Promise((resolve, reject) => {
        geocoder.geocode(
            querystring,
            (results: any) => {
              if(results.length){
                let finalObj = { ...results[0], ...siteObj }
                resolve(finalObj);
              }
              reject(null);
            } 
        );
    })
  }
}
