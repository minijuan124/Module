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
  // Mapa codigoABA -> descripcion para mostrar nombre del banco
  banksMap: Record<string, string> = {};
  constructor(private userService: UserService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {}
  // Mapa codigoPerfil -> descripcion (llenado desde API)
  profilesMap: Record<string, string> = {};

  translateProfiles(perfiles: string[] = []): string {
    if (!perfiles || perfiles.length === 0) return '';
    return perfiles.map(p => this.profilesMap[String(p)] ?? String(p)).join(', ');
  }
  ngOnInit() {
    this.users$ = this.userService.users$; // 👈 asignar observable del servicio
    // Suscribirse al listado de bancos para convertir código en descripción
    this.userService.banks$.subscribe(banks => {
      this.banksMap = (banks || []).reduce((acc: Record<string,string>, b: any) => {
        acc[String(b.codigoABA)] = b.descripcion;
        return acc;
      }, {} as Record<string,string>);
    });
    // Cargar bancos en caso de que no estén cargados
    this.userService.fetchAllBanks().subscribe({ next: () => {}, error: () => {} });
    // Suscribirse a perfiles y crear mapa codigoPerfil -> descripcion
    this.userService.profiles$.subscribe(perfiles => {
      this.profilesMap = (perfiles || []).reduce((acc: Record<string,string>, p: any) => {
        acc[String(p.codigoPerfil)] = p.descripcion;
        return acc;
      }, {} as Record<string,string>);
    });
    // Asegurar que los perfiles estén cargados
    this.userService.fetchAllProfiles().subscribe({ next: () => {}, error: () => {} });
    // Cargar usuarios desde la API al iniciar
    this.userService.fetchAllUsers().subscribe({
      next: () => {},
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  edit(user: User) {
    console.log('Editar usuario:', user);
    // Aquí navegarías a /admin/users/:id/edit
    this.router.navigate(['/admin/users', user.cod_usuario, 'edit']);
  }

  delete(user: User) {
    // Llamar al endpoint para eliminar lógicamente el usuario y esperar respuesta
    this.userService.deleteUserRemote(user.cod_usuario).subscribe({
      next: () => {
        this.snackBar.open(`Usuario ${user.cod_usuario} eliminado correctamente`, 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error eliminando usuario', err);
        this.snackBar.open(`Error al eliminar ${user.cod_usuario}`, 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
      }
    });
}

  translateBank(code: string | number | undefined): string {
    if (code === undefined || code === null) return '';
    const key = String(code);
    return this.banksMap[key] ?? key;
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
          // Admin changes password via updateUser (server-side will accept 'clave' in bodyEntrada)
          const payload: any = {
            cod_usuario: user.cod_usuario,
            nomb_usuario: user.nomb_usuario,
            perfiles: user.perfiles,
            // send the new password in the `clave` field so updateUserRemote includes it
            clave: newPassword
          };
          // Ensure API receives a valid numeric company code (empresaUsuario). user.banco may be a string.
          const empresaNum = Number(user.banco);
          if (!Number.isNaN(empresaNum) && empresaNum > 0) {
            payload.empresaUsuario = empresaNum;
          }
          this.userService.updateUserRemote(payload).subscribe({
            next: () => {
              this.snackBar.open(`Clave de ${user.cod_usuario} actualizada correctamente (admin)`, 'Cerrar', { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' });
            },
            error: (err) => {
              // Mostrar detalles devueltos por el servidor para depuración (por ejemplo validaciones)
              console.error('Error actualizando contraseña (admin)', err);
              const serverDetail = err?.error && typeof err.error === 'object' ? JSON.stringify(err.error) : (err?.error || err?.message || 'Error desconocido');
              // Mostrar mensaje conciso en snackbar y volcar detalles a consola
              this.snackBar.open(`Error al actualizar la clave: ${err.status || ''} ${err?.error?.message ?? err?.message ?? 'Revise la consola'}`, 'Cerrar', { duration: 6000, panelClass: ['snackbar-error'] });
              console.debug('Detalles del error de updateUserRemote:', serverDetail);
            }
          });
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
