import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hidePassword: boolean = true;
  showSpinner: boolean = false;
  passswordValidations: string[] = ['-minimum length 8 chars'];
  signinError: boolean = false;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  login() {
    if (this.loginForm.valid) {
      this.authService.loginSpinner.next(true);
      this.authService
        .signIn({
          email: this.loginForm.controls['email'].value,
          password: this.loginForm.controls['password'].value,
        })
        .subscribe({
          next: (res: any) => {
            this.storageService.setKey('admin', res);
            this.authService.changeloginstatus(true);
            this.router.navigate(['/dashboard/books']);

            this.authService.loginSpinner.next(false);
          },
          error: (err: any) => {
            this.signinError = true;
            setTimeout(() => {
              this.signinError = false;
            }, 2500);
            console.log(err);
          },
        });
      this.authService.loginSpinner.next(false);
    }
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  ngOnInit(): void {}
}
