import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get_weather_data(id1: any, id2: any): Observable<any> {
    return this.http.get<any>('https://weather-api-backend.herokuapp.com/getweatherdatalatlong/' + id1 + '/' + id2)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  get_elevation_data(id1: any, id2: any): Observable<any> {
    return this.http.get<any>('https://weather-api-backend.herokuapp.com/getelevation/' + id1 + '/' + id2)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  handleError(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
