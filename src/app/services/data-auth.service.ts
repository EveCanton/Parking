import { inject, Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { Login, ResLogin } from '../interfaces/login';
import { Register } from '../interfaces/register';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataAuthService {

  router = inject(Router);
  
  constructor() {
    const token = this.getToken();
    if(token){
      if(!this.usuario) this.usuario = {
        username: '',
        token: token,
        esAdmin: false
      }
      else this.usuario!.token = token;
    }
   }

  usuario: Usuario | null = null;

  async login(loginData: Login) {
    const res = await fetch(environment.API_URL+'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    });

    if (res.status !== 200) return { success: false, message: "Error durante login" };

    const resJson: ResLogin = await res.json();

    if (!resJson.token) return { success: false, message: "Token no recibido" };

    this.usuario = {
        username: loginData.username,
        token: resJson.token,
        esAdmin: false
    };

    localStorage.setItem("authToken", resJson.token);

    const userDetailsRes = await fetch(environment.API_URL+`usuarios/${encodeURIComponent(loginData.username)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${resJson.token}`,
            'Content-Type': 'application/json'
        }
    });

    if (userDetailsRes.status !== 200) return { success: false, message: "Error en detalles de usuario" };

    const userDetailsResJson = await userDetailsRes.json();
    this.usuario.esAdmin = userDetailsResJson.esAdmin;

    return { success: true };
}


  async register(registerData: Register) {
    const res = await fetch(environment.API_URL+'register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
    });
    
    
    console.log('REGISTRANDO', res);
    return res;
  }

  getToken() {
    return localStorage.getItem("authToken");
  }

  clearToken() {
    localStorage.removeItem("authToken")
    this.usuario = null;
    this.router.navigate(['/login']);
  }
  

}
