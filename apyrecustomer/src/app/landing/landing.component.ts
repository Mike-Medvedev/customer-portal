import { HttpBackend, HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ApyreValidators } from '../shared/ApyreValidator';
import { MessageService } from 'primeng/api';
import { filter, Subscription, startWith, map, tap, Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  providers: [MessageService],
})
export class LandingComponent implements OnInit, AfterViewInit {
  emailForm!: FormGroup;
  sub!: Subscription;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private messageSvc: MessageService,
    private router: Router,
    private tokenSvc: TokenService,
    private errorSvc: ErrorService,
  ) {}

  show() {
    const email = this.email;
    if (email?.invalid) {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Your email is invalid. Please check the email and try again.',
        sticky: true,
      });
    } else {
      this.messageSvc.add({
        severity: 'success',
        summary: 'Success',
        detail:
          "Please check your email for a confirmation message containing the access link to your personalized portal. If you haven't received it, kindly verify that the email you entered matches the one you provided earlier.",
        sticky: true,
      });
    }
  }

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, ApyreValidators.email]],
    });
    // this.route.queryParams.subscribe((linkFromQuery) => {
    //   const magicLink = linkFromQuery;
    // });
  }

  ngAfterViewInit(): void {
    this.errorSvc.getTokenExpiredObservable().subscribe(e => {
      this.messageSvc.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Your access link has expired.',
        sticky: true,
      });
    });
  }

  getLink() {
    const email = this.emailForm.value.email;

    this.authSvc.requestMagicLink(email).subscribe({
      next: (value): void => {
        console.log('Magic link request successful', value);
      },
      error: (err: Error) => {
        console.error('Magic link request failed:', err);
      },
    });
  }

  get email() {
    return this.emailForm.get('email');
  }
}
