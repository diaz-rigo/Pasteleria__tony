import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { getTextColor } from '../../shared/helpers/color.helpers';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],

  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  // brandBg = '#FFF8F6';
  // brandText = '#3E2723';
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  // Si tienes un servicio de configuración, cámbialo por tus valores:
  brandBg = '#fbeded';
  brandText = getTextColor(this.brandBg);
  showPass = false;
  loading = false;
  errorMsg = '';

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    aceptaTerminos: [false, Validators.requiredTrue],
  }, { validators: [matchPasswords('password', 'confirmPassword')] });

  // constructor(private fb: FormBuilder) {}

  get passwordMismatch(): boolean {
    return this.form.hasError('passwordMismatch') &&
           this.form.get('confirmPassword')?.touched === true;
  }

  invalid(path: string): boolean {
    const ctrl = this.get(path);
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  get(path: string): AbstractControl | null {
    return path.split('.').reduce(
      (acc: AbstractControl | null, key) => acc?.get(key) ?? null,
      this.form as AbstractControl
    );
  }

  async submit() {
    this.errorMsg = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const payload = {
      nombre: v.nombre.trim(),
      email: v.email.trim().toLowerCase(),
      telefono: v.telefono,
      password: v.password,
      origen: 'web'
    };

    try {
      this.loading = true;
      // TODO: integra tu servicio real:
      // await this.api.post('/api/clientes', payload).toPromise();
      console.log('payload registro mínimo:', payload);
      // this.router.navigateByUrl('/mi-cuenta');
    } catch (e) {
      this.errorMsg = 'No se pudo completar el registro. Intenta de nuevo.';
    } finally {
      this.loading = false;
    }
  }
}

/** Validador simple para confirmar contraseña */
export function matchPasswords(passKey: string, confirmKey: string) {
  return (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get(passKey)?.value;
    const confirm = group.get(confirmKey)?.value;
    return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
  };
}
