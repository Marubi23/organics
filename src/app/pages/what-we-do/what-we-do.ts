// what-we-do.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartComponent } from '../cart/cart';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-what-we-do',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './what-we-do.html',
  styleUrls: ['./what-we-do.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('800ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class WhatWeDoComponent {
  
  // Circular model steps data
  circularSteps = [
    { number: '1', title: 'Organic Waste Collection', description: '55+ tons monthly from farms & markets' },
    { number: '2', title: 'BSF Bioconversion', description: 'Black Soldier Fly larvae processing' },
    { number: '3', title: 'Vermicomposting', description: 'Red wiggler worm processing' },
    { number: '4', title: 'Premium Products', description: 'Biofertilizers & animal feed' },
    { number: '5', title: 'Farmer Application', description: 'Improved yields & soil health' }
  ];

  // Impact metrics data
  metrics = [
    { value: '55+', label: 'Tons of organic waste processed monthly', trend: '40% growth', trendPositive: true },
    { value: '5+', label: 'Tons of solid fertilizer produced monthly', trend: '35% increase', trendPositive: true },
    { value: '1000L', label: 'Liquid fertilizer produced monthly', trend: 'Steady supply', trendPositive: true },
    { value: '40%', label: 'Savings on farm input costs', trend: 'Direct impact', trendPositive: true }
  ];

  // Partnerships data
  partnerships = [
    { name: 'KCIC', logo: '/images/kcic-logo.JPG', customClass: '' },
    { name: 'Jasiri4Africa', logo: '/images/jasiri-logo.JPG', customClass: '' },
    { name: 'Sahara Foundation', logo: '/images/saharafoundation-logo.JPG', customClass: '' },
    { name: 'WIDU', logo: '/images/widu-logo.JPG', customClass: '' },
    { name: 'Mastercard', logo: '/images/mastercard-logo.JPG', customClass: '' },
    { name: 'Heifer International', logo: '/images/heifer-logo.JPG', customClass: '' },
    { name: 'AgriJobs', logo: '/images/agri-jobs.jpg', customClass: '' },
    { name: 'GIZ', logo: '/images/giz-new-logo.jpg', customClass: '' },
    { name: 'GFA', logo: '/images/gfa-logo.JPG', customClass: '' },
    { name: 'KYEOP', logo: '/images/KYEOP-logo.jpg', customClass: '' },
    { name: 'ICIPE', logo: '/images/icipe-logo.JPG', customClass: '' },
    { name: 'AgriFrontier', logo: '/images/agrifrontier-logo.JPG', customClass: '' },
    { name: 'Afriscope', logo: '/images/afriscope-research.jpg', customClass: '' },
    { name: 'Ligare', logo: '/images/ligare-logo.jpeg', customClass: '' },
    { name: 'InsectFarm', logo: '/images/insect-farms.jpg', customClass: '' },
    { name: 'Eldoret', logo: '/images/eldoret-logo.jpeg', customClass: '' },
    { name: 'Ainabkoi Farmers', logo: '/images/ainabkoifarmers-logo.JPG', customClass: 'ainabkoi-logo' },
    { name: 'Practical Dairy', logo: '/images/practicaldairy-logo.JPG', customClass: 'practical-dairy-logo' },
    { name: 'European Union', logo: '/images/Funded by European Union.jpeg', customClass: '' },
    { name: 'Food Safety', logo: '/images/food-safety.jpeg', customClass: 'food-safety-logo' }
  ];

  constructor() { }
}