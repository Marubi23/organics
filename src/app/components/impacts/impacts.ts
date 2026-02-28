// impact.component.ts
import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-impact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './impacts.html',
  styleUrls: ['./impacts.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('700ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
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
    ])
  ]
})
export class ImpactComponent implements AfterViewInit {
  // Scroll targets for the dropdown
  scrollTargets = [
    { id: 'overview', label: 'Impact Overview' },
    { id: 'metrics', label: 'Key Metrics' },
    { id: 'outcomes', label: 'Outcomes & Results' },
    { id: 'sdg', label: 'SDG Impact' },
    { id: 'stories', label: 'Success Stories' },
    { id: 'environmental', label: 'Environmental Impact' },
    { id: 'goals', label: 'Future Goals' },
    { id: 'cta', label: 'Get Involved' }
  ];

  // Default selected target
  selectedScrollTarget = this.scrollTargets[0];

  keyMetrics = [
    { value: '500+', label: 'Kenyan Farmers Trained', change: '+25%', trend: 'positive' },
    { value: '60%', label: 'Reduction in Chemical Fertilizer Use in Kenya', change: '+15%', trend: 'positive' },
    { value: '5 Tons', label: 'Kenyan Organic Waste Processed Monthly', change: '+40%', trend: 'positive' },
    { value: '45%', label: 'Increase in Kenyan Crop Yields', change: '+12%', trend: 'positive' },
    { value: '80%', label: 'Kenyan Farmer Income Growth', change: '+20%', trend: 'positive' },
    { value: '1000L', label: 'Liquid Fertilizer Monthly Production in Kenya', change: '+30%', trend: 'positive' }
  ];

  outcomeCategories = [
    {
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
      title: 'Kenyan Agricultural Productivity',
      outcomes: [
        '45% average increase in crop yields across Kenyan farms',
        '60% reduction in chemical fertilizer dependency in Kenya',
        'Improved Kenyan soil health and fertility in 95% of participating farms',
        'Extended growing seasons through climate-resilient practices in Kenya'
      ]
    },
    {
      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z',
      title: 'Kenyan Economic Empowerment',
      outcomes: [
        '60% average increase in Kenyan farmer household income',
        'Creation of 50+ local jobs in Kenyan bioconversion facilities',
        '40% savings on farm input costs for Kenyan farmers',
        'Development of new market linkages for Kenyan organic produce'
      ]
    },
    {
      icon: 'M12 2s8 4 8 10-8 10-8 10-8-4-8-10 8-10 8-10z M12 6v4l2 2',
      title: 'Kenyan Environmental Sustainability',
      outcomes: [
        '55+ tons of Kenyan organic waste diverted from landfills monthly',
        'Significant reduction in chemical runoff in Kenyan water systems',
        'Enhanced biodiversity through regenerative practices in Kenya',
        'Carbon sequestration through improved Kenyan soil management'
      ]
    },
    {
      icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1',
      title: 'Kenyan Knowledge & Capacity Building',
      outcomes: [
        '2500+ Kenyan farmers trained in regenerative agriculture',
        'Establishment of farmer field schools in 3 Kenyan counties',
        'Peer-to-peer knowledge sharing networks across Kenya'
      ]
    }
  ];

  sdgImpacts = [
    { number: 1, title: 'No Poverty', impact: 'Creating new income streams for farmers, youth, and women through buy-back models and waste-to-value enterprises.' },
    { number: 2, title: 'Zero Hunger', impact: 'Boosting food security by regenerating soils, increasing yields, and improving crop nutrition through biological and organo-mineral fertilizers.' },
    { number: 5, title: 'Gender Equality', impact: 'Equal participation of Kenyan women in farming initiatives' },
    { number: 8, title: 'Decent Work & Economic Growth', impact: 'Driving green job creation across regenerative farming, composting, bioconversion, and biofertilizer production' },
    { number: 12, title: 'Responsible Consumption & Production', impact: 'Transforming organic waste into high-value fertilizers and creating circular, zero-waste farming systems' },
    { number: 13, title: 'Climate Action', impact: 'Reducing emissions, enhancing soil carbon, and building climate-resilient farms through regenerative agriculture' },
    { number: 15, title: 'Life on Land', impact: 'Restoring degraded soils, improving biodiversity, and strengthening ecosystem health with microbe-rich inputs.' }
  ];

