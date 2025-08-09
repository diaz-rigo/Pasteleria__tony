import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { getTextColor } from '../../shared/helpers/color.helpers';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  // imports: [CommonModule,FormsModule,FormGroup],
  imports: [CommonModule,FormsModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  // Si tienes un servicio de configuración, cámbialo por tus valores:
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

    const { email, password, remember } = this.form.value;

    // this.auth.login({ email: email!, password: password!, remember: !!remember })
    //   .subscribe({
    //     next: (user) => {
    //       // Redirección por rol
    //       const roles = user?.roles ?? [];
    //       if (roles.includes('admin')) this.router.navigateByUrl('/admin');
    //       else this.router.navigateByUrl('/customer');
    //     },
    //     error: (err) => {
    //       this.errorMsg = err?.error?.message ?? 'Credenciales inválidas.';
    //       this.loading = false;
    //     },
    //     complete: () => this.loading = false
    //   });
  }

  // Botones de demo/QA (quitar en producción)
  quick(kind: 'admin' | 'customer') {
    const creds = kind === 'admin'
      ? { email: 'admin@tony.com', password: 'admin123' }
      : { email: 'cliente@tony.com', password: 'cliente123' };
    this.form.patchValue(creds);
  }
}
