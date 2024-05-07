import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  stateOptions: any[] = [
    { label: 'At-need', value: 'off' },
    { label: 'Pre-need', value: 'on' },
  ];

  value: string = 'off';
  constructor(
    private fb: FormBuilder,
    private apiSvc: ApiService,
    private route: ActivatedRoute,
    private authSvc: AuthService,
    private tokenSvc: TokenService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.email],
    });

    this.route.queryParams.subscribe(params => {
      const emailFromQuery = params['email'];
      if (emailFromQuery) {
        this.form.patchValue({ email: emailFromQuery });
      }
    });

    // this.verifyMagicLink();
  }

  getMagicLink(): void {
    const email = this.form.value.email;

    this.authSvc.requestMagicLink(email).subscribe({
      next: (value): void => {
        console.log('Magic link request successful', value);
      },
      error: (err: Error) => {
        console.error('Magic link request failed:', err);
      },
    });
  }
}