  successStories = [
    {
      farmer: 'Vivian Nekesa',
      location: 'Kakamega County',
      quote: 'Mzuri Organics transformed my  farm from struggling to thriving. My maize yields increased by 60% using their organic fertilizers made in Kenya.',
      results: [
        { value: '60%', label: 'Yield Increase' },
        { value: '50%', label: 'Cost Savings' },
        { value: '2x', label: 'Income Growth' }
      ]
    },
    {
      farmer: 'Sabina Kwamboka',
      location: 'Kisii County',
      quote: 'The  training in vermicomposting changed everything. I now produce my own fertilizer and even sell surplus to neighbors across the border.',
      results: [
        { value: '100%', label: 'Organic Inputs' },
        { value: '3', label: 'Kenyan Jobs Created' },
        { value: '75%', label: 'Waste Reduced' }
      ]
    },
    {
      farmer: 'Janet Khasiani',
      location: 'Vihiga County',
      quote: 'As a  woman farmer, the support from Mzuri Organics helped me become a leader in my community. I now train other  farmers.',
      results: [
        { value: '30', label: 'Farmers Trained' },
        { value: '90%', label: 'Income Increase' },
        { value: 'Community', label: 'Leader in Kenya' }
      ]
    },

  ];

  environmentalImpacts = [
    {
      icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
      title: 'Kenyan Waste Reduction',
      description: 'Kenyan organic waste converted into valuable resources locally',
      value: '55+ Tons/Month'
    },
    {
      icon: 'M12 2s8 4 8 10-8 10-8 10-8-4-8-10 8-10 8-10z M12 6v4l2 2',
      title: 'Chemical Reduction in Kenya',
      description: 'Decreased use of synthetic fertilizers in Kenyan agriculture',
      value: '60% Less Chemicals'
    },
    {
      icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1',
      title: 'Kenyan Soil Health',
      description: 'Improved Kenyan soil organic matter and fertility',
      value: '70% More Productive'
    },
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: 'Carbon Sequestration in Kenya',
      description: 'Carbon reduced due through BSF and Redworm organic waste bioconversion and valorization',
      value: '360 Tons CO₂/Year'
    }
  ];

  futureGoals = [
    {
      year: '2024',
      title: 'Kenyan Regional Expansion',
      description: 'Expand operations to 3 new Kenyan counties and establish regional training centers across East Africa',
      metrics: [
        { target: '1,000+', label: 'New Kenyan Farmers' },
        { target: '5', label: 'New Kenyan Counties' },
        { target: '10 Tons', label: 'Monthly Kenyan Capacity' }
      ]
    },
    {
      year: '2025',
      title: 'Kenyan Technology Integration',
      description: 'Implement digital farming solutions and precision agriculture technologies for Kenyan farmers',
      metrics: [
        { target: '80%', label: 'Kenyan Digital Adoption' },
        { target: '2x', label: 'Kenyan Efficiency Gain' },
        { target: '50%', label: 'Kenyan Yield Increase' }
      ]
    },
    {
      year: '2026',
      title: 'Kenyan National Scale',
      description: 'Establish nationwide Kenyan presence and influence East African agricultural policy',
      metrics: [
        { target: '10,000', label: 'Kenyan Farmers Reached' },
        { target: '15', label: 'Kenyan Counties Covered' },
        { target: '100 Tons', label: 'Annual Kenyan Impact' }
      ]
    }
  ];

  // Scroll function
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      // Update selected target
      const target = this.scrollTargets.find(t => t.id === sectionId);
      if (target) {
        this.selectedScrollTarget = target;
      }
      
      // Smooth scroll
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
      
      // Update URL hash
      window.history.replaceState(null, '', `#${sectionId}`);
    }
  }

ngAfterViewInit(): void {
  const hash = window.location.hash.substring(1);
  if (hash && this.scrollTargets.some(t => t.id === hash)) {
    setTimeout(() => {
      this.scrollToSection(hash);
    }, 300);
  }
  
  // Listen for scroll events from navigation header
  window.addEventListener('scrollToImpactSection', (event: any) => {
    const sectionId = event.detail.sectionId;
    this.scrollToSection(sectionId);
  });
}

// Add ngOnDestroy to clean up event listener
ngOnDestroy(): void {
  window.removeEventListener('scrollToImpactSection', () => {});
}
  

  getKenyanImpactContext(): string {
    return "All impact data verified across Kenyan farming communities and East African regions";
  }

  getKenyanRegionsServed(): string[] {
    return [
      "Central Kenya Highlands",
      "Rift Valley Region", 
      "Western Kenya",
      "Nyanza Region",
      "Eastern Kenya",
      "Coastal Region"
    ];
  }

  getKenyanPartners(): string[] {
    return [
      "Kenya Agricultural Research Institute",
      "County Governments of Kenya",
      "Local Farmer Cooperatives",
      "Kenya Climate Smart Agriculture Project"
    ];
  }
}