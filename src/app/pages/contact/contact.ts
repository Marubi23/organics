// contact.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  newsletterForm: FormGroup;
  isSubmitting = false;
  newsletterSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['general'],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      console.log('Contact form submitted:', this.contactForm.value);
      
      // Simulate API call
      setTimeout(() => {
        alert('Thank you for your message! We will get back to you within 24 hours.');
        this.contactForm.reset();
        this.isSubmitting = false;
      }, 1000);
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  onNewsletterSubmit() {
    if (this.newsletterForm.valid) {
      this.newsletterSubmitted = true;
      console.log('Newsletter subscription:', this.newsletterForm.value.email);
      
      setTimeout(() => {
        this.newsletterForm.reset();
        this.newsletterSubmitted = false;
      }, 3000);
    }
  }
}