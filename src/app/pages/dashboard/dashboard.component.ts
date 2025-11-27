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
    { code: 3, name: 'Visión Operativa', color: 'accent', url: 'https://app.powerbi.com/groups/me/reports/b910afe7-ad22-4ae9-a444-caa297ae5644/681eea43ead9a4187227?ctid=9c396733-d21f-4657-b0f7-59e01c06818a&experience=power-bi&bookmarkGuid=01a89ea2-ee3a-4297-af7f-5fb19bd64765', icon: 'work' },
    { code: 6, name: 'Visión Financiera', color: 'warn', url: 'https://app.powerbi.com/groups/me/reports/b910afe7-ad22-4ae9-a444-caa297ae5644/5dc3f9e74d7d80207400?ctid=9c396733-d21f-4657-b0f7-59e01c06818a&experience=power-bi&bookmarkGuid=01a89ea2-ee3a-4297-af7f-5fb19bd64765', icon: 'account_balance' },
    { code: 7, name: 'Alertas Tempranas', color: 'warn', url: 'https://powerbi.com/alertas', icon: 'notification_important' },
    { code: 8, name: 'Reportes Ad Hoc', color: 'primary', url: 'https://app.powerbi.com/links/RqQn5B6v0u?ctid=9c396733-d21f-4657-b0f7-59e01c06818a&pbi_source=linkShare&bookmarkGuid=01a89ea2-ee3a-4297-af7f-5fb19bd64765', icon: 'bar_chart' },
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
