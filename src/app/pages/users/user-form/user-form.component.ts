import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
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
    RouterModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;

  bancos = [
    { code: 'CONEXUS', name: 'CONEXUS' },
    { code: 'BANCO1', name: 'Banco 1' },
    { code: 'BANCO2', name: 'Banco 2' }
  ];

  perfiles = [
    { code: 'ADMIN', name: 'Administrador' },
    { code: 'USER', name: 'Usuario' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cod_usuario: ['', Validators.required],
      nomb_usuario: ['', Validators.required],
      banco: ['', Validators.required],
      estatus: ['A', Validators.required],
      perfiles: [[], Validators.required]
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

  }

 save() {
    if (this.form.invalid) return;

    if (this.isEdit) {
      this.userService.updateUser(this.form.value);
    } else {
      this.userService.addUser(this.form.value);
    }

    this.router.navigate(['/admin/users']);
  }

  cancel() {
    this.router.navigate(['/admin/users']);
  }
}
