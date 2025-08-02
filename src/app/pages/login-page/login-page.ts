import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  get username() {
    return this.form.get('username');
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (!this.form.valid) {
      return;
    }

    this.authService.login(this.form.value).subscribe((res) => {
      console.log(res);
    });
  }
}
