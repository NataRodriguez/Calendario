import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.page.html',
  styleUrls: ['./medication.page.scss'],
})
export class MedicationPage implements OnInit {

  medicationName!: string;
  startDate!: string;
  dosage!: string;
  frequency!: number;
  frequencyType!: string;
  duration!: number;
  firstDoseTime!: string;
  showMinutes!: boolean;
  minutes!: number;

  constructor(private authService: AuthService, private menuController: MenuController, private sqlite: SQLite, private router: Router) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      // Redirigir al inicio de sesión si no está autenticado
      this.router.navigate(['/login']);
    }
  }
  
  menuToggle() {
    this.menuController.toggle('main-menu');
  }
  
  saveMedication() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      const startDate = new Date(this.startDate);
      const duration = Number(this.duration);
      const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000); // Agrega la duración en milisegundos

      const insertQuery = `
        INSERT INTO medicamentos (nombre_medicamento, fecha_inicio, duracion_tratamiento, fecha_fin, dosis, frecuencia_dosis)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const insertParams = [this.medicationName, this.startDate, this.duration, endDate.toISOString(), this.dosage, this.frequency];

      
      db.executeSql(insertQuery, insertParams)
      .then(() => {
        console.log('Medicamento guardado correctamente.');
        
        // Obtener el último ID insertado
        const getLastInsertIdQuery = `SELECT last_insert_rowid() AS id`;
        db.executeSql(getLastInsertIdQuery, [])
        .then((result) => {
          const medicationId = result.rows.item(0).id;
          
          // Calcular la fecha de fin sumando la duración en días a la fecha de inicio
          const startDate = new Date(this.startDate);
          const endDate = new Date(startDate.getTime() + (this.duration * 24 * 60 * 60 * 1000));
          const formattedEndDate = endDate.toISOString().split('T')[0];
          
          // Insertar las frecuencias de medicamentos en la tabla frecuencia_medicamentos
          const frequencyQuery = `
            INSERT INTO frecuencia_medicamentos (medicamento_id, fecha, hora)
            VALUES (?, ?, ?)
          `;
          
          if (this.frequencyType === 'dias') {
            // Si la frecuencia es en días, se inserta una sola vez con la fecha de inicio
            const frequencyParams = [medicationId, this.startDate, this.firstDoseTime];
            db.executeSql(frequencyQuery, frequencyParams)
            .then(() => console.log('Frecuencia guardada correctamente.'))
            .catch(error => console.error('Error al guardar la frecuencia:', error));
          } else if (this.frequencyType === 'horas') {
            // Si la frecuencia es en horas, se calcula la fecha y hora de cada dosis
            const frequencyInterval = this.frequency * 60 * 60 * 1000; // Convertir la frecuencia a milisegundos
            let currentDate = new Date(startDate);
            const endTime = endDate.getTime();
            
            while (currentDate.getTime() < endTime) {
              const formattedDate = currentDate.toISOString().split('T')[0];
              const frequencyParams = [medicationId, formattedDate, this.firstDoseTime];
              db.executeSql(frequencyQuery, frequencyParams)
              .then(() => console.log('Frecuencia guardada correctamente.'))
              .catch(error => console.error('Error al guardar la frecuencia:', error));
              
              currentDate = new Date(currentDate.getTime() + frequencyInterval);
            }
          }
        })
        .catch(error => console.error('Error al obtener el ID del medicamento:', error));
      })
      .catch(error => console.error('Error al guardar el medicamento:', error));
    })
    .catch(error => console.error('Error al abrir la base de datos:', error));
  }
  


}
