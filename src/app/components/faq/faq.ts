import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
  category: 'about' | 'products' | 'application' | 'performance' | 'safety' | 'sustainability' | 'buying' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  tags: string[];
  helpfulCount: number;
  yesVotes: number;
  noVotes: number;
  userVote?: 'yes' | 'no';
  answeredBy?: string;
  updatedDate?: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  questions: FAQQuestion[];
}

interface StatCard {
  value: number | string;  // Fixed: allow both numbers and strings
  label: string;
  icon: string;
  trend?: number;
  trendIcon?: string;
}

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface NewQuestion {
  text: string;
  category: string;
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css'],
  animations: [
    trigger('slideDown', [
      state('void', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class FaqComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  // Search
  searchQuery: string = '';
  showSuggestions: boolean = true;
  popularSuggestions: string[] = [
    'VermiFrass application',
    'BioVeg Plus for vegetables',
    'Organo-mineral meaning',
    'BSF bioconversion',
    'NPK 10% fertilizer',
    'Delivery in Nairobi',
    'Soil testing services',
    'Smallholder farmers'
  ];

  // Stats - Fixed with correct types
  stats: StatCard[] = [
    {
      value: 24,
      label: 'Questions Answered',
      icon: 'fas fa-question-circle',
      trend: 8,
      trendIcon: 'fas fa-arrow-up'
    },
    {
      value: 156,
      label: 'Happy Farmers',
      icon: 'fas fa-smile',
      trend: 12,
      trendIcon: 'fas fa-arrow-up'
    },
    {
      value: '24h',
      label: 'Response Time',
      icon: 'fas fa-clock'
    },
    {
      value: '98%',
      label: 'Satisfaction',
      icon: 'fas fa-star',
      trend: 3,
      trendIcon: 'fas fa-arrow-up'
    }
  ];

  // REAL FAQ DATA from PDF
  categories: FAQCategory[] = [
    {
      id: 'about',
      name: 'About Mzuri Organics',
      icon: 'fas fa-leaf',
      description: 'Learn about our mission, process, and values',
      questions: [
        {
          id: 'about1',
          question: 'What is Mzuri Organics?',
          answer: 'Mzuri Organics is a Kenyan regenerative agriculture company transforming organic waste into high-quality bio-fertilizers and organo-mineral fertilizers that restore soil health, improve yields, and support safe food production.',
          category: 'about',
          difficulty: 'beginner',
          readTime: 2,
          tags: ['company', 'mission', 'Kenya'],
          helpfulCount: 245,
          yesVotes: 235,
          noVotes: 10,
          answeredBy: 'Founder',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'about2',
          question: 'Where are your products made?',
          answer: 'All Mzuri Organics products are produced in Kenya using locally sourced organic materials through circular economy systems such as Black Soldier Fly (BSF) bioconversion and vermicomposting.',
          category: 'about',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['production', 'Kenya', 'BSF'],
          helpfulCount: 189,
          yesVotes: 182,
          noVotes: 7,
          answeredBy: 'Operations Team',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'about3',
          question: 'What makes Mzuri Organics different from other fertilizers?',
          answer: 'Our products go beyond nutrients. They rebuild living soils by combining organic matter, beneficial microbes, and precisely dosed minerals for long-term productivity.',
          category: 'about',
          difficulty: 'beginner',
          readTime: 2,
          tags: ['unique', 'soil health', 'microbes'],
          helpfulCount: 267,
          yesVotes: 258,
          noVotes: 9,
          answeredBy: 'Agronomy Team',
          updatedDate: 'Jan 2025'
        }
      ]
    },
    {
      id: 'products',
      name: 'Products & Composition',
      icon: 'fas fa-flask',
      description: 'Details about our fertilizers and their composition',
      questions: [
        {
          id: 'products1',
          question: 'What products do you offer?',
          answer: 'We offer VermiFrass, BioVeg Plus, BioFruity Plus, and a range of Organo-Mineral VF fertilizers including DAP 10%, CAN 10%, Urea 10%, and NPK 10%.',
          category: 'products',
          difficulty: 'beginner',
          readTime: 2,
          tags: ['products', 'fertilizers', 'NPK'],
          helpfulCount: 312,
          yesVotes: 298,
          noVotes: 14,
          answeredBy: 'Product Specialist',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'products2',
          question: 'What is VermiFrass?',
          answer: 'VermiFrass is an organic fertilizer made from vermicomposted Black Soldier Fly frass. It improves soil structure, microbial activity, and nutrient availability.',
          category: 'products',
          difficulty: 'beginner',
          readTime: 2,
          tags: ['VermiFrass', 'BSF', 'organic'],
          helpfulCount: 278,
          yesVotes: 265,
          noVotes: 13,
          answeredBy: 'Research Team',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'products3',
          question: 'What are BioVeg Plus and BioFruity Plus used for?',
          answer: 'BioVeg Plus supports leafy vegetables and vegetative growth, while BioFruity Plus enhances flowering, fruiting, and crop quality.',
          category: 'products',
          difficulty: 'beginner',
          readTime: 2,
          tags: ['BioVeg', 'BioFruity', 'specialized'],
          helpfulCount: 203,
          yesVotes: 195,
          noVotes: 8,
          answeredBy: 'Agronomy Team',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'products4',
          question: 'What does "organo-mineral" mean?',
          answer: 'Organo-mineral fertilizers combine organic matter and microbes with carefully balanced mineral nutrients, improving efficiency without harming soil life.',
          category: 'products',
          difficulty: 'intermediate',
          readTime: 2,
          tags: ['organo-mineral', 'composition'],
          helpfulCount: 167,
          yesVotes: 158,
          noVotes: 9,
          answeredBy: 'Technical Specialist',
          updatedDate: 'Jan 2025'
        }
      ]
    },
    {
      id: 'application',
      name: 'Application & Usage',
      icon: 'fas fa-hand-sparkles',
      description: 'How to apply our products for best results',
      questions: [
        {
          id: 'app1',
          question: 'How much VermiFrass should I apply?',
          answer: 'Apply 150–250 kg per acre depending on crop type and soil condition.',
          category: 'application',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['VermiFrass', 'dosage'],
          helpfulCount: 289,
          yesVotes: 276,
          noVotes: 13,
          answeredBy: 'Agronomy Team',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'app2',
          question: 'What is the application rate for organo-mineral fertilizers?',
          answer: 'Apply 125–150 kg per acre.',
          category: 'application',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['organo-mineral', 'dosage'],
          helpfulCount: 234,
          yesVotes: 225,
          noVotes: 9,
          answeredBy: 'Agronomy Team',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'app3',
          question: 'How do I use the liquid products?',
          answer: 'Use 1 litre per acre (200-250ml:20ltrs of water) for vegetables and 2 litres per acre (400-500ml:20ltrs of water) for heavy feeders such as maize, sugarcane, coffee, and fodder. Apply as foliar spray or soil drench.',
          category: 'application',
          difficulty: 'intermediate',
          readTime: 3,
          tags: ['liquid', 'foliar spray', 'soil drench'],
          helpfulCount: 256,
          yesVotes: 242,
          noVotes: 14,
          answeredBy: 'Application Specialist',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'app4',
          question: 'Can I combine your products with other fertilizers?',
          answer: 'Yes. Mzuri Organics products can be used alone or alongside other fertilizers and often reduce the need for repeated synthetic applications.',
          category: 'application',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['combination', 'synthetic'],
          helpfulCount: 198,
          yesVotes: 190,
          noVotes: 8,
          answeredBy: 'Agronomy Team',
          updatedDate: 'Jan 2025'
        }
      ]
    },
    {
      id: 'performance',
      name: 'Performance & Results',
      icon: 'fas fa-chart-line',
      description: 'What to expect from our products',
      questions: [
        {
          id: 'perf1',
          question: 'Do organic fertilizers really work as well as synthetic fertilizers?',
          answer: 'Yes. Over time, our products often outperform synthetics by improving nutrient efficiency, root growth, moisture retention, and soil biology.',
          category: 'performance',
          difficulty: 'intermediate',
          readTime: 2,
          tags: ['effectiveness', 'vs synthetic'],
          helpfulCount: 312,
          yesVotes: 298,
          noVotes: 14,
          answeredBy: 'Research Director',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'perf2',
          question: 'How soon will I see results?',
          answer: 'Most farmers notice improved crop vigor early, better yields within a season, and healthier soils over multiple seasons.',
          category: 'performance',
          difficulty: 'beginner',
          readTime: 2,
          tags: ['timeline', 'results'],
          helpfulCount: 287,
          yesVotes: 275,
          noVotes: 12,
          answeredBy: 'Field Team',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'perf3',
          question: 'Can these products reduce fertilizer costs?',
          answer: 'Yes. Many farmers significantly reduce or eliminate repeated top-dressing with CAN or Urea after consistent use.',
          category: 'performance',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['cost savings', 'economics'],
          helpfulCount: 265,
          yesVotes: 258,
          noVotes: 7,
          answeredBy: 'Economics Team',
          updatedDate: 'Jan 2025'
        }
      ]
    },
    {
      id: 'safety',
      name: 'Safety & Certification',
      icon: 'fas fa-shield-alt',
      description: 'Quality assurance and safety information',
      questions: [
        {
          id: 'safe1',
          question: 'Are your products safe for food crops?',
          answer: 'Yes. All products are designed to support safe, residue-free food production when used as recommended.',
          category: 'safety',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['safety', 'food crops'],
          helpfulCount: 234,
          yesVotes: 228,
          noVotes: 6,
          answeredBy: 'Quality Assurance',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'safe2',
          question: 'Are your products certified?',
          answer: 'We operate under strict quality control systems and are aligning with KEBS and KEPHIS standards for compliance and safety.',
          category: 'safety',
          difficulty: 'intermediate',
          readTime: 1,
          tags: ['certification', 'KEBS', 'KEPHIS'],
          helpfulCount: 187,
          yesVotes: 179,
          noVotes: 8,
          answeredBy: 'Quality Manager',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'safe3',
          question: 'Do your products contain chemicals?',
          answer: 'Our products are organic or organo-mineral, using mineral nutrients responsibly and in precise amounts that protect soil health.',
          category: 'safety',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['chemicals', 'organic'],
          helpfulCount: 212,
          yesVotes: 205,
          noVotes: 7,
          answeredBy: 'Product Development',
          updatedDate: 'Jan 2025'
        }
      ]
    },
    {
      id: 'sustainability',
      name: 'Sustainability & Impact',
      icon: 'fas fa-globe-africa',
      description: 'Our commitment to the environment',
      questions: [
        {
          id: 'sust1',
          question: 'How do your products support sustainability?',
          answer: 'We recycle organic waste, reduce reliance on synthetic fertilizers, improve soil carbon, and create green jobs for youth and women.',
          category: 'sustainability',
          difficulty: 'intermediate',
          readTime: 2,
          tags: ['sustainability', 'jobs', 'waste'],
          helpfulCount: 178,
          yesVotes: 170,
          noVotes: 8,
          answeredBy: 'Sustainability Officer',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'sust2',
          question: 'Are your products climate-friendly?',
          answer: 'Yes. By diverting waste from landfills and reducing synthetic fertilizer use, our solutions lower greenhouse gas emissions.',
          category: 'sustainability',
          difficulty: 'intermediate',
          readTime: 2,
          tags: ['climate', 'emissions'],
          helpfulCount: 156,
          yesVotes: 149,
          noVotes: 7,
          answeredBy: 'Environmental Team',
          updatedDate: 'Jan 2025'
        }
      ]
    },
    {
      id: 'buying',
      name: 'Buying & Support',
      icon: 'fas fa-shopping-cart',
      description: 'How to purchase and get support',
      questions: [
        {
          id: 'buy1',
          question: 'Where can I buy Mzuri Organics products?',
          answer: 'Our products are available through Mzuri Organics outlets and selected agro-dealer partners across Kenya.',
          category: 'buying',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['purchase', 'outlets', 'agro-dealers'],
          helpfulCount: 298,
          yesVotes: 285,
          noVotes: 13,
          answeredBy: 'Sales Team',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'buy2',
          question: 'Do you offer soil testing or advisory services?',
          answer: 'Yes. We provide soil testing and agronomic support to ensure correct product selection and application.',
          category: 'buying',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['soil testing', 'advisory'],
          helpfulCount: 234,
          yesVotes: 226,
          noVotes: 8,
          answeredBy: 'Extension Services',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'buy3',
          question: 'Are your products suitable for smallholder farmers?',
          answer: 'Absolutely. They are designed to be affordable, practical, and effective for both smallholder and commercial farmers.',
          category: 'buying',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['smallholder', 'affordable'],
          helpfulCount: 267,
          yesVotes: 258,
          noVotes: 9,
          answeredBy: 'Smallholder Program',
          updatedDate: 'Jan 2025'
        }
      ]
    },
    {
      id: 'general',
      name: 'General',
      icon: 'fas fa-handshake',
      description: 'Partnerships, visits, and contact',
      questions: [
        {
          id: 'gen1',
          question: 'Can I visit or partner with Mzuri Organics?',
          answer: 'Yes. We welcome partnerships, research collaborations, and learning visits aligned with regenerative agriculture.',
          category: 'general',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['partnership', 'visit'],
          helpfulCount: 145,
          yesVotes: 138,
          noVotes: 7,
          answeredBy: 'Partnerships Team',
          updatedDate: 'Jan 2025'
        },
        {
          id: 'gen2',
          question: 'How can I contact Mzuri Organics?',
          answer: 'Call 0701 934 918 or visit www.mzuriorganics.co.ke for more information.',
          category: 'general',
          difficulty: 'beginner',
          readTime: 1,
          tags: ['contact', 'phone', 'website'],
          helpfulCount: 312,
          yesVotes: 302,
          noVotes: 10,
          answeredBy: 'Customer Care',
          updatedDate: 'Jan 2025'
        }
      ]
    }
  ];

  filteredCategories: FAQCategory[] = [];
  activeCategory: string = 'all';
  activeQuestionId: string | null = null;
  bookmarkedQuestions: Set<string> = new Set();
  filteredQuestions: FAQQuestion[] = [];
  totalQuestions: number = 0;
  quickAnswer: string = '';
  quickAnswerId: string = '';

  // New question form
  newQuestion: NewQuestion = {
    text: '',
    category: '',
    name: '',
    email: '',
    phone: ''
  };
  submitting: boolean = false;

  // Downloads
  downloading: string | null = null;
  downloadProgress: number = 0;

  // Toasts
  toasts: Toast[] = [];
  toastIdCounter: number = 0;

  // Voice search
  isListening: boolean = false;
  recognition: any;

  constructor() {
    this.initializeVoiceRecognition();
  }

  ngOnInit() {
    this.filterByCategory('all');
    this.totalQuestions = this.categories.reduce((total, cat) => total + cat.questions.length, 0);
    this.loadSavedData();
  }

downloadResource(resource: string) {
  this.downloading = resource;
  this.downloadProgress = 0;
  
  const interval = setInterval(() => {
    this.downloadProgress += 10;
    if (this.downloadProgress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        this.downloading = null;
        
        // Map the resource IDs to actual file paths
        const fileMap: any = {
          'bsf-manual': {
            path: '/images/Mzuri Organics BSF Training Manual.pdf',
            name: 'Mzuri-Organics-BSF-Training-Manual.pdf',
            displayName: 'BSF Training Manual'
          },
          'vermicomposting-manual': {
            path: '/images/Mzuri Organics Vermicomposting Training Manual.pdf',
            name: 'Mzuri-Organics-Vermicomposting-Training-Manual.pdf',
            displayName: 'Vermicomposting Training Manual'
          }
        };
        
        const file = fileMap[resource];
        if (file) {
          // Create a download link
          const link = document.createElement('a');
          link.href = file.path;
          link.download = file.name;
          link.target = '_blank';
          link.click();
          
          this.showToast('success', 'Download Started', `${file.displayName} is downloading`);
        }
      }, 500);
    }
  }, 200);
}
  initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-KE';
      
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.searchQuery = transcript;
        this.onSearch();
        this.isListening = false;
      };
      
      this.recognition.onerror = () => {
        this.isListening = false;
        this.showToast('error', 'Voice Search Error', 'Could not access microphone');
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    
    if (query.length > 0) {
      this.showSuggestions = false;
      this.filterQuestionsBySearch(query);
      this.findQuickAnswer(query);
    } else {
      this.filteredQuestions = [];
      this.quickAnswer = '';
      this.filterByCategory(this.activeCategory);
    }
  }

  filterQuestionsBySearch(query: string) {
    this.filteredQuestions = [];
    this.categories.forEach(category => {
      category.questions.forEach(question => {
        if (question.question.toLowerCase().includes(query) || 
            question.answer.toLowerCase().includes(query) ||
            question.tags.some(tag => tag.toLowerCase().includes(query))) {
          this.filteredQuestions.push(question);
        }
      });
    });
  }

  findQuickAnswer(query: string) {
    const quickAnswers: { [key: string]: { answer: string, id: string } } = {
      'vermi': { 
        answer: 'Apply 150–250 kg per acre depending on crop type and soil condition.',
        id: 'app1'
      },
      'bioveg': {
        answer: 'BioVeg Plus supports leafy vegetables and vegetative growth.',
        id: 'products3'
      },
      'biofruity': {
        answer: 'BioFruity Plus enhances flowering, fruiting, and crop quality.',
        id: 'products3'
      },
      'organo-mineral': {
        answer: 'Combines organic matter and microbes with balanced mineral nutrients.',
        id: 'products4'
      },
      'contact': {
        answer: 'Call 0701 934 918 or visit www.mzuriorganics.co.ke',
        id: 'gen2'
      },
      'price': {
        answer: 'Contact our sales team at 0701 934 918 for current pricing.',
        id: 'buy1'
      }
    };

    for (const keyword in quickAnswers) {
      if (query.includes(keyword)) {
        this.quickAnswer = quickAnswers[keyword].answer;
        this.quickAnswerId = quickAnswers[keyword].id;
        return;
      }
    }
    
    this.quickAnswer = '';
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredQuestions = [];
    this.quickAnswer = '';
    this.showSuggestions = true;
    this.filterByCategory(this.activeCategory);
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.onSearch();
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  filterByCategory(category: string) {
    this.activeCategory = category;
    
    if (category === 'all') {
      this.filteredCategories = [...this.categories];
    } else {
      this.filteredCategories = this.categories.filter(cat => cat.id === category);
    }
  }

  getCategoryCount(categoryId: string): number {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.questions.length : 0;
  }

  getProgressPercentage(): number {
    const total = this.totalQuestions;
    const current = this.activeCategory === 'all' 
      ? this.totalQuestions 
      : this.getCategoryCount(this.activeCategory);
    return (current / total) * 100;
  }

  toggleQuestion(questionId: string) {
    if (this.activeQuestionId === questionId) {
      this.activeQuestionId = null;
    } else {
      this.activeQuestionId = questionId;
    }
  }

  isQuestionActive(questionId: string): boolean {
    return this.activeQuestionId === questionId;
  }

  scrollToQuestion(questionId: string) {
    this.activeQuestionId = questionId;
    setTimeout(() => {
      const element = document.getElementById(`question-${questionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  toggleBookmark(questionId: string, event: Event) {
    event.stopPropagation();
    if (this.bookmarkedQuestions.has(questionId)) {
      this.bookmarkedQuestions.delete(questionId);
      this.showToast('info', 'Bookmark Removed', 'Question removed from bookmarks');
    } else {
      this.bookmarkedQuestions.add(questionId);
      this.showToast('success', 'Bookmarked', 'Question added to bookmarks');
    }
    localStorage.setItem('bookmarkedQuestions', JSON.stringify([...this.bookmarkedQuestions]));
  }

  isBookmarked(questionId: string): boolean {
    return this.bookmarkedQuestions.has(questionId);
  }

  voteOnQuestion(questionId: string, vote: 'yes' | 'no', event: Event) {
    event.stopPropagation();
    const question = this.findQuestionById(questionId);
    if (question) {
      if (question.userVote === vote) {
        question.userVote = undefined;
        if (vote === 'yes') question.yesVotes--;
        else question.noVotes--;
      } else {
        if (question.userVote === 'yes') question.yesVotes--;
        else if (question.userVote === 'no') question.noVotes--;
        
        question.userVote = vote;
        if (vote === 'yes') question.yesVotes++;
        else question.noVotes++;
      }
      
      question.helpfulCount = question.yesVotes;
      this.showToast('success', 'Thank You!', 'Your feedback helps other farmers');
    }
  }

  getHelpfulPercentage(question: FAQQuestion): number {
    const total = question.yesVotes + question.noVotes;
    return total > 0 ? Math.round((question.yesVotes / total) * 100) : 0;
  }

  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.icon : 'fas fa-question-circle';
  }

  getCategoryDescription(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.description : '';
  }

  getCategoryHelpfulCount(categoryId: string): number {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) return 0;
    return category.questions.reduce((total, q) => total + q.helpfulCount, 0);
  }

  findQuestionById(questionId: string): FAQQuestion | undefined {
    for (const category of this.categories) {
      const question = category.questions.find(q => q.id === questionId);
      if (question) return question;
    }
    return undefined;
  }

  scrollToCategory(category: string) {
    this.filterByCategory(category);
    setTimeout(() => {
      const element = document.querySelector('.category-filter');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  startVoiceSearch() {
    if (!this.recognition) {
      this.showToast('error', 'Not Supported', 'Voice search not supported in this browser');
      return;
    }
    
    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.start();
      this.isListening = true;
      this.showToast('info', 'Listening...', 'Speak your question now');
    }
  }

  submitQuestion(form: any) {
    if (!this.newQuestion.text || !this.newQuestion.category || !this.newQuestion.name || !this.newQuestion.email) {
      this.showToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    this.submitting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.submitting = false;
      this.showToast('success', 'Question Submitted!', 'Our experts will respond within 24 hours');
      
      this.newQuestion = {
        text: '',
        category: '',
        name: '',
        email: '',
        phone: ''
      };
      
      form.resetForm();
    }, 2000);
  }

  shareQuestion(question: FAQQuestion, event: Event) {
    event.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: question.question,
        text: question.answer,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(question.question + '\n\n' + question.answer);
      this.showToast('success', 'Copied!', 'Question and answer copied to clipboard');
    }
  }

  loadSavedData() {
    const saved = localStorage.getItem('bookmarkedQuestions');
    if (saved) {
      this.bookmarkedQuestions = new Set(JSON.parse(saved));
    }
  }

  showToast(type: Toast['type'], title: string, message: string) {
    const toast: Toast = {
      id: ++this.toastIdCounter,
      type,
      title,
      message
    };
    
    this.toasts.push(toast);
    
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== toast.id);
    }, 5000);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getToastIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'success': 'fas fa-check-circle',
      'error': 'fas fa-exclamation-circle',
      'info': 'fas fa-info-circle',
      'warning': 'fas fa-exclamation-triangle'
    };
    return icons[type] || 'fas fa-info-circle';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.search-container')) {
      this.showSuggestions = false;
    }
  }
}