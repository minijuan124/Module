import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

interface Vision {
  code: number;
  name: string;
  color: string;
  url: string;
  icon: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  visions: Vision[] = [
    { code: 2, name: 'Visión Gerencial', color: 'primary', url: 'https://powerbi.com/gerencial', icon: 'leaderboard' },
    { code: 3, name: 'Visión Operativa', color: 'accent', url: 'https://powerbi.com/operativa', icon: 'work' },
    { code: 6, name: 'Visión Financiera', color: 'warn', url: 'https://powerbi.com/financiera', icon: 'account_balance' },
    { code: 7, name: 'Alertas Tempranas', color: 'warn', url: 'https://powerbi.com/alertas', icon: 'notification_important' },
    { code: 8, name: 'Reportes Ad Hoc', color: 'primary', url: 'https://app.powerbi.com/groups/f3a16ca3-693e-49f5-b1c4-fca383c39d48/reports/965eb058-3364-44fe-80ec-29d2d66f2dae/fa507c822f01aa20002e?experience=power-bi', icon: 'bar_chart' },
    { code: 9, name: 'Gestión de Usuarios', color: 'primary', url: 'admin/users', icon: 'manage_accounts', adminOnly: true }

  ];

  constructor(private router: Router, private auth: AuthService) {}
 openVision(v: Vision) {
    if (v.url.startsWith('http')) {
      window.open(v.url, '_blank');
    } else {
      this.router.navigate([v.url]);
    }
  }
  get filteredVisions() {
  return this.visions.filter(v => !v.adminOnly || this.isAdmin());
}


  isAdmin(): boolean {
    const user = this.auth.currentUser();
    return !!user && user.roles.includes('ADMIN');
  }
  logout() {
    // Aquí limpias sesión/token según tu implementación
    localStorage.removeItem('authToken'); // ejemplo
    sessionStorage.clear();

    // Redirigir al login
    this.router.navigate(['/login']);
  }
}
