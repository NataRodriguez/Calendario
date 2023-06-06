import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email!: string;
  password!: string;

  constructor( private router: Router) {}

  login() {    
    // Redirigir a la página principal o a la página deseada después del inicio de sesión
    this.router.navigate(['/calendar']);
  }
}
