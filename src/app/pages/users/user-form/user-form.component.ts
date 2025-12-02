import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user-service.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIcon,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;

  bancos: Array<{ codigoABA: number; descripcion: string }> = [];

  perfiles: Array<{ codigoPerfil: string; descripcion: string }> = [];

  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cod_usuario: ['', Validators.required],
      nomb_usuario: ['', Validators.required],
      banco: ['', Validators.required],
      estatus: ['A', Validators.required],
      empresaUsuario: [105, Validators.required],
      codigoPerfilAsociado: [1, Validators.required],
      clave: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
if (id) {
  this.isEdit = true;
  const user = this.userService.getUser(id);
  if (user) {
    this.form.patchValue(user);
  } else {
    // Si el usuario no existe, redirige o muestra error
    this.router.navigate(['/admin/users']);
  }
}

    // Cargar bancos desde la API y suscribirse al store
    this.userService.fetchAllBanks().subscribe({
      next: (b) => {
        this.bancos = b;
        if (!this.isEdit && b && b.length) {
          const first = b[0];
          // Si no hay valor en el control banco, ponemos el primero
          if (!this.form.get('banco')?.value) {
            this.form.patchValue({ banco: first.codigoABA, empresaUsuario: first.codigoABA });
          }
        }
      },
      error: (err) => console.error('Error cargando bancos', err)
    });

    // Cargar perfiles desde la API y suscribirse al store
    this.userService.fetchAllProfiles().subscribe({
      next: (p) => {
        this.perfiles = p;
        if (!this.isEdit && p && p.length) {
          const firstP = p[0];
          if (!this.form.get('codigoPerfilAsociado')?.value) {
            // Use codigoPerfil (string) but our form default is number, so set as string
            this.form.patchValue({ codigoPerfilAsociado: firstP.codigoPerfil });
          }
        }
      },
      error: (err) => console.error('Error cargando perfiles', err)
    });

  }

  save() {
    if (this.form.invalid) return;
    if (this.isEdit) {
      this.isSaving = true;
      // Persistir cambios en el backend y actualizar store local
      this.userService.updateUserRemote(this.form.value).subscribe({
        next: () => {
          this.isSaving = false;
          // También actualizar el store local por si la API no devuelve el objeto actualizado
          this.userService.updateUser(this.form.value);
          this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Error actualizando usuario', err);
          this.snackBar.open('Error al actualizar el usuario', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
        }
      });
    } else {
      this.isSaving = true;
      this.userService.createUser(this.form.value).subscribe({
        next: () => {
          this.isSaving = false;
          this.snackBar.open('Usuario creado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Error creating user', err);
          this.snackBar.open('Error al crear el usuario', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/users']);
  }
}
