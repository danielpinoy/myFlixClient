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

/**
 * Service for handling user registration operations.
 */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  private extractResponseData(res: Object): any {
    const body = res;
    return body || {};
  }

  // Making the api call for the user registration endpoint

  /**
   * POST - Registers a new user.
   * @param {Object} userDetails - The details of the user to register.
   * @param {string} userDetails.Username - The username of the user.
   * @param {string} userDetails.Email - The email of the user.
   * @param {string} userDetails.Password - The password of the user.
   * @param {string} userDetails.Birthday - the birthday of the user.
   * @returns {Observable<any>} An observable that emits the HTTP response data upon success or an error object if the request fails.
   * @throws {Error} If an error occurs during the HTTP request.
   * @example
   * Response Data
   * const userDetails = {
   *   Birthday: "12-21-19"
   *   Username: 'jake12',
   *   Email: 'testing@example.com',
   *   Password: 'password-testing'
   * };
   *
   * userService.postUserRegistration(userDetails).subscribe(
   *   (response) => console.log('Registration successful:', response),
   *   (error) => console.error('Registration failed:', error)
   * );
   *
   * ENDPOINT
   * @see {@link https://history-movie-api.onrender.com/register} The API endpoint for user registration.
   */
  public postUserRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);

    return this.http
      .post(apiUrl + 'register', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * POST - User Login
   * @param {Object} userDetails - The details of the user to login.
   * @param {string} userDetails.Username - The username of the user.
   * @param {string} userDetails.Password - The password of the user.
   * @returns {Observable<any>} An observable that emits the HTTP response data upon success or an error object if the request fails.
   * @throws {Error} If an error occurs during the HTTP request.
   * Response Data
   * const userDetails = {
   * 	 Username: "Daniel123",
   * 	 Password: "123456"
   * };
   * Method Used
   * userService.postUserLogin(userDetails).subscribe(
   *   (response) => console.log('Login successful:', response),
   *   (error) => console.error('Login failed:', error)
   * );
   *
   * ENDPOINT
   * @see {@link https://history-movie-api.onrender.com/login } The API endpoint for user Login.
   */
  public postUserLogin(userDetails: any): Observable<any> {
    console.log(userDetails);

    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   *  GET - Retrieves a list of Movies from the API
   * @returns {Observable<any>} An observable that emits the HTTP response data upon success or an error object if the request fails.
   * @throws {Error} If an error occurs during the HTTP request.
   * @example
   * Response Data
   * {
   *    "_id": 2312312312,
   *    "Title": "Saving Private Ryan",
   * 		"Description": "Set in 1944 in France during World War II, it follows a group of soldiers, led by Captain John Miller (Tom Hanks), on their mission to locate Private James Francis Ryan (Matt Damon) and bring him home safely after his three brothers are killed in action.",
   * 		"Genre": {
   *  	"Name": "War",
   *  	"Description": "War films depict the experiences of war, including its effects on society..."
   * },
   * 	  "Director": {
   *  	"Name": "Steven Spielberg",
   * 		"Bio": "Steven Spielberg is an American filmmaker known for his exceptional work in war and action genres..."
   * },
   * 	  "Actors": [
   * 	  "Tom Hanks",
   *    "Matt Damon",
   * 	  "Tom Sizemore",
   *    "Edward Burns",
   * 		"Barry Pepper"
   * ],
   *	  "Image": "https://image.tmdb.org/t/p/original/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg"
   * }
   *
   *  Method Used
   *   getMovies(): void {
   *  this.fetchMovies.getAllMovies().subscribe((resp: any) => {
   *   const storedUserData = localStorage.getItem('userData');
   *   if (storedUserData) {
   *     const userData = JSON.parse(storedUserData);
   *     const favoriteMovieIds = userData.FavoriteMovies || []; // Use empty array if FavoriteMovies is undefined or null
   *
   *     this.movies = resp.map((movie: Movie) => ({
   *       ...movie,
   *       showGenre: false,
   *       showDirector: false,
   *       hiddenImage: false,
   *       showDescription: false,
   *       isFavorite: favoriteMovieIds.includes(movie._id),
   *     }));
   *     localStorage.setItem('movies', JSON.stringify(this.movies));
   *   } else {
   *     this.movies = resp.map((movie: Movie) => ({
   *       ...movie,
   *       showGenre: false,
   *       showDirector: false,
   *       hiddenImage: false,
   *       showDescription: false,
   *       isFavorite: false,
   *     }));
   *     localStorage.setItem('movies', JSON.stringify(this.movies));
   *      }
   *   });
   *  }
   * ENDPOINT
   * @see {@link https://history-movie-api.onrender.com/movies}
   */
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
  /**
   * POST - Favorites selected movie to your user account
   * @param {string} userID - the user id used to find where to post the favorite movie.
   * @param {any} favoriteMovieID = the favorite movie id to insert into the userDetails
   * @returns {Observable<any>} An observable that emits the HTTP response data upon success or an error object if the request fails.
   * @example
   * {
   *	"_id": {
   *		"$oid": "6538418823aa83dfb5c5e9f4"
   *	},
   *	"Username": "nate martin",
   *	"Password": "$2b$10$Gm0W2vyBaIafoxyXV7Nx9ePZ1JUIw2CQFqc/hxFln4NsDfo8TWd0i",
   *	"Email": "n8emar10@gmail.com",
   *	"Birthday": {
   *		"$date": {
   *			"$numberLong": "566352000000"
   *		}
   *	},
   *	"FavoriteMovies": [123123112],
   *}
   *
   *  Method Used
   *  this.postFavorite.postMovieToFavorite(userData._id, movieID).subscribe({
   *       next: (response) => {
   *         userData.FavoriteMovies = response.FavoriteMovies;
   *         localStorage.setItem('userData', JSON.stringify(userData));
   *
   *         const username = response.Username;
   *         this.snackBar.open(
   *           `Movie added to favorites for ${username}`,
   *           'OK',
   *           {
   *             duration: 2000,
   *           }
   *         );
   *       },
   *
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
   * DELETE - Deletes favorite movie from user's profile.
   * @param {string} userID - the user id.
   * @param {number} movieID - the movie id of the favorite movie
   * @returns {Observable<any>} An observable that emits the HTTP response data upon success or an error object if the request fails.
   * Method Used
   *   this.deleteFavorite
   *       .deleteFavoriteMovie(userData._id, movieID)
   *       .subscribe({
   *         next: (response) => {
   *
   *           // filter out the removed movie from user's favorite list
   *           userData.FavoriteMovies = userData.FavoriteMovies.filter(
   *             (id: number) => id !== movieID
   *           );
   *           localStorage.setItem('userData', JSON.stringify(userData));
   *
   *           const username = response.Username;
   *           this.snackBar.open(
   *             `Movie removed from favorites for ${username}`,
   *             'OK',
   *             {
   *               duration: 2000,
   *             }
   *           );
   *         },
   * ENDPOINT
   * @see {@link https://history-movie-api.onrender.com/user/1235123/431345633 }
   *
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
   * DELETE - Delete user permanently.
   * @param {number} userID - The user's ID for deletion
   * @returns {Observable<any>} An observable that emits the HTTP response data upon success or an error object if the request fails.
   *
   * Method Used
   * this.deleteAccount.deleteUser(userID).subscribe({
   *   next: (response) => {
   *     console.log(response);
   *     this.router.navigate(['/']);
   *     localStorage.removeItem('userData');
   *     localStorage.removeItem('token');
   *     this.snackBar.open(`Deleted User`, 'OK', {
   *       duration: 2000,
   *     });
   *   },
   *
   * ENDPOINT
   * @see {@link https://history-movie-api.onrender.com/user/12354123 }
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
