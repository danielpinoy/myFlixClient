import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss', '../app.component.scss'],
})
export class UserProfileComponent {
  user: {
    _id: number;
    Username: string;
    Email: any;
    Birthday: any;
    FavoriteMovies: [];
  } = {
    _id: 0,
    Username: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  };
  movies: any[] = [];
  selectedMovieIndex: number | null = null;
  isFavorite: boolean = false;
  hiddenImage: boolean = false;
  showGenre: boolean = false;
  showDirector: boolean = false;
  showDescription: boolean = false;

  constructor(
    private router: Router,
    public deleteAccount: FetchApiDataService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const storedUserData = localStorage.getItem('userData');
    const storedMovies = localStorage.getItem('movies');
    console.log(storedUserData);
    if (storedUserData) {
      this.user = JSON.parse(storedUserData);
    }
    if (storedMovies) {
      this.movies = JSON.parse(storedMovies);
    }
  }
  backMovieCard(): void {
    this.router.navigate(['/movies']);
  }

  getFavoriteMovies(): any[] {
    const favoriteMoviesTitle = [];
    if (this.user && this.user.FavoriteMovies && this.movies) {
      for (const favoriteMovieId of this.user.FavoriteMovies) {
        const matchedMovie = this.movies.find(
          (movie) => movie._id === favoriteMovieId
        );
        if (matchedMovie) {
          favoriteMoviesTitle.push(matchedMovie.Title);
        }
      }
    }
    return favoriteMoviesTitle;
  }
  removeUser(userID: number): void {
    this.deleteAccount.deleteUser(userID).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/']);
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        this.snackBar.open(`Deleted User`, 'OK', {
          duration: 2000,
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
