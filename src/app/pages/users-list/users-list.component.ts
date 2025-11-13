import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../../change-password-dialog/change-password-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


interface User {
  cod_usuario: string;
  nomb_usuario: string;
  banco: string;
  estatus: 'A' | 'I' | 'E';
  perfiles: string[];
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent {
  displayedColumns: string[] = [
    'cod_usuario',
    'nomb_usuario',
    'banco',
    'estatus',
    'perfiles',
    'acciones',
  ];
  users$!: Observable<User[]>; // 👈 observable
  constructor(private userService: UserService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {}
  ngOnInit() {
    this.users$ = this.userService.users$; // 👈 asignar observable del servicio
  }

  edit(user: User) {
    console.log('Editar usuario:', user);
    // Aquí navegarías a /admin/users/:id/edit
    this.router.navigate(['/admin/users', user.cod_usuario, 'edit']);
  }

  delete(user: User) {
  this.userService.updateUser({ ...user, estatus: 'E' }); // 👈 solo cambia el estatus
}


  resetPassword(user: User) {
    console.log('Resetear clave de:', user);
    // Aquí llamarías a backend para resetear clave
  }
  openChangePassword(user: User) {
  const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
    width: '400px',
    data: { cod_usuario: user.cod_usuario }
  });

  dialogRef.afterClosed().subscribe({
    next: (newPassword) => {
      if (newPassword) {
        try {
          // Aquí actualizas la clave en el servicio o backend
          // this.userService.changePassword(user.cod_usuario, newPassword);

          // ✅ Snackbar de éxito
          this.snackBar.open(
            `Clave de ${user.cod_usuario} actualizada correctamente`,
            'Cerrar',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            }
          );
        } catch (err) {
          // ❌ Snackbar de error
          this.snackBar.open(
            `Error al actualizar la clave de ${user.cod_usuario}`,
            'Cerrar',
            {
              duration: 4000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['snackbar-error']
            }
          );
        }
      }
    },
    error: () => {
      this.snackBar.open(
        `Error inesperado al cambiar la clave`,
        'Cerrar',
        {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        }
      );
    }
  });
}
}
