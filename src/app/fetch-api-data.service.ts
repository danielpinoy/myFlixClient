import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

const apiUrl =
  'https://xo4xjqevs42mbp46utxi3dua3y0lwywt.lambda-url.eu-north-1.on.aws/';

/**
 * Service for handling user registration operations.
 */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  /**
   * Extracts response data from HTTP response.
   * @param res The HTTP response object.
   * @returns The extracted response data or an empty object if no data is present.
   * @private
   */
  private extractResponseData(res: Object): any {
    const body = res;
    return body || {};
  }

  /**
   * Registers a new user.
   * @param userDetails The details of the user to register.
   * @returns An observable that emits the HTTP response data upon success or an error object if the request fails.
   * @throws If an error occurs during the HTTP request.
   * @example
   * const userDetails = {
   *   Birthday: "12-21-19",
   *   Username: 'jake12',
   *   Email: 'testing@example.com',
   *   Password: 'password-testing'
   * };
   *
   * userService.postUserRegistration(userDetails).subscribe(
   *   (response) => console.log('Registration successful:', response),
   *   (error) => console.error('Registration failed:', error)
   * );
   * @see [User Registration Endpoint](https://history-movie-api.onrender.com/register)
   */
  public postUserRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'register', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Logs in a user.
   * @param userDetails The details of the user to login.
   * @returns An observable that emits the HTTP response data upon success or an error object if the request fails.
   * @throws If an error occurs during the HTTP request.
   * @example
   * const userDetails = {
   *   Username: "Daniel123",
   *   Password: "123456"
   * };
   *
   * userService.postUserLogin(userDetails).subscribe(
   *   (response) => console.log('Login successful:', response),
   *   (error) => console.error('Login failed:', error)
   * );
   * @see [User Login Endpoint](https://history-movie-api.onrender.com/login)
   */
  public postUserLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a list of movies from the API.
   * @returns An observable that emits the HTTP response data upon success or an error object if the request fails.
   * @throws If an error occurs during the HTTP request.
   * @example
   * userService.getAllMovies().subscribe(
   *   (response) => console.log('Movies:', response),
   *   (error) => console.error('Failed to fetch movies:', error)
   * );
   * @see [Movies Endpoint](https://history-movie-api.onrender.com/movies)
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'Movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Favorites a selected movie for the user.
   * @param userID The user id used to identify the user.
   * @param favoriteMovieID The id of the movie to favorite.
   * @returns An observable that emits the HTTP response data upon success or an error object if the request fails.
   * @throws If an error occurs during the HTTP request.
   * @example
   * userService.postMovieToFavorite('user123', 123).subscribe(
   *   (response) => console.log('Movie favorited:', response),
   *   (error) => console.error('Failed to favorite movie:', error)
   * );
   */
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

  /**
   * Deletes a favorite movie from the user's profile.
   * @param userID The user id.
   * @param movieID The id of the movie to delete from favorites.
   * @returns An observable that emits the HTTP response data upon success or an error object if the request fails.
   * @throws If an error occurs during the HTTP request.
   * @example
   * userService.deleteFavoriteMovie('user123', 123).subscribe(
   *   (response) => console.log('Favorite movie deleted:', response),
   *   (error) => console.error('Failed to delete favorite movie:', error)
   * );
   * @see [User Favorite Movies Endpoint](https://history-movie-api.onrender.com/user/1235123/431345633)
   */
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

  /**
   * Deletes a user permanently.
   * @param userID The user's ID for deletion.
   * @returns An observable that emits the HTTP response data upon success or an error object if the request fails.
   * @throws If an error occurs during the HTTP request.
   * @example
   * userService.deleteUser('user123').subscribe(
   *   (response) => console.log('User deleted:', response),
   *   (error) => console.error('Failed to delete user:', error)
   * );
   * @see [User Deletion Endpoint](https://history-movie-api.onrender.com/user/12354123)
   */
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

  /**
   * Handles HTTP errors.
   * @param error The HTTP error response object.
   * @returns Error message to be thrown.
   * @private
   */
  private handleError(error: HttpErrorResponse): any {
    let errorMessage = 'Something bad happened; please try again later.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error occurred:', error.error.message);
      errorMessage = error.error.message;
    } else {
      // Server-side error
      console.error(
        `Error Status code ${error.status}, ` + `Error body is:`,
        error.error
      );

      // Extract the message from the server response
      if (
        error.error &&
        typeof error.error === 'object' &&
        error.error.message
      ) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'Invalid username or password. Please try again.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
      }
    }

    return throwError(errorMessage);
  }
}
