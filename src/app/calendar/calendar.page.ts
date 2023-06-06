import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { MenuController } from '@ionic/angular';

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

  constructor(private menuController: MenuController, private appComponent: AppComponent) {
    //this.generateCalendar();
  }

  menuToggle() {
    this.menuController.toggle('main-menu');
  }
  
  ngOnInit() {
    this.generateCalendar();
    this.generateEvents();

  }

  hasEvents(date: string): boolean {
    // Verificar si hay eventos para la fecha proporcionada
    return this.events.some((event) => event.date === date);
  }

  getEvents(date: string): any[] {
    // Obtener los eventos asociados a la fecha proporcionada
    return this.events.filter((event) => event.date === date);
  }
  /*generateMockEvents() {
    const mockEvents = [
      { date: '2023-06-05', time: '9:00 AM', medication: 'Remedio 1', quantity: 2 },
      { date: '2023-06-10', time: '2:00 PM', medication: 'Remedio 2', quantity: 1 },
      { date: '2023-06-15', time: '10:30 AM', medication: 'Remedio 3', quantity: 3 },
    ];
  
    this.events = mockEvents;
  }

  generateCalendar() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();
  
    let currentDay = 1;
    let week: (number | null)[] = [];
  
    for (let i = 0; i < firstDayOfMonth; i++) {
      week.push(null);
    }
  
    for (let i = firstDayOfMonth; i < 7; i++) {
      week.push(currentDay);
      currentDay++;
    }
  
    this.weeks.push(week);
  
    while (currentDay <= daysInMonth) {
      week = [];
      for (let i = 0; i < 7 && currentDay <= daysInMonth; i++) {
        week.push(currentDay);
        currentDay++;
      }
      this.weeks.push(week);
    }
  
    // Verificar si la última semana tiene menos de 7 días
    const lastWeek = this.weeks[this.weeks.length - 1];
    if (lastWeek.length < 7) {
      const remainingDays = 7 - lastWeek.length;
      for (let i = 0; i < remainingDays; i++) {
        lastWeek.push(null);
      }
    }
  }*/
  
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
  }
}
