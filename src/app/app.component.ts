import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'myFlix-Angular-client';

  constructor(public dialog: MatDialog, private router: Router) {}
  // This is the function that will open the dialog when the signup button
  // is clicked
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      // Assigning the dialog a width
      width: '330px',
    });
  }
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '330px',
    });
  }
  logout(): void {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  hiddenNavbar(): boolean {
    return (
      !!localStorage.getItem('userData') && !!localStorage.getItem('token')
    );
  }
}
