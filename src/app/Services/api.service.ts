import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService<T> {
  private readonly baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private getUploadHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  public getAll(endpoint: string): Observable<T[]> {
    return this.http
      .get<T[]>(`${this.baseUrl}/${endpoint}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  public getById(endpoint: string): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  public create(endpoint: string, model?: T): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, model, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  public update(endpoint: string, model: T): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, model, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  public put(endpoint: string): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }


  public delete(endpoint: string, id?: number): Observable<void> {
    const url = id !== undefined ? `${this.baseUrl}/${endpoint}/${id}` : `${this.baseUrl}/${endpoint}`;
    return this.http
      .delete<void>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }


  public getProfile(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/profile`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  public updateProfile(data: any): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/profile`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  public getCompany(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/company`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  public updateCompany(data: any): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/company`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Upload a single image file to Cloudinary via the backend.
   * @param file - The File object to upload
   * @param folder - Optional Cloudinary folder name (e.g. 'gallery', 'team', 'banner')
   * @returns Observable with { url: string, public_id: string }
   */
  public uploadImage(file: File, folder: string = 'creative-builders'): Observable<{ url: string; public_id: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http
      .post<{ url: string; public_id: string }>(
        `${this.baseUrl}/upload?folder=${folder}`,
        formData,
        { headers: this.getUploadHeaders() }
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        this.authService.logout();
        errorMessage = 'Session expired. Please log in again.';
      } else {
        const serverMessage = error.error?.message || error.error?.error || error.message;
        errorMessage = `Server Error ${error.status}: ${serverMessage}`;
        if (error.error?.stack) {
          console.error('Server Stack:', error.error.stack);
        }
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
