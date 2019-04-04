import {Component, OnInit, Input} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {MapService} from '../map.service';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss'],
})
export class MapBoxComponent implements OnInit {
  // default settings
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v10?optimize=true';
  @Input() lat;
  @Input() lng;
  @Input() height;

  constructor(private mapService: MapService) {}

  ngOnInit() {
    document.getElementById(`map`).style.height = this.height + '%';
    this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
    });
    this.addMarker();
  }

  // add markers to map
  addMarker() {
    new mapboxgl.Marker({
      color: 'red',
    })
      .setLngLat([this.lng, this.lat])
      .addTo(this.map);
  }
}
