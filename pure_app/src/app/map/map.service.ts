import {Injectable} from '@angular/core';

import {environment} from '../environment';
import * as mapboxgl from 'mapbox-gl';
import {HttpClient} from '@angular/common/http';
import {switchMap, tap, take, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  getLocation(address: string) {
    return this.http
      .get(
        `https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      )
      .pipe(
        take(1),
        switchMap(data => data['features']),
        map(data => {
          if (data['center']) {
            return data['center'];
          }
        }),
        tap()
      );
  }

  // geojson = {
  //   type: 'FeatureCollection',
  //   features: [
  //     {
  //       type: 'Feature',
  //       properties: {
  //         message: 'Foo',
  //         iconSize: [60, 60],
  //       },
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [-66.324462890625, -16.024695711685304],
  //       },
  //     },
  //     {
  //       type: 'Feature',
  //       properties: {
  //         message: 'Bar',
  //         iconSize: [50, 50],
  //       },
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [-61.2158203125, -15.97189158092897],
  //       },
  //     },
  //     {
  //       type: 'Feature',
  //       properties: {
  //         message: 'Baz',
  //         iconSize: [40, 40],
  //       },
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [-63.29223632812499, -18.28151823530889],
  //       },
  //     },
  //   ],
  // };

  // getJson() {
  //   return {...this.geojson};
  // }
}
