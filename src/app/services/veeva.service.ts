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

  getAllCountries(){

  }

  getAllSites(id) {
    let sessionId = id;
    
    let headers = new HttpHeaders({
      'Authorization': sessionId,
      // 'Access-Control-Allow-Origin': '*',
      // "Access-Control-Allow-Methods":"OPTIONS, GET, POST, PUT, PATCH, DELETE",
      // "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    let options = { headers: headers };

    return this.http.get('https://etmf-integration.herokuapp.com/veeva/getSites', options);
  //   let testSites= {
  //       "responseStatus": "SUCCESS",
  //       "responseDetails": {
  //           "total": 3,
  //           "offset": 0,
  //           "limit": 200,
  //           "url": "/api/v22.1/vobjects/site__v?fields=id,name__v,site_status__v,site_status_color__c,site_name__v,location__v,study__v,study_name__v,study_country__v,location__v,created_date__v",
  //           "object": {
  //               "url": "/api/v22.1/metadata/vobjects/site__v",
  //               "label": "Study Site",
  //               "name": "site__v",
  //               "label_plural": "Study Sites",
  //               "prefix": "0SI",
  //               "in_menu": false,
  //               "source": "standard",
  //               "status": [
  //                   "active__v"
  //               ],
  //               "configuration_state": "STEADY_STATE"
  //           }
  //       },
  //       "data": [
  //           {
  //               "id": "0SI000000001001",
  //               "name__v": "WDWW_UK_SN001",
  //               "site_status__v": [
  //                   "candidate__c"
  //               ],
  //               "site_status_color__c": "Yellow",
  //               "site_name__v": "St Thomas' Hospital",
  //               "location__v": "00L000000001001",
  //               "study__v": "0ST000000002002",
  //               "study_name__v": "WDWW_001",
  //               "study_country__v": "0SC000000001006",
  //               "created_date__v": "2022-07-23T12:41:44.000Z"
  //           },
  //           {
  //               "id": "0SI000000002001",
  //               "name__v": "WDWW_SNSK001",
  //               "site_status__v": [
  //                   "candidate__c"
  //               ],
  //               "site_status_color__c": "Yellow",
  //               "site_name__v": "Samsung Medical Center",
  //               "location__v": "00L000000002001",
  //               "study__v": "0ST000000002002",
  //               "study_name__v": "WDWW_001",
  //               "study_country__v": "0SC000000001004",
  //               "created_date__v": "2022-07-23T12:50:58.000Z"
  //           },
  //           {
  //               "id": "0SI000000003001",
  //               "name__v": "WDWW_SNSG001",
  //               "site_status__v": [
  //                   "did_not_participate__c"
  //               ],
  //               "site_status_color__c": "Black",
  //               "site_name__v": "Singapore General Hospital",
  //               "location__v": "00L000000003001",
  //               "study__v": "0ST000000002002",
  //               "study_name__v": "WDWW_001",
  //               "study_country__v": "0SC000000001007",
  //               "created_date__v": "2022-07-24T07:52:54.000Z"
  //           }
  //       ]
  //   }

  //   return testSites.data;
  }
}
