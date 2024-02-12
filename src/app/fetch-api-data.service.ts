import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const apiUrl = 'https://history-movie-api.onrender.com/';
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  private extractResponseData(res: Object): any {
    const body = res;
    return body || {};
  }

  // Making the api call for the user registration endpoint
  public postUserRegistration(userDetails: any): Observable<any> {
    console.log(userDetails); // <----- object appearing in log
    return this.http
      .post(apiUrl + 'register', userDetails)
      .pipe(catchError(this.handleError));
  }

  // User Login
  public postUserLogin(userDetails: any): Observable<any> {
    console.log(userDetails);

    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public getMovie(movieID: number): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + movieID)
      .pipe(catchError(this.handleError));
  }

  public getDirector(directorID: number): Observable<any> {
    return this.http
      .get(apiUrl + 'directors/' + directorID)
      .pipe(catchError(this.handleError));
  }

  public getGenre(genreID: number): Observable<any> {
    return this.http
      .get(apiUrl + 'genres/' + genreID)
      .pipe(catchError(this.handleError));
  }

  public getUser(userID: number): Observable<any> {
    return this.http
      .get<any>(apiUrl + 'Users/' + userID)
      .pipe(catchError(this.handleError));
  }

  public getFavoriteMovies(userID: number): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + userID + '/favorites')
      .pipe(catchError(this.handleError));
  }

  public postMovieToFavorite(
    userID: string,
    favoriteMovieID: any
  ): Observable<any> {
    const token = localStorage.getItem('token');

    const url = `${apiUrl}user/addfavorite`;
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    });

    return this.http
      .post(
        url,
        { userId: userID, movieId: favoriteMovieID },
        { headers: headers }
      )
      .pipe(catchError(this.handleError));
  }

  public deleteFavoriteMovie(userID: number, movieID: number): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    });

    return this.http
      .delete(apiUrl + 'user/' + userID + '/' + movieID, { headers: headers })
      .pipe(catchError(this.handleError));
  }
  putEditUser(username: string, userDetail: any): Observable<any> {
    return this.http
      .put<any>(apiUrl + 'user/' + username, userDetail)
      .pipe(catchError(this.handleError));
  }

  public deleteUser(userID: number): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    });
    return this.http
      .delete(apiUrl + 'user/' + userID, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
