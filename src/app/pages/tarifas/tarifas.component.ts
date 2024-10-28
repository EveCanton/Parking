import { Component, inject } from '@angular/core';
import { Tarifa } from '../../interfaces/tafira';
import { DataTarifasService } from '../../services/data-tarifas.service';
import { CommonModule } from '@angular/common';
import { DataAuthService } from '../../services/data-auth.service';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tarifas.component.html',
  styleUrl: './tarifas.component.scss'
})
export class TarifasComponent {
  dataTarifasService = inject(DataTarifasService);
  authService = inject(DataAuthService);

  esAdmin = true;
  nuevoValor: number;
  constructor(){
    this.nuevoValor = 0;
  }


  preguntarCambiarTarifa(tarifaId: string, valorNuevo: number){
    Swal.fire({
      title: "Querés cambiar la tarifa?",
      html: `<input type="text" id="tarifa" class="swal2-input" placeholder="Ingrese nuevo valor">`,
      showCancelButton: true,
      confirmButtonText: "Cambiar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const tarifaInput = document.getElementById("tarifa") as HTMLInputElement
        if (!tarifaInput || !tarifaInput.value) {
          Swal.showValidationMessage("Por favor, ingrese una tarifa")
          return false;
        } 
        return { tarifa: tarifaInput.value };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { tarifa } = result.value;
        await this.dataTarifasService.actualizarTarifa(tarifaId, tarifa);
        // Actualiza el valor localmente en la tabla
        const tarifaActualizada = this.dataTarifasService.tarifas.find(tarifa => tarifa.id === tarifaId);
        if (tarifaActualizada) {
            tarifaActualizada.valor = parseFloat(tarifa); // Asegúrate de convertir el nuevo valor a número
        }
        Swal.fire("Tarifa actualizada", "", "success"); // Mensaje de éxito
       
    }
  })
  } 


  
}