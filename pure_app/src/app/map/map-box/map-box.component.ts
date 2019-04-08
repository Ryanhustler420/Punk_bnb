import {Component, OnInit, Input, EventEmitter} from '@angular/core';
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
  marker;
  @Input() lat;
  @Input() lng;
  @Input() height;
  @Input() readOnly = false;
  @Input() removeAllMarker = false;

  constructor(private mapService: MapService) {}

  ngOnInit() {
    document.getElementById(`map`).style.height = this.height + '%';
    this.mapService.changeMaker.subscribe(data => {
      if (data && data.length > 0) {
        this.lat = data[0];
        this.lng = data[1];
        if (this.map) {
          this.map.flyTo({center: [this.lng, this.lat]});
          this.addMarker();
        }
      }
    });
    this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 15,
      center: [this.lng, this.lat],
      interactive: !this.readOnly,
    });
    if (!this.removeAllMarker) {
      this.addMarker();
    }
  }

  // add markers to map or remove previous if any
  addMarker() {
    // Remove previous marker
    if (this.marker) {
      this.marker.remove();
    }
    this.marker = new mapboxgl.Marker({
      color: 'red',
      draggable: !this.readOnly,
    })
      .setLngLat([this.lng, this.lat])
      .addTo(this.map);
    this.marker.on('dragend', () => {
      this.lat = this.marker.getLngLat()['lat'];
      this.lng = this.marker.getLngLat()['lng'];
      this.mapService.moveMarker(this.lat, this.lng);
    });
  }
}
