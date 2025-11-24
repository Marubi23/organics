// about.component.ts
import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  styleUrls: ['./about.css']
})
export class AboutComponent implements OnInit {
  // Mission & Vision
  mission = {
    title: 'Our Mission',
    description: 'To build smallholder farmers\' resilience to climate change through the promotion of regenerative agricultural practices.'
  };

  vision = {
    title: 'Our Vision', 
    description: 'To create a world where smallholder farmers are empowered to thrive in the face of climate change. We strive to promote sustainable regenerative agricultural practices that enable farmers to produce healthy crops, increase their income, and protect the environment. Our goal is to build a resilient food system that supports the well-being of farmers, communities, and the planet for generations to come.'
  };

  // Problems
  problems: Problem[] = [
    {
      title: 'Poor Soil Health',
      description: 'High acidity and low humus due to degradation by farm related activities, affecting productivity.',
      icon: 'soil-health'
    },
    {
      title: 'Unaffordable Inputs',
      description: 'Limited access to quality farm inputs for smallholder farmers.',
      icon: 'cost'
    },
    {
      title: 'Resource Competition', 
      description: 'Increasing competition for limited food resources between humans and domesticated animals.',
      icon: 'resources'
    },
    {
      title: 'Waste Management',
      description: 'Inefficient organic waste management at farm and market levels.',
      icon: 'waste'
    }
  ];

  // Solutions
  solutions: Solution[] = [
    {
      title: 'Bioconversion Initiative',
      subtitle: 'Sustainable Waste Management & Soil Regeneration',
      description: 'Leveraging Black Soldier Fly Larvae and red worms to convert organic waste into nutrient-rich biofertilizers while producing high-value insect protein for animal feed.',
      features: [
        'Sustainable waste management',
        'Soil health regeneration', 
        'High-value protein production',
        'Circular economy approach'
      ],
      icon: 'bioconversion'
    },
    {
      title: 'PREFarm Initiative',
      subtitle: 'Precision Dosing for Enhanced Productivity',
      description: 'Data-driven precision dosing technology that optimizes fertilizer use, reduces input costs, and maximizes yields while protecting the environment.',
      features: [
        'Optimized input usage',
        'Real-time data analytics',
        'Environmental protection',
        'Cost reduction'
      ],
      icon: 'precision'
    },
    {
      title: 'Regen-Kilimo Initiative',
      subtitle: 'Farmer Empowerment & Market Access',
      description: 'Comprehensive training programs in regenerative agriculture, vermicomposting, and market linkages for sustainable livelihoods.',
      features: [
        'Farmer training & capacity building',
        'Market access & off-taking',
        'Crop diversification',
        'Agricultural extension services'
      ],
      icon: 'empowerment'
    }
  ];

  // Products & Services
  products: Product[] = [
    {
      title: 'Organic Biofertilizers',
      description: 'Superior 100% organic fertilizers rich in macro and micro nutrients including Nitrogen, Potassium, Phosphorus, Magnesium, Calcium, Sulphur, Iron, and Manganese. Contains living microbes that enhance plant nutrition.',
      type: 'liquid-solid',
      icon: 'fertilizer'
    },
    {
      title: 'Insect-Based Protein Feeds',
      description: 'High-protein animal feed containing up to 50% protein and 35% fat with amino acid profile comparable to fish meal. Excellent for poultry, fish, pigs, and pet food.',
      type: 'animal-feed',
      icon: 'protein'
    }
  ];
  

  // Impact & Outcomes
  impacts: Impact[] = [
    {
      title: 'Increased Land Productivity',
      description: 'Farmland regeneration through reintroduction of beneficial microorganisms and humus into soil ecosystems.',
      icon: 'productivity'
    },
    {
      title: 'Improved Livelihoods', 
      description: 'Lower farming costs and better yields leading to improved standards of living for smallholder farmers.',
      icon: 'livelihoods'
    },
    {
      title: 'Environmental Benefits',
      description: 'Cleaner environment and reduced GHG emissions through efficient organic waste management.',
      icon: 'environment'
    }
  ];

  outcomes: Outcome[] = [
    { description: '5+ tons of organic waste processed monthly', icon: 'waste-processing' },
    { description: '1000+ liters of liquid fertilizer produced weekly', icon: 'liquid-production' },
    { description: '1.5+ tons of solid fertilizer produced monthly', icon: 'solid-production' },
    { description: '60% savings on farm input costs', icon: 'savings' },
    { description: 'Increased quantity and quality of farm yields', icon: 'yield' },
    { description: 'Reduced livestock mortality and improved growth', icon: 'livestock' }
  ];

  // SDGs
  sdgs: SDG[] = [
    {
      number: '1',
      title: 'No Poverty',
      description: 'Building farmer resilience and reducing vulnerability through soil regeneration and cost reduction.',
      icon: 'poverty'
    },
    {
      number: '2', 
      title: 'Zero Hunger',
      description: 'Sustainable food production systems that increase productivity and improve land quality.',
      icon: 'hunger'
    },
    {
      number: '5',
      title: 'Gender Equality',
      description: 'Gender-neutral economic activities empowering women and girls in agriculture.',
      icon: 'equality'
    },
    {
      number: '8',
      title: 'Decent Work',
      description: 'Creating sustainable employment opportunities for youth and women.',
      icon: 'work'
    },
    {
      number: '12',
      title: 'Responsible Consumption',
      description: 'Circular economy practices for effective organic waste management.',
      icon: 'consumption'
    },
    {
      number: '13',
      title: 'Climate Action',
      description: 'Climate-resilient agriculture with reduced environmental impact.',
      icon: 'climate'
    },
    {
      number: '15',
      title: 'Life on Land',
      description: 'Restoration of degraded land and soil for sustainable agriculture.',
      icon: 'land'
    }
  ];

