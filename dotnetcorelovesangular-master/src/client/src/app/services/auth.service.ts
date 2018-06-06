import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthService {

  userProfile: any;
  private userRoles: any;

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    audience: AUTH_CONFIG.audience,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: 'openid profile email'
  });

  constructor(private router: Router) {
    if (this.isAuthenticated())
      this.setProfileFromLocalStorage();
    else
      this.handleAuthentication();
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        
        window.location.hash = '';
        this.setSession(authResult);
        this.setProfile((err, profile) => {
            this.userProfile = profile;
            this.userRoles = profile['http://api.tim-lab/roles'];
        });
        console.log(authResult);
        this.router.navigate(['/index']);
      } else if (err) {
        this.router.navigate(['/index']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.userProfile = null;
    this.userRoles = null;
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

  private setProfile(cb): void {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      throw new Error('Access Token must exist to fetch profile');
    }
    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
        self.userRoles = profile['http://api.tim-lab/roles'];
      }
      cb(err, profile);
    });
  }
  private setProfileFromLocalStorage() {
    this.userProfile = this.getUserData(this.getUserToken());
    if (this.userProfile)
      this.userRoles = this.userProfile['http://api.tim-lab/roles'];
  }

  private getUserToken() {
    return localStorage.getItem('id_token');
  }
  private getAuthToken() {
    return localStorage.getItem('token');
  }

  private getUserData(userToken) {
    var jwtHelper = new JwtHelper();
    var decodedToken = jwtHelper.decodeToken(userToken);
    return decodedToken;
  }

  public isInRole(roleName) {
    if (this.userRoles)
      return this.userRoles.indexOf(roleName) > -1;
  }

  public isInRoles(roles: string[]): boolean {
    if (!roles) return true;
      return this.userRoles && roles.every(r => this.userRoles.indexOf(r) >= 0);
  }

}
