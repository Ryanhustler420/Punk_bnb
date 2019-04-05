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
  @Input() lat;
  @Input() lng;
  @Input() height;

  constructor(private mapService: MapService) {}

  ngOnInit() {
    document.getElementById(`map`).style.height = this.height + '%';
    this.mapService.changeMaker.subscribe(data => {
      if (data.length > 0) {
        if (this.map) {
          this.map.remove();
        }
        this.lat = data[0];
        this.lng = data[1];
      }
      this.buildMap();
    });
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
    const marker = new mapboxgl.Marker({
      color: 'red',
      draggable: true,
    })
      .setLngLat([this.lng, this.lat])
      .addTo(this.map);

    marker.on('dragend', () => {
      this.lat = marker.getLngLat()['lat'];
      this.lng = marker.getLngLat()['lng'];
      this.mapService.moveMarker(this.lat, this.lng);
    });
  }
}
