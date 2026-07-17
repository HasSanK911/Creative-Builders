import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

/** What `POST /api/uploads` answers with for each stored file. */
export interface UploadedFile {
  path: string;
  url: string;
}

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

  public create(endpoint: string, model?: any): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, model, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  public update(endpoint: string, model: any): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, model, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  public put(endpoint: string): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${endpoint}`, {}, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  public delete(endpoint: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${endpoint}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /**
   * Upload one image. Every image field in the admin panel goes through here first —
   * the entity's own create/update then carries the returned `path` as a plain string.
   *
   * Uses `getUploadHeaders()`, which deliberately omits `Content-Type` so the browser
   * can set the multipart boundary itself.
   */
  public upload(file: File): Observable<UploadedFile> {
    const body = new FormData();
    body.append('file', file);

    return this.http
      .post<UploadedFile>(`${this.baseUrl}/uploads`, body, { headers: this.getUploadHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  /** Upload several images in one request; answers with one entry per file, in order. */
  public uploadMany(files: File[]): Observable<UploadedFile[]> {
    const body = new FormData();
    files.forEach(file => body.append('files[]', file));

    return this.http
      .post<UploadedFile[]>(`${this.baseUrl}/uploads`, body, { headers: this.getUploadHeaders() })
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
      } else if (error.status === 422 && error.error?.errors) {
        // Laravel's validation shape — surface the messages rather than "Server Error 422".
        errorMessage = Object.values(error.error.errors as Record<string, string[]>)
          .flat()
          .join('\n');
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server Error ${error.status}: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
