import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInState = false;

  constructor(private router: Router) {}

  login() {
    // Realizar el proceso de inicio de sesión y establecer la variable de sesión como verdadera
    this.isLoggedInState = true;
  }

  logout() {
    // Realizar el proceso de cierre de sesión y establecer la variable de sesión como falsa
    this.isLoggedInState = false;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInState;
  }

  canActivate(): boolean {
    // Verificar si el usuario está autenticado antes de acceder a una ruta protegida
    if (this.isLoggedInState) {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirigir al inicio de sesión si no está autenticado
      return false;
    }
  }
}
