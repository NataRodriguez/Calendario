import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  email!: string;
  password!: string;
  name!: string;

  constructor( private router: Router) {}

  register() {    
    // Redirigir a la página principal o a la página deseada después del inicio de sesión
    this.router.navigate(['/login']);
  }
}
