import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { MenuController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  daysOfWeek: string[] = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  weeks: (number | null)[][] = [];
  
  public calendar: any[] = []; // Array de objetos para almacenar los días del calendario
  public events: any[] = []; // Array de objetos para almacenar los eventos

  constructor(private authService: AuthService, private menuController: MenuController, private appComponent: AppComponent, private sqlite: SQLite, private router: Router) {
    //this.generateCalendar();
  }

  menuToggle() {
    this.menuController.toggle('main-menu');
  }
  
  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      // Redirigir al inicio de sesión si no está autenticado
      this.router.navigate(['/login']);
    } else {
      this.generateCalendar();
      this.generateEvents();
      this.createMedicamentosTable();
    }
  }

  hasEvents(date: string): boolean {
    // Verificar si hay eventos para la fecha proporcionada
    return this.events.some((event) => event.date === date);
  }

  getEvents(date: string): any[] {
    // Obtener los eventos asociados a la fecha proporcionada
    return this.events.filter((event) => event.date === date);
  }
  
  createMedicamentosTable() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql(`
        CREATE TABLE IF NOT EXISTS medicamentos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre_medicamento TEXT,
          fecha_inicio TEXT,
          duracion_tratamiento INTEGER,
          fecha_fin TEXT,
          dosis INTEGER
        )
      `, [])
      .then(() => console.log('Tabla medicamentos creada correctamente.'))
      .catch(error => console.error('Error al crear la tabla medicamentos:', error));
  
      db.executeSql(`
        CREATE TABLE IF NOT EXISTS frecuencia_medicamentos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          medicamento_id INTEGER,
          hora TEXT,
          FOREIGN KEY (medicamento_id) REFERENCES medicamentos (id)
        )
      `, [])
      .then(() => console.log('Tabla frecuencia_medicamentos creada correctamente.'))
      .catch(error => console.error('Error al crear la tabla frecuencia_medicamentos:', error));
    })
    .catch(error => console.error('Error al abrir la base de datos:', error));
  }
  

  generateCalendar() {
    // Generar datos de muestra para el calendario (30 días)
    const startDate = new Date(); // Fecha de inicio (hoy)
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
      const formattedDate = currentDate.toISOString().split('T')[0]; // Formato de fecha YYYY-MM-DD
      const day = {
        date: formattedDate,
        // Otras propiedades del día si es necesario
      };
      this.calendar.push(day);
    }
  }

  generateEvents() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript comienzan desde 0, por lo que sumamos 1
      const currentYear = currentDate.getFullYear();
      const startDate = `${currentYear}-${currentMonth}-01`;
      const endDate = `${currentYear}-${currentMonth + 1}-01`;
  
      const query = `
        SELECT m.*, f.hora
        FROM medicamentos m
        LEFT JOIN frecuencia_medicamentos f ON m.id = f.medicamento_id
        WHERE m.fecha_inicio >= '${startDate}' AND m.fecha_inicio < '${endDate}'
      `;
  
      db.executeSql(query, [])
      .then((result) => {
        for (let i = 0; i < result.rows.length; i++) {
          const row = result.rows.item(i);
          const event = {
            date: row.fecha_inicio,
            time: row.hora || '', // Agrega la hora si está disponible en la tabla frecuencia_medicamentos
            medication: row.nombre_medicamento,
            quantity: `${row.dosis} comprimidos`, // Agrega la dosis y la unidad correspondiente si están disponibles en la tabla medicamentos
          };
          this.events.push(event);
        }
      })
      .catch(error => console.error('Error al obtener los medicamentos:', error));
    })
    .catch(error => console.error('Error al abrir la base de datos:', error));
  }
  
  
/*
  generateEvents() {
    // Generar datos de muestra para los eventos
    const event1 = {
      date: '2023-06-05',
      time: '10:00',
      medication: 'Medicamento A',
      quantity: '2 comprimidos',
    };
    const event2 = {
      date: '2023-06-10',
      time: '14:30',
      medication: 'Medicamento B',
      quantity: '1 comprimido',
    };
    const event3 = {
      date: '2023-06-15',
      time: '08:00',
      medication: 'Medicamento C',
      quantity: '3 comprimidos',
    };
    this.events.push(event1, event2, event3);
  }*/
}
