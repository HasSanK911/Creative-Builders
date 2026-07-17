import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthUser } from '../models/api.models';

interface LoginResponse {
  token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private tokenKey = 'token';
  private userKey = 'user';

  constructor(private router: Router, private http: HttpClient) { }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey) || !!sessionStorage.getItem(this.tokenKey);
  }

  public setToken(token: string, rememberMe: boolean): void {
    rememberMe === true ? localStorage.setItem(this.tokenKey, token) : sessionStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  /** The signed-in admin, cached at login so the sidebar can render a name without a round-trip. */
  public getUser(): AuthUser | null {
    const raw = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  public setUser(user: AuthUser, rememberMe: boolean): void {
    const store = rememberMe ? localStorage : sessionStorage;
    store.setItem(this.userKey, JSON.stringify(user));
  }

  public login(email: string, password: string, rememberMe: boolean): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
    });

    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/login`, { email, password }, { headers })
      .pipe(tap(response => {
        this.setToken(response.token, rememberMe);
        this.setUser(response.user, rememberMe);
      }));
  }

  /**
   * Revoke the token server-side, then clear it locally and leave the panel.
   *
   * The local clear happens whatever the server says — a token that is already
   * expired or revoked would 401 here, and the user still needs to be logged out.
   */
  public logout(): void {
    const token = this.getToken();

    const revoke: Observable<unknown> = token
      ? this.http.post(`${environment.apiUrl}/logout`, {}, {
          headers: new HttpHeaders({
            'ngrok-skip-browser-warning': 'true',
            Authorization: `Bearer ${token}`,
          }),
        }).pipe(catchError(() => of(null)))
      : of(null);

    revoke.subscribe(() => {
      this.clearSession();
      this.router.navigate(['/login']);
    });
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
  }
}
