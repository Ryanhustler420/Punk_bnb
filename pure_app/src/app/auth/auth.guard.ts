import {Injectable} from '@angular/core';
import {CanLoad, Router, ActivationEnd} from '@angular/router';
import {Observable, of} from 'rxjs';

import {AuthService} from './auth.service';
import {take, tap, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: import('@angular/router').Route,
    segments: import('@angular/router').UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.isAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}
