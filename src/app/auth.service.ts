import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  constructor() {}

  login() {
    // Lógica para iniciar sesión
    this.isLoggedIn = true;
  }

  logout() {
    // Lógica para cerrar sesión
    this.isLoggedIn = false;
  }

  isAuthenticated() {
    // Retorna true si el usuario ha iniciado sesión, false de lo contrario
    return this.isLoggedIn;
  }
}
