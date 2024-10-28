import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DataAuthService } from '../../services/data-auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  errorRegister = false;
  authService = inject(DataAuthService)
  router = inject(Router)

  async register(registerForm: NgForm) {
    const { username, nombre, apellido, password } = registerForm.value;
    const registerData = { username, nombre, apellido, password };
    
    try {
      // Llamada al método de registro en el servicio
      const res = await this.authService.register(registerData);

      // Verificación de estado para confirmar el registro exitoso
      if (res.ok) {
        Swal.fire("Registro exitoso", "", "success").then(() => {
          this.router.navigate(['/login']);
        });
      } else {
        this.errorRegister = true;
        Swal.fire("Error en el registro", "Intenta nuevamente", "error");
      }
    } catch (error) {
      // Manejo de errores en caso de problemas de conexión o respuesta inesperada
      console.error("Error en el registro:", error);
      this.errorRegister = true;
      Swal.fire("Error en el registro", "Intenta nuevamente", "error");
    }
  }
}
