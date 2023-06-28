import { Component, ViewChild } from '@angular/core';
import { AuthService } from './auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {
  @ViewChild('main-menu') mainMenu: any;

  public pages = [
    { title: 'Agregar Medicamento', url: '/medication' },    
    { title: 'Calendario', url: '/calendar' },
    { title: 'Salir', url: '/login' }
  ];
  public isAuthenticated = false;

  constructor(private menuController: MenuController, private authService: AuthService) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
  }

  login() {
    this.authService.login();
    this.isAuthenticated = true;
  }

  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
  }

  menuToggle() {
    this.menuController.toggle('main-menu');
  }
}
