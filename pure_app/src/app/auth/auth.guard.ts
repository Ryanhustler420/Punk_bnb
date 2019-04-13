import {Injectable} from '@angular/core';
import {CanLoad, Router, ActivationEnd} from '@angular/router';
import {Observable} from 'rxjs';

import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: import('@angular/router').Route,
    segments: import('@angular/router').UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    let user: string;
    this.authService.userId.subscribe(userId => {
      user = userId;
    });
    if (user) { return true; }
    this.router.navigate(['/auth']);
    return false;
  }
}
