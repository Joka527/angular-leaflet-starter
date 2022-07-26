import {Component, OnInit} from '@angular/core';
import { VeevaService } from './services/veeva.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-leaflet-starter';
  constructor (private veevaService: VeevaService) {
  }

  ngOnInit () {
    // this.veevaService.authenticate().subscribe((result) =>{
    //   console.warn();
    // })
  }
}
