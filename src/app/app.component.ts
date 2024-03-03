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

/**
 * This is the App component, used to login and registering.
 */
export class AppComponent {
  title = 'myFlix-Angular-client';

  constructor(public dialog: MatDialog, private router: Router) {}

  /**
   * Logs the user out.
   */
  logout(): void {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  /**
   * Hides Navbar when user logs out
   */
  hiddenNavbar(): boolean {
    return (
      !!localStorage.getItem('userData') && !!localStorage.getItem('token')
    );
  }
}
