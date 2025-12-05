// about.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  stagger, 
  query
} from '@angular/animations';

interface Problem {
  title: string;
  description: string;
  icon: string;
}

interface Solution {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: string;
}

interface Impact {
  title: string;
  description: string;
  icon: string;
}

interface Outcome {
  description: string;
  icon: string;
}

interface SDG {
  number: string;
  title: string;
  description: string;
  icon: string;
}

interface Product {
  title: string;
  description: string;
  type: string;
  icon: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('800ms ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition(':enter', [
        query('.problem-card, .solution-card, .product-card', [
          style({ opacity: 0, transform: 'translateY(40px) scale(0.95)' }),
          stagger('100ms', [
            animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
              style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AboutComponent implements OnInit {
  // Mission & Vision - Updated to match new content
  mission = {
    title: 'Our Mission',
    description: 'To build smallholder farmers\' resilience to climate change through regenerative agricultural practices.'
  };

  vision = {
    title: 'Our Vision', 
    description: 'To create a world where smallholder farmers are empowered to thrive through sustainable regenerative agriculture that enables them to produce healthy crops, increase income, and protect the environment, building a resilient food system for generations to come.'
  };

  // Updated Problems based on the 7 core challenges
  problems: Problem[] = [
    {
      title: 'Declining Soil Fertility & Chemical Dependence',
      description: 'Kenyan soils severely depleted of organic matter. Farmers rely on costly synthetic fertilizers with diminishing returns, leading to nutrient imbalance and reduced yields.',
      icon: 'soil'
    },
    {
      title: 'Organic Waste Mismanagement',
      description: 'Household, market, and farm waste poorly managed. Valuable biomass burned or dumped, contributing to pollution and climate risks.',
      icon: 'waste'
    },
    {
      title: 'Lack of Accessible Regenerative Inputs', 
      description: 'Smallholders cannot access microbe-rich fertilizers, soil tests, or precision dosing tools. Available organic fertilizers are inconsistent and poor quality.',
      icon: 'access'
    },
    {
      title: 'Farmer Poverty & Missing Income Streams',
      description: 'Farmers earn nothing from waste streams. Youth lack dignified income opportunities in circular bioeconomy. No guaranteed buy-back pathways.',
      icon: 'poverty'
    },
    {
      title: 'Limited Knowledge on Regenerative Agriculture',
      description: 'Most farmers unaware of biological soil restoration and composting techniques. Training and extension services are fragmented.',
      icon: 'knowledge'
    },
    {
      title: 'Pesticide Dependence & Food Safety Risks',
      description: 'Chemical pesticide use dangerously high and poorly regulated. Soils lack biological resilience, forcing more spraying. Communities face health risks.',
      icon: 'safety'
    },
    {
      title: 'Climate Vulnerability',
      description: 'Degraded soils worsen drought and crop failure. Farmers lack climate-resilient models integrating waste reuse and biological fertilizers.',
      icon: 'climate'
    }
  ];

  // Updated Solutions - 8 innovative solutions
  solutions: Solution[] = [
    {
      title: 'Circular Biofertilizer Production',
      subtitle: 'Transforming waste into high-value regenerative fertilizers',
      description: 'Using BSF bioconversion, vermicomposting, and microbial-rich composting to create premium biofertilizers including Vermi-Frass, BioVeg, BioFruity blends, and liquid frass concentrates.',
      features: [
        'Vermi-Frass (microbe-rich biofertilizer)',
        'BioVeg and BioFruity precision blends',
        'Liquid frass concentrates (3.5% N)',
        'Insect protein-based animal feed'
      ],
      icon: 'bioconversion'
    },
    {
      title: 'PREFarm Precision Soil Management',
      subtitle: 'Science-guided soil regeneration',
      description: 'One of Kenya\'s most innovative models integrating organics + mineral fertilizers with instant soil testing, localized blending centers, and precision dosing.',
      features: [
        'Instant and wet-lab soil testing',
        'Localized blending centers',
        'Precision dosing recommendations',
        'Pre-farm soil regeneration'
      ],
      icon: 'precision'
    },
    {
      title: 'Regen-Kilimo Circular Economy Model',
      subtitle: 'Community empowerment system',
      description: 'Unique model where youth, women, and farmers produce vermicompost, we buy back at guaranteed prices, and process into premium fertilizers sold back to communities.',
      features: [
        'Guaranteed buy-back system',
        'New income streams from waste',
        'Soil restoration and reduced chemicals',
        'Community-led circular economy'
      ],
      icon: 'circular'
    },
    {
      title: 'Easy Drop Urban Circularity',
      subtitle: 'Compact domestic food systems',
      description: 'Turns small urban spaces into self-sustaining food production systems combining kitchen waste conversion, tower gardens, and BSFL chicken feed production.',
      features: [
        'Kitchen waste → BSF → fertilizer',
        'Tower gardens with drip irrigation',
        'Leafy greens & strawberries',
        'BSFL as chicken feed'
      ],
      icon: 'urban'
    },
    {
      title: 'Integrated Post-Harvest Systems',
      subtitle: 'Market-level circular innovation',
      description: 'Developing systems for fresh food markets combining solar cold rooms, composting units, waste-to-fertilizer conversion, and value addition.',
      features: [
        'Solar-powered cold rooms',
        'Onsite waste-to-fertilizer',
        'Surplus produce recovery',
        'Value addition (avocado oil press)'
      ],
      icon: 'postharvest'
    },
    {
      title: 'Youth BSF & Vermicomposting Enterprises',
      subtitle: 'Scalable micro-enterprise model',
      description: 'Training youth groups, setting up decentralized production hubs, and creating micro-enterprises within Kenya\'s circular bioeconomy.',
      features: [
        'Youth training and capacity building',
        'Decentralized production hubs',
        'Micro-enterprise creation',
        'Buy-back markets and mentoring'
      ],
      icon: 'youth'
    },
    {
      title: 'i-Regen Institutional Model',
      subtitle: 'Cooperatives and SACCOs partnership',
      description: 'Working through cooperatives and SACCOs to mobilize farmers into circular waste-to-value practices with complete buy-back and processing.',
      features: [
        'Cooperatives and SACCOs partnership',
        'Complete waste-to-value system',
        'Premium biofertilizer production',
        'Affordable blends for communities'
      ],
      icon: 'institutional'
    },
    {
      title: 'Avocado Oil Pressing & Circular Utilization',
      subtitle: '100% upcycling of by-products',
      description: 'Cold-extracting premium avocado oil while fully upcycling all by-products through BSF and vermicomposting systems.',
      features: [
        'Premium avocado oil extraction',
        '100% upcycling of by-products',
        'Additional farmer income',
        'Strengthened circular bioeconomy'
      ],
      icon: 'avocado'
    }
  ];

  // Updated Products
  products: Product[] = [
    {
      title: 'Compost-based Biofertilizers',
      description: 'Superior 100% organic fertilizers rich in macro and micro nutrients with living microbes that enhance plant nutrition.',
      type: 'biofertilizer',
      icon: 'fertilizer'
    },
    {
      title: 'NPK ActivePlus',
      description: 'Precision-engineered organo-mineral fertilizer blending living organic biology with targeted mineral nutrition for fast, balanced nutrients.',
      type: 'blended',
      icon: 'npk'
    },
    {
      title: 'Insect-based Protein Feeds',
      description: 'High-protein animal feed containing up to 50% protein and 35% fat with amino acid profile comparable to fish meal.',
      type: 'animal-feed',
      icon: 'protein'
    }
  ];

  // Updated Impacts
  impacts: Impact[] = [
    {
      title: 'Soil Health Restoration',
      description: 'Regenerating depleted soils by returning living microbes, organic matter, and balanced nutrients; improving structure and fertility.',
      icon: 'soil-restore'
    },
    {
      title: 'Reduced Chemical Dependence', 
      description: 'Helping farmers cut pesticide and synthetic fertilizer use by up to 80%, improving food safety and environmental health.',
      icon: 'chemical-reduce'
    },
    {
      title: 'Circular Waste Management',
      description: 'Transforming household, market, and farm waste into valuable inputs while creating new income streams.',
      icon: 'waste-manage'
    },
    {
      title: 'Economic Empowerment',
      description: 'Creating consistent income for farmers, youth, and women through guaranteed buy-back systems and waste-to-value enterprises.',
      icon: 'empowerment'
    }
  ];

  // Updated Outcomes based on measurable outcomes
  outcomes: Outcome[] = [
    { description: '55+ tons of organic waste processed monthly', icon: 'waste' },
    { description: '1000+ liters of liquid fertilizer produced monthly', icon: 'liquid' },
    { description: '5+ tons of solid fertilizer produced monthly', icon: 'solid' },
    { description: '40%+ savings on farm input costs', icon: 'savings' },
    { description: '60% increase in farm yields', icon: 'yield' },
    { description: 'Reduced livestock mortality and accelerated growth', icon: 'livestock' }
  ];

  // Updated SDGs
  sdgs: SDG[] = [
    {
      number: '2',
      title: 'Zero Hunger',
      description: 'Boosting food security by regenerating soils, increasing yields, and improving crop nutrition through biological fertilizers.',
      icon: 'hunger'
    },
    {
      number: '12', 
      title: 'Responsible Consumption & Production',
      description: 'Transforming organic waste into high-value fertilizers and creating circular, zero-waste farming systems.',
      icon: 'consumption'
    },
    {
      number: '13',
      title: 'Climate Action',
      description: 'Reducing emissions, enhancing soil carbon, and building climate-resilient farms through regenerative agriculture.',
      icon: 'climate'
    },
    {
      number: '15',
      title: 'Life on Land',
      description: 'Restoring degraded soils, improving biodiversity, and strengthening ecosystem health with microbe-rich inputs.',
      icon: 'land'
    },
    {
      number: '1',
      title: 'No Poverty',
      description: 'Creating new income streams for farmers, youth, and women through buy-back models and waste-to-value enterprises.',
      icon: 'poverty'
    },
    {
      number: '8',
      title: 'Decent Work & Economic Growth',
      description: 'Driving green job creation across regenerative farming, composting, bioconversion, and biofertilizer production.',
      icon: 'work'
    }
  ];

  contactInfo = {
    phone: '+254 701 934 918',
    email: 'info@mzuriorganics.co.ke'
  };

  // Navigation active state
  activeSection: string = 'home';
  isScrolled: boolean = false;

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  // Smooth scroll function
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      this.activeSection = sectionId;
    }
  }

  // Track active section while scrolling
  setupIntersectionObserver(): void {
    const sections = document.querySelectorAll('[id]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, { 
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0.1
    });

    sections.forEach(section => {
      if (section.id) {
        observer.observe(section);
      }
    });
  }

  // Handle scroll events for navigation styling
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 100;
  }

  // Method to get SVG icon based on type
  getIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'soil': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      'waste': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
      'access': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      'poverty': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
      'knowledge': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
      'safety': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
      'climate': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      'bioconversion': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>`,
      'precision': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6V12L16 14"/><path d="M12 12L9 9"/></svg>`,
      'circular': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 7L12 12L21 7L12 2Z"/><path d="M3 17L12 22L21 17"/><path d="M3 12L12 17L21 12"/><path d="M12 2V12"/><path d="M12 12V22"/></svg>`,
      'urban': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      'postharvest': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M21 14v7"/><path d="M12 14v7"/><path d="M7 14v7"/></svg>`,
      'youth': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      'institutional': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      'avocado': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
      'soil-restore': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>`,
      'chemical-reduce': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,
      'waste-manage': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
      'empowerment': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      'liquid': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 7H7C4.79086 7 3 8.79086 3 11V11C3 13.2091 4.79086 15 7 15H17C19.2091 15 21 13.2091 21 11V11C21 8.79086 19.2091 7 17 7Z"/><path d="M7 15V18C7 19.6569 8.34315 21 10 21H14C15.6569 21 17 19.6569 17 18V15"/><path d="M12 3V7"/></svg>`,
      'solid': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"/><path d="M14 2V8H20"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>`,
      'savings': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"/></svg>`,
      'yield': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>`,
      'livestock': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
      'hunger': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>`,
      'consumption': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>`,
      'land': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>`,
      'work': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
    };
    return icons[type] || `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
  }
}