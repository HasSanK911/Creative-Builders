import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private tokenKey = 'token';
  constructor(private router: Router) { }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey) || !!sessionStorage.getItem(this.tokenKey);
  }

  public setToken(token: string, rememberMe: boolean): void {
    rememberMe === true ? localStorage.setItem(this.tokenKey, token) : sessionStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);;
  }


  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/']);
  }
}
