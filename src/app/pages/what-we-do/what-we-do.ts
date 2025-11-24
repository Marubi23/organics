// what-we-do.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-what-we-do',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './what-we-do.html',
  styleUrls: ['./what-we-do.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('700ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('700ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('800ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('countUp', [
      transition('* => *', [
        animate('2000ms ease-out', keyframes([
          style({ opacity: 0, transform: 'scale(0.5)', offset: 0 }),
          style({ opacity: 0.7, transform: 'scale(1.1)', offset: 0.7 }),
          style({ opacity: 1, transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class WhatWeDoComponent {
  problems = [
    {
      number: '1',
      title: 'Poor Soil Health',
      description: 'High acidity and low humus due to degradation by farm activities, affecting productivity.'
    },
    {
      number: '2',
      title: 'Unaffordable Inputs',
      description: 'Limited access to quality farm inputs for smallholder farmers due to high costs.'
    },
    {
      number: '3',
      title: 'Resource Competition',
      description: 'Increasing competition for limited food resources between humans and domesticated animals.'
    },
    {
      number: '4',
      title: 'Inefficient Waste Management',
      description: 'Poor organic waste management at farm and market levels leading to environmental issues.'
    }
  ];
// Add to existing component class
getKenyanContext(): string {
  return "Serving Kenyan farmers with locally-adapted regenerative agricultural solutions";
}

getFocusRegions(): string[] {
  return [
    "Central Kenya Highlands",
    "Rift Valley Region", 
    "Western Kenya",
    "Coastal Region",
    "Eastern Kenya"
  ];
}
  impactStats = [
    { value: '5+ tons', label: 'Organic waste processed monthly' },
    { value: '1000L', label: 'Liquid fertilizer produced weekly' },
    { value: '1.5 tons', label: 'Solid fertilizer produced monthly' },
    { value: '60%', label: 'Savings on farm input costs' }
  ];

  outcomes = [
    'More trained farmers started BSF and worm farming',
    'Farmland regeneration in progress through product adoption',
    'Reduced dependence on chemical fertilizers',
    'Increased quantity and quality of farm yields',
    'Improved livestock health and production',
    'Job creation and steady income opportunities'
  ];

  regenFeatures = [
    {
      icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
      title: 'Farmer Training',
      description: 'Comprehensive training in insect farming, vermicomposting, and regenerative agriculture practices.'
    },
    {
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6 M16 11h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h2',
      title: 'Market Access',
      description: 'Off-taking and marketing support for farmer produce to ensure fair prices and market linkage.'
    },
    {
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      title: 'Extension Services',
      description: 'Continuous agricultural extension services and technical support for sustainable farming.'
    }
  ];

  sdgs = [
    {
      number: 1,
      title: 'No Poverty',
      description: 'Building resilience of smallholder farmers and reducing vulnerability to socio-economic shocks.'
    },
    {
      number: 2,
      title: 'Zero Hunger',
      description: 'Promoting sustainable food production systems and improving land quality.'
    },
    {
      number: 5,
      title: 'Gender Equality',
      description: 'Supporting gender-neutral economic activities and empowering women and girls.'
    },
    {
      number: 8,
      title: 'Decent Work & Economic Growth',
      description: 'Creating employment opportunities and promoting sustainable economic growth.'
    },
    {
      number: 9,
      title: 'Industry, Innovation & Infrastructure',
      description: 'Building resilient infrastructure and fostering innovative agricultural solutions.'
    },
    {
      number: 11,
      title: 'Sustainable Cities & Communities',
      description: 'Reducing environmental impact through effective organic waste management.'
    },
    {
      number: 12,
      title: 'Responsible Consumption & Production',
      description: 'Ensuring sustainable consumption patterns and effective waste management.'
    },
    {
      number: 13,
      title: 'Climate Action',
      description: 'Building capacity for climate change adaptation and mitigation in farming communities.'
    },
    {
      number: 14,
      title: 'Life Below Water',
      description: 'Reducing marine pollution from agricultural activities through sustainable practices.'
    },
    {
      number: 15,
      title: 'Life on Land',
      description: 'Restoring degraded land and promoting sustainable terrestrial ecosystems.'
    },
    {
      number: 17,
      title: 'Partnerships for the Goals',
      description: 'Strengthening global partnerships for sustainable development implementation.'
    }
  ];
}