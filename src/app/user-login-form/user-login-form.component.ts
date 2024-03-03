import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss', '../app.component.scss'],
})

/**
 * Logs in the user using the provided user data.
 * @returns void
 * @remarks This method sends a request to the API to log in the user with the provided credentials.
 * It handles success by closing the login dialog, displaying a success message, storing user data and token in localStorage, and navigating to the movies page.
 * It handles errors by displaying an error message and resetting the loading state.
 */
export class UserLoginFormComponent implements OnInit {
  userData = { Username: '', Password: '' };
  loading: boolean = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}
  ngOnInit(): void {}

  loginUser(): void {
    this.loading = true;

    this.fetchApiData.postUserLogin(this.userData).subscribe(
      (result) => {
        this.dialogRef.close();
        this.snackBar.open('Successful', 'OK', {
          duration: 2000,
        });
        // LocalStorage
        localStorage.setItem('userData', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.router.navigate(['movies']);
      },
      (error) => {
        this.loading = false;
        this.snackBar.open(error, 'OK', {
          duration: 2000,
        });
      },
      () => {
        this.loading = false;
      }
    );
  }
}
