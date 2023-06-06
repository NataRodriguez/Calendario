import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.page.html',
  styleUrls: ['./medication.page.scss'],
})
export class MedicationPage implements OnInit {

  medicationName!: string;
  startDate!: string;
  dosage!: string;
  frequency!: string;
  duration!: number;

  constructor(private menuController: MenuController) { }

  ngOnInit() {
  }
  
  menuToggle() {
    this.menuController.toggle('main-menu');
  }
  
  saveMedication() {
    // Aquí puedes agregar la lógica para guardar el medicamento
    console.log('Medication saved!');
  }


}
