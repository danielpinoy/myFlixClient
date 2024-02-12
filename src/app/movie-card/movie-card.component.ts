// src/app/movie-card/movie-card.component.ts
import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  toggleFavorite(movieID: any, movie: any): void {
    const userDataString = localStorage.getItem('userData');
    console.log(movieID);
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

  // resets by default look unselected movie cards
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