  contactInfo = {
    phone: '+254 701 934 918',
    email: 'info@mzuriorganics.co.ke'
  };

  // Navigation active state
  activeSection: string = 'home';
  isScrolled: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  // Smooth scroll function
  scrollToSection(sectionId: string): void {
    const element = this.document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Adjust based on your navigation height
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
    const sections = this.document.querySelectorAll('[id]');
    
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
      // Problem icons
      'soil-health': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'cost': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2V22" stroke="currentColor" stroke-width="2"/>
          <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'resources': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M8 21H16" stroke="currentColor" stroke-width="2"/>
          <path d="M12 17V21" stroke="currentColor" stroke-width="2"/>
          <path d="M7 13H17C18.1046 13 19 12.1046 19 11V7C19 5.89543 18.1046 5 17 5H7C5.89543 5 5 5.89543 5 7V11C5 12.1046 5.89543 13 7 13Z" stroke="currentColor" stroke-width="2"/>
          <path d="M7 5L12 1L17 5" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'waste': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M3 6H21" stroke="currentColor" stroke-width="2"/>
          <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6" stroke="currentColor" stroke-width="2"/>
          <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      // Solution icons
      'bioconversion': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'precision': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2"/>
          <path d="M12 12L9 9" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'empowerment': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M3 17L12 22L21 17" stroke="currentColor" stroke-width="2"/>
          <path d="M3 12L12 17L21 12" stroke="currentColor" stroke-width="2"/>
          <path d="M12 2V12" stroke="currentColor" stroke-width="2"/>
          <path d="M12 12V22" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      // Product icons
      'fertilizer': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M17 7H7C4.79086 7 3 8.79086 3 11V11C3 13.2091 4.79086 15 7 15H17C19.2091 15 21 13.2091 21 11V11C21 8.79086 19.2091 7 17 7Z" stroke="currentColor" stroke-width="2"/>
          <path d="M7 15V18C7 19.6569 8.34315 21 10 21H14C15.6569 21 17 19.6569 17 18V15" stroke="currentColor" stroke-width="2"/>
          <path d="M12 3V7" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'protein': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      // Impact icons
      'productivity': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M14 2V8H20" stroke="currentColor" stroke-width="2"/>
          <path d="M16 13H8" stroke="currentColor" stroke-width="2"/>
          <path d="M16 17H8" stroke="currentColor" stroke-width="2"/>
          <path d="M10 9H8" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'livelihoods': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2"/>
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'environment': `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M7 16.3C7 16.3 8.5 15 12 15C15.5 15 17 16.3 17 16.3" stroke="currentColor" stroke-width="2"/>
          <path d="M12 19C15.5 19 17 20.3 17 20.3" stroke="currentColor" stroke-width="2"/>
          <path d="M12 23C15.5 23 17 24.3 17 24.3" stroke="currentColor" stroke-width="2"/>
          <path d="M7 20.3C7 20.3 8.5 19 12 19" stroke="currentColor" stroke-width="2"/>
          <path d="M7 24.3C7 24.3 8.5 23 12 23" stroke="currentColor" stroke-width="2"/>
          <path d="M12 15V19" stroke="currentColor" stroke-width="2"/>
          <path d="M12 19V23" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      // Outcome icons
      'waste-processing': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M3 6H21" stroke="currentColor" stroke-width="2"/>
          <path d="M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6" stroke="currentColor" stroke-width="2"/>
          <path d="M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'liquid-production': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M17 7H7C4.79086 7 3 8.79086 3 11V11C3 13.2091 4.79086 15 7 15H17C19.2091 15 21 13.2091 21 11V11C21 8.79086 19.2091 7 17 7Z" stroke="currentColor" stroke-width="2"/>
          <path d="M7 15V18C7 19.6569 8.34315 21 10 21H14C15.6569 21 17 19.6569 17 18V15" stroke="currentColor" stroke-width="2"/>
          <path d="M12 3V7" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'solid-production': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M14 2V8H20" stroke="currentColor" stroke-width="2"/>
          <path d="M16 13H8" stroke="currentColor" stroke-width="2"/>
          <path d="M16 17H8" stroke="currentColor" stroke-width="2"/>
          <path d="M10 9H8" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'savings': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2V22" stroke="currentColor" stroke-width="2"/>
          <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'yield': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'livestock': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" stroke-width="2"/>
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      // SDG icons (simplified versions)
      'poverty': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
          <path d="M8 12H16" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8V16" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'hunger': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'equality': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
          <path d="M8 12H16" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'work': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2"/>
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'consumption': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'climate': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M18 10H16C16 6.68629 13.3137 4 10 4C6.68629 4 4 6.68629 4 10C4 13.3137 6.68629 16 10 16H18C20.2091 16 22 14.2091 22 12C22 9.79086 20.2091 8 18 8Z" stroke="currentColor" stroke-width="2"/>
          <path d="M10 16V20" stroke="currentColor" stroke-width="2"/>
          <path d="M10 20H14" stroke="currentColor" stroke-width="2"/>
        </svg>
      `,
      'land': `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
        </svg>
      `
    };
    return icons[type] || '';
  }
}