// src/app/movie-card/movie-card.component.ts
import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Represents a movie.
 */
interface Movie {
  Genre: {
    Name: string;
    Description: string;
  };
  Director: {
    Name: string;
    Bio: string;
  };
  _id: string;
  Title: string;
  Description: string;
  Actors: string[];
  Image: string;
}

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})

/**
 * This is the Movie Card component.
 */
export class MovieCardComponent {
  movies: any[] = [];
  selectedMovieIndex: number | null = null;
  isFavorite: boolean = false;
  hiddenImage: boolean = false;
  showGenre: boolean = false;
  showDirector: boolean = false;
  showDescription: boolean = false;
  constructor(
    public fetchMovies: FetchApiDataService,
    public postFavorite: FetchApiDataService,
    public deleteFavorite: FetchApiDataService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Fetches the movie from the API
   * @returns void
   * @remarks This method sends requests to the server to fetch all movie
   */
  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any) => {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        const favoriteMovieIds = userData.FavoriteMovies || []; // Use empty array if FavoriteMovies is undefined or null

        this.movies = resp.map((movie: Movie) => ({
          ...movie,
          showGenre: false,
          showDirector: false,
          hiddenImage: false,
          showDescription: false,
          isFavorite: favoriteMovieIds.includes(movie._id),
        }));
        localStorage.setItem('movies', JSON.stringify(this.movies));
      } else {
        this.movies = resp.map((movie: Movie) => ({
          ...movie,
          showGenre: false,
          showDirector: false,
          hiddenImage: false,
          showDescription: false,
          isFavorite: false,
        }));
        localStorage.setItem('movies', JSON.stringify(this.movies));
      }
    });
  }

  /**
   * Toggles a movie in the user's favorite movie list on the server.
   * @param movieID The ID of the movie to toggle.
   * @param movie The movie object to toggle.
   * @returns void
   * @remarks This method sends requests to the server to add or remove the movie from the user's favorites.
   */
  toggleFavorite(movieID: any, movie: any): void {
    const userDataString = localStorage.getItem('userData');
    // console.log(movieID);
    if (userDataString) {
      const userData = JSON.parse(userDataString);

      if (movie.isFavorite) {
        // If the movie is already a favorite, remove it
        this.deleteFavorite
          .deleteFavoriteMovie(userData._id, movieID)
          .subscribe({
            next: (response) => {
              console.log(response, 'delete');

              // filter out the removed movie from user's favorite list
              userData.FavoriteMovies = userData.FavoriteMovies.filter(
                (id: number) => id !== movieID
              );
              console.log(userData.FavoriteMovies);
              localStorage.setItem('userData', JSON.stringify(userData));

              const username = response.Username;
              this.snackBar.open(
                `Movie removed from favorites for ${username}`,
                'OK',
                {
                  duration: 2000,
                }
              );
            },
            error: (error) => {
              this.snackBar.open(error, 'OK', {
                duration: 2000,
              });
            },
          });
      } else {
        // If the movie is not a favorite, add it
        this.postFavorite.postMovieToFavorite(userData._id, movieID).subscribe({
          next: (response) => {
            console.log(response);

            // Update favoriteMovies in the local storage user data
            userData.FavoriteMovies = response.FavoriteMovies;
            localStorage.setItem('userData', JSON.stringify(userData));

            const username = response.Username;
            this.snackBar.open(
              `Movie added to favorites for ${username}`,
              'OK',
              {
                duration: 2000,
              }
            );
          },
          error: (error) => {
            this.snackBar.open(error, 'OK', {
              duration: 2000,
            });
          },
        });
      }

      // Toggle the isFavorite property of the movie locally
      movie.isFavorite = !movie.isFavorite;
    }
  }

  /**
   * Toggles the visibility of genre information for the selected movie.
   * @param index - The index of the movie in the movies array.
   * @returns void
   */
  toggleGenre(index: number): void {
    const selectedMovie = this.movies[index];

    // Toggle the 'showGenre' property of the selected movie
    selectedMovie.showGenre = !selectedMovie.showGenre;
    selectedMovie.showDirector = false;
    selectedMovie.showDescription = false;
    // Show genre information and hide image
    selectedMovie.hiddenImage = true;

    if (!selectedMovie.showGenre) {
      selectedMovie.hiddenImage = false;
    }
    // Hide the genre of other movies and reset their hiddenImage property
    this.resetOtherMovies(selectedMovie);
  }

  toggleDirector(index: number): void {
    const selectedMovie = this.movies[index];

    selectedMovie.showDirector = !selectedMovie.showDirector;
    selectedMovie.showGenre = false;
    selectedMovie.showDescription = false;

    selectedMovie.hiddenImage = true;

    if (!selectedMovie.showDirector) {
      selectedMovie.hiddenImage = false;
    }
    this.resetOtherMovies(selectedMovie);
  }
  toggleDescription(index: number): void {
    const selectedMovie = this.movies[index];

    selectedMovie.showDescription = !selectedMovie.showDescription;
    selectedMovie.showGenre = false;
    selectedMovie.showDirector = false;

    selectedMovie.hiddenImage = true;
    if (!selectedMovie.showDescription) {
      selectedMovie.hiddenImage = false;
    }

    this.resetOtherMovies(selectedMovie);
  }

  /**
   * Resets unselected movie cards to their default state.
   * @param selectedMovie The selected movie whose state should not be reset.
   * @returns void
   * @remarks This method is used to reset the state of unselected movie cards,
   * such as hiding descriptions, directors, and genres, and showing images.
   */
  private resetOtherMovies(selectedMovie: any): void {
    this.movies.forEach((movie) => {
      if (movie !== selectedMovie) {
        movie.showDescription = false;
        movie.showDirector = false;
        movie.hiddenImage = false;
        movie.showGenre = false;
      }
    });
  }
}
