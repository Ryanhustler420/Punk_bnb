import {Injectable} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {take, map, tap, delay, filter, switchMap} from 'rxjs/operators';

import {Place} from './place.model';
import {AuthService} from './../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Location} from './../shared/location.modal';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: Location;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlaces() {
    return this.http
      .get<{[key: string]: PlaceData}>(
        'https://ionicpunkbnb.firebaseio.com/offered-places.json'
      )
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  get allPlaces() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionicpunkbnb.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
          );
        })
      );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{imageUrl: string; imagePath: string}>(
      'https://us-central1-ionicpunkbnb.cloudfunctions.net/storeImage',
      uploadData
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFom: Date,
    dateTo: Date,
    location: Location,
    imageUrl: string
  ) {
    let generatedId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No User Found!');
        }

        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          price,
          dateFom,
          dateTo,
          userId,
          location
        );
        return this.http.post<{name: string}>(
          'https://ionicpunkbnb.firebaseio.com/offered-places.json',
          {
            ...newPlace,
            id: null,
          }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.allPlaces;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
  }

  editPlace(id: string, title: string, description: string) {
    let updatePlaces: Place[];
    return this.allPlaces.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === id);
        updatePlaces = [...places];
        const oldPlace = updatePlaces[updatedPlaceIndex];
        updatePlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://ionicpunkbnb.firebaseio.com/offered-places/${id}.json`,
          {
            ...updatePlaces[updatedPlaceIndex],
            id: null,
          }
        );
      }),
      tap(() => {
        this._places.next(updatePlaces);
      })
    );
  }
}
