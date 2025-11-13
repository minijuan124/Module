import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  passwordVisible = false;
  loading = false;
  showSuccess = false;
  loginError = '';

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  // Log only the current values to avoid dumping the full FormGroup internals to the terminal
  console.log('[LoginComponent] constructor: form initialized, value=', this.form.value);
  }

  onSubmit() {
    console.log('[LoginComponent] onSubmit called');
    if (this.form.valid) {
      console.log('[LoginComponent] form valid, values:', this.form.value);
      const { username, password } = this.form.value;
      this.setLoading(true);
      this.loginError = '';

      // call the AuthService (simulated async)
      this.auth.login(username, password).then(ok => {
        console.log('[LoginComponent] auth.login resolved ->', ok);
        this.setLoading(false);
        if (ok) {
          this.showGentleSuccess();
        } else {
          this.loginError = 'Usuario o contraseña incorrectos. Credenciales de prueba: demo@conexus.com / Demo1234';
          // clear password field for user to retry
          this.form.patchValue({ password: '' });
          this.password?.markAsTouched();
        }
      });
    } else {
      console.log('[LoginComponent] form invalid', this.form.errors, this.form.value);
      this.form.markAllAsTouched();
    }
  }

  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
  
  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
  
  socialLogin(provider: string, event: Event) {
    event?.preventDefault();
    console.log(`Signing in with ${provider}...`);
    const btn = (event.currentTarget as HTMLElement);
    if (!btn) { return; }
    // gentle loading state on the clicked button
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.style.pointerEvents = 'auto';
      btn.style.opacity = '1';
      // Here you would trigger actual social auth flow
      console.log(`${provider} flow complete (demo)`);
    }, 2000);
  }
  
  setLoading(loading: boolean) {
    this.loading = loading;
  }
  
  showGentleSuccess() {
    // hide form elements softly and show success panel
    this.showSuccess = true;
    // Navigate to dashboard immediately so Angular router handles the route change
    // Keep the visual success state for a short time if desired
    this.router.navigate(['/dashboard']);
  }
}
