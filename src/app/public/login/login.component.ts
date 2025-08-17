import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { getTextColor } from '../../shared/helpers/color.helpers';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink,HttpClientModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  // Branding (ajusta a tu gusto / servicio de config)
  brandBg = '#fbeded';
  brandText = getTextColor(this.brandBg);

  showPass = false;
  loading = false;
  errorMsg: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true]
  });

  invalid(ctrl: 'email' | 'password') {
    const c = this.form.get(ctrl);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  submit() {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.errorMsg = null;

    const { email, password } = this.form.value;

    // Llamada real al backend
    this.auth.login({ email: email!, password: password! })
      .subscribe({
        next: (user) => {
          // Redirección según rol del JWT
          // En tu token de ejemplo viene "rol": "ADMIN"
          if (user?.rol === 'ADMIN') {
            this.router.navigateByUrl('/admin');
          } else {
            this.router.navigateByUrl('/customer'); // ajusta al landing del cliente
          }
        },
        error: (err) => {
          // Mensaje amigable si el backend no manda uno
          this.errorMsg = err?.error?.message ?? 'Credenciales inválidas. Verifica tu correo y contraseña.';
          this.loading = false;
        },
        complete: () => (this.loading = false)
      });
  }

  // Botones de demo/QA (quitar en producción)
  quick(kind: 'admin' | 'customer') {
    const creds = kind === 'admin'
      ? { email: 'admin@tony.com', password: 'admin123' }
      : { email: 'cliente@tony.com', password: 'cliente123' };
    this.form.patchValue(creds);
  }
}
