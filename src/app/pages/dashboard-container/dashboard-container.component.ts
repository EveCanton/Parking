import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { DataAuthService } from '../../services/data-auth.service';

// Es el panel de arriba
@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent {
  esAdmin = true;
  authService = inject(DataAuthService);
  router = inject(Router);

  cerrarSesion(){
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}

