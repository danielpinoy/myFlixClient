// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrl: './user-registration-form.component.scss',
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = { username: '', password: '', email: '', birthday: '' };

  isLoading: boolean = false;
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  // This is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.isLoading = true;
    console.log(this.isLoading);
    this.fetchApiData.postUserRegistration(this.userData).subscribe(
      (result) => {
        const username = result.Username;
        this.dialogRef.close();
        this.snackBar.open(`${username} has been registered`, 'OK', {
          duration: 2000,
        });
      },
      (result) => {
        this.isLoading = false;

        console.log(result);

        this.snackBar.open(result, 'OK', {
          duration: 2000,
        });
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
