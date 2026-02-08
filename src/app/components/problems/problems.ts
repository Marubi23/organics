// problems.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  stagger, 
  query,
  keyframes
} from '@angular/animations';

@Component({
  selector: 'app-problems',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './problems.html',
  styleUrls: ['./problems.css'],
  animations: [
    // Page entrance animation
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('800ms ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Stagger animation for cards
    trigger('staggerAnimation', [
      transition(':enter', [
        query('.problem-card', [
          style({ opacity: 0, transform: 'translateY(40px) scale(0.95)' }),
          stagger('150ms', [
            animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
              style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Float animation for cards
    trigger('floatAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('500ms ease-out', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),

    // Pulse animation for center node
    trigger('pulseAnimation', [
      transition(':enter', [
        style({ transform: 'translate(-50%, -50%) scale(0)' }),
        animate('500ms 300ms ease-out', 
          style({ transform: 'translate(-50%, -50%) scale(1)' }))
      ])
    ])
  ]
})
export class ProblemsComponent implements OnInit {
  problems = [
    {
      id: 1,
      title: 'Declining Soil Fertility & Overdependence on Synthetic Fertilizers',
      category: 'critical',
 
      impacts: [
        'Farmers rely heavily on costly synthetic fertilizers (CAN, Urea, DAP) with diminishing returns',
        'Results in nutrient imbalance, acidification, and reduced yields',
        'Almost no localized, science-guided blending that matches real soil needs'
      ],
      solution: 'PREFarm Precision Soil Management with customized organic-mineral blends and soil testing'
    }
  ];

  connectionLinks = [
    { rotation: '0', label: 'Leads to' },
    { rotation: '51', label: 'Causes' },
    { rotation: '102', label: 'Results in' },
    { rotation: '153', label: 'Creates' },
    { rotation: '204', label: 'Exacerbates' },
    { rotation: '255', label: 'Forces' },
    { rotation: '306', label: 'Increases' }
  ];

  connectionNodes = [
    { 
      angle: '0', 
      title: 'Chemical Dependence', 
      description: 'More pesticides & fertilizers',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`
    },
    { 
      angle: '51', 
      title: 'Lower Yields', 
      description: 'Reduced productivity',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
    },
    { 
      angle: '102', 
      title: 'Farmer Poverty', 
      description: 'Income instability',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`
    },
    { 
      angle: '153', 
      title: 'Waste Mismanagement', 
      description: 'Lost resources',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`
    },
    { 
      angle: '204', 
      title: 'Climate Vulnerability', 
      description: 'Reduced resilience',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
    },
    { 
      angle: '255', 
      title: 'Food Insecurity', 
      description: 'Nutritional gaps',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
    },
    { 
      angle: '306', 
      title: 'Health Risks', 
      description: 'Chemical exposure',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/></svg>`
    }
  ];

  solutionMatrix = [
    {
      index: 1,
      problem: 'Soil Degradation',
      description: 'Depleted organic matter',
      cause: 'Synthetic fertilizer overuse',
      solution: 'PREFarm Precision Blends',
      impact: '60% input cost savings'
    },
    {
      index: 2,
      problem: 'Waste Pollution',
      description: 'Biomass burning/dumping',
      cause: 'No value chain for waste',
      solution: 'Circular Biofertilizer Production',
      impact: '5+ tons waste processed monthly'
    },
    {
      index: 3,
      problem: 'Farmer Poverty',
      description: 'Limited income streams',
      cause: 'No waste-to-value models',
      solution: 'Regen-Kilimo Circular Model',
      impact: 'New income from waste'
    },
    {
      index: 4,
      problem: 'Chemical Dependence',
      description: 'High pesticide use',
      cause: 'Soil lacks resilience',
      solution: 'Microbial-rich Biofertilizers',
      impact: 'Reduced spraying by 40%'
    }
  ];

  ctaStats = [
    { value: '7', label: 'Core Problems Addressed' },
    { value: '8+', label: 'Innovative Solutions' },
    { value: '1000+', label: 'Farmers Impacted' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Component initialization
  }

  getCategoryClass(category: string): string {
    switch(category) {
      case 'critical': return 'critical';
      case 'environmental': return 'environmental';
      case 'access': return 'access';
      case 'economic': return 'economic';
      case 'knowledge': return 'knowledge';
      case 'health': return 'health';
      case 'climate': return 'climate';
      default: return '';
    }
  }

  getCategoryBadge(category: string): string {
    switch(category) {
      case 'critical': return 'Critical Issue';
      case 'environmental': return 'Environmental';
      case 'access': return 'Access Issue';
      case 'economic': return 'Economic';
      case 'knowledge': return 'Knowledge Gap';
      case 'health': return 'Health & Safety';
      case 'climate': return 'Climate Crisis';
      default: return '';
    }
  }
}