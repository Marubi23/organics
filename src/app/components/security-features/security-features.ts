// src/app/components/security-features/security-features.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-security-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './security-features.html',
  styleUrls: ['./security-features.css']
})
export class SecurityFeaturesComponent implements OnInit {
  securityFeatures = [
    {
      icon: 'fas fa-lock',
      title: '256-Bit SSL Encryption',
      description: 'Your payment information is secured with bank-level encryption technology.',
      color: '#28a745'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'PCI DSS Compliant',
      description: 'We adhere to the highest security standards for payment processing.',
      color: '#1a7f27'
    },
    {
      icon: 'fas fa-user-shield',
      title: 'Verified by Safaricom',
      description: 'Direct integration with M-Pesa secure payment gateway.',
      color: '#17a2b8'
    },
    {
      icon: 'fas fa-fingerprint',
      title: 'Two-Factor Authentication',
      description: 'Additional security layer for account protection.',
      color: '#ffc107'
    },
    {
      icon: 'fas fa-history',
      title: 'Transaction Monitoring',
      description: '24/7 monitoring for suspicious activities.',
      color: '#6c757d'
    },
    {
      icon: 'fas fa-file-contract',
      title: 'Secure Data Handling',
      description: 'Your data is never shared with third parties.',
      color: '#6610f2'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Component initialization
  }
}