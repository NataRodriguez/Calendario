import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  email!: string;
  password!: string;
  userData: any = {}; // Variable para almacenar los datos de la API
  locationData: any = {}; // Variable para almacenar los datos de geolocalización

  constructor(private http: HttpClient, private authService: AuthService, private router: Router, private sqlite: SQLite) {}

  ngOnInit(){
      this.http.get('https://jsonplaceholder.typicode.com/posts/1/comments').subscribe((data: any) => {
        this.userData = data[0]; // Tomar el primer objeto de la respuesta de la API
      });
      
      this.createUserTable();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.locationData.latitude = position.coords.latitude;
            this.locationData.longitude = position.coords.longitude;
            console.log('Ubicación:', this.locationData);
          },
          (error) => {
            console.error('Error al obtener la ubicación:', error);
          }
        );
      } else {
        console.error('Geolocalización no soportada por el navegador.');
      }
  }

  createUserTable() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          correo TEXT,
          clave TEXT
        )
      `, [])
      .then(() => console.log('Tabla usuarios creada correctamente.'))
      .catch(error => console.error('Error al crear la tabla usuarios:', error));
    })
    .catch(error => console.error('Error al abrir la base de datos:', error));
  }

  login() {    
    // Realizar el proceso de inicio de sesión
    this.authService.login();
    this.router.navigate(['/calendar']); // Redirigir a la página principal o a la página deseada después del inicio de sesión
  }
}
