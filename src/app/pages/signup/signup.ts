import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  currentStep = 1;
  selectedRole = '';
  
  step1Form: FormGroup;
  step3Form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.step1Form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.step3Form = this.fb.group({
      fullName: ['', Validators.required],
      phone: [''],
      terms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  goToStep(step: number): void {
    if (step === 2 && !this.step1Form.valid) return;
    if (step === 3 && !this.selectedRole) return;
    this.currentStep = step;
  }

  selectRole(role: string): void {
    this.selectedRole = role;
  }

  signInWithGoogle(): void {
    console.log('Google signup triggered');
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (!this.step3Form.valid) return;
    
    const userData = {
      ...this.step1Form.value,
      role: this.selectedRole,
      ...this.step3Form.value
    };
    
    console.log('User registered:', userData);
    this.router.navigate(['/dashboard']);
  }

  goToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}