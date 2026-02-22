import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private tokenKey = 'token';
  private apiUrl = `${environment.apiUrl}/login`; // Helper to target login directly or use as base

  constructor(private router: Router, private http: HttpClient) { }

  public login(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token, false); // Defaulting rememberMe to false for now, or handle in component
          if (response.id) {
            localStorage.setItem('userId', response.id);
          }
          if (response.email) {
            localStorage.setItem('userEmail', response.email);
          }
        }
      })
    );
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    // In a real app, you might check token expiration here
    return !!token;
  }

  public setToken(token: string, rememberMe: boolean): void {
    // For simplicity, using localStorage for now as per previous code's preference, 
    // but respecting the "rememberMe" partial logic if we wanted to expand it.
    // The previous code had a split logic. I'll stick to one for consistency unless requested.
    // To keep it simple and working:
    localStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']); // Redirect to login, not just home
  }
}
