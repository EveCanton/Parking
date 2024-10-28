import { inject, Injectable } from '@angular/core';
import { Tarifa } from '../interfaces/tafira';
import { DataAuthService } from './data-auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataTarifasService {

  tarifas: Tarifa[] = []
  authService = inject(DataAuthService);
  

  constructor() {
    this.loadData()
   }

  async loadData() {
    await this.getTarifas()
    
  }

  async getTarifas(){
    const res = await fetch(environment.API_URL+'tarifas',{
      headers: {
        authorization:'Bearer '+ localStorage.getItem("authToken")
      },
    })
    if(res.status !== 200) return;
    const resJson: Tarifa[] = await res.json();
    this.tarifas = resJson;
  }


  async actualizarTarifa(idTarifa: string, nuevoValor: number) {
    const body ={idTarifa, nuevoValor}
    const res = await fetch(environment.API_URL+`cocheras/${idTarifa}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem("authToken")
      },
      body: JSON.stringify( body )
    });
    if (res.status !== 200) {
      console.log("Error en actualizar tarifa");
    } else {
      console.log("Tarifa actualizada");
      await this.loadData()
    };
  }
  
}