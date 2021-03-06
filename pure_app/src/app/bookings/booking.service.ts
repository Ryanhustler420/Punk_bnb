import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Booking} from './booking.model';
import {AuthService} from './../auth/auth.service';
import {take, tap, delay, switchMap, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

interface BookingData {
  bookedFrom: string;
  bookingTo: string;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeId: string;
  placeImage: string;
  placeTitle: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let bookingId: string;
    let newBooking: Booking;
    let fetchedToken;
    return this.authService.token.pipe(
      switchMap(token => {
        fetchedToken = token;
        return this.authService.userId;
      }),
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          userId,
          placeTitle,
          guestNumber,
          placeImage,
          firstName,
          lastName,
          dateFrom,
          dateTo
        );
        return this.http.post<{name: string}>(
          `https://ionicpunkbnb.firebaseio.com/bookings.json?auth=${fetchedToken}`,
          {
            ...newBooking,
            id: null,
          }
        );
      }),
      switchMap(resData => {
        bookingId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        newBooking.id = bookingId;
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.delete(
          `https://ionicpunkbnb.firebaseio.com/bookings/${bookingId}.json?auth=${token}`
        );
      }),
      switchMap(() => this.bookings),
      take(1),
      tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      })
    );
  }

  fetchBookings() {
    let fetchedToken;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.authService.userId;
      }),
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not Found!');
        }
        return this.http.get<{[key: string]: BookingData}>(
          `https://ionicpunkbnb.firebaseio.com/bookings.json?auth=${fetchedToken}&orderBy="userId"&equalTo="${userId}"`
        );
      }),
      map(bookingData => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(
              new Booking(
                key,
                bookingData[key].placeId,
                bookingData[key].userId,
                bookingData[key].placeTitle,
                bookingData[key].guestNumber,
                bookingData[key].placeImage,
                bookingData[key].firstName,
                bookingData[key].lastName,
                new Date(bookingData[key].bookedFrom),
                new Date(bookingData[key].bookingTo)
              )
            );
          }
        }
        return bookings;
      }),
      tap(bookings => {
        this._bookings.next(bookings);
      })
    );
  }
}
