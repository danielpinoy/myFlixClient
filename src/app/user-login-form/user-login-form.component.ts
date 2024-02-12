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
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };
  loading: boolean = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}
  ngOnInit(): void {
    console.log(this.loading);
  }

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
