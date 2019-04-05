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
        switchMap(data => [data['features']]),
        map(data => (data.length > 0 ? data : [])),
        tap()
      );
  }
}
