import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
  category: 'products' | 'farming' | 'impact' | 'partnership' | 'technical';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  tags: string[];
  helpfulCount: number;
  yesVotes: number;
  noVotes: number;
  userVote?: 'yes' | 'no';
  highlighted?: boolean;
  answeredBy?: string;
  updatedDate?: string;
  keyTakeaways?: string[];
  proTips?: {
    title: string;
    description: string;
    icon: string;
  }[];
  kenyanExample?: {
    location: string;
    description: string;
    stats: {
      yieldIncrease: string;
      costSavings: string;
      timePeriod: string;
    };
  };
  visualGuide?: {
    comparison: {
      attribute: string;
      mzuri: string;
      conventional: string;
    }[];
  };
}

interface FAQCategory {
  id: string;
  name: string;
  questions: FAQQuestion[];
}

interface StatCard {
  value: number;
  label: string;
  icon: string;
  class: string;
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
  urgency: 'low' | 'medium' | 'high';
  contactMethod: 'email' | 'phone' | 'whatsapp';
}
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css'],
  animations: [
    trigger('slideDown', [
      state('void', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      state('*', style({
        height: '*',
        opacity: 1
      })),
      transition('void <=> *', [
        animate('300ms ease-in-out')
      ])
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

  // Search functionality
  searchQuery: string = '';
  showSuggestions: boolean = false;
  popularSuggestions: string[] = [
    'NPK fertilizer benefits',
    'BSF larvae for poultry',
    'Delivery in Nairobi',
    'Organic certification',
    'Crop rotation with BSF',
    'Pricing for bulk orders',
    'Soil testing services',
    'Training workshops',
    'Payment methods',
    'Seasonal discounts'
  ];

  // Stats
  stats: StatCard[] = [
    {
      value: 247,
      label: 'Questions Answered',
      icon: 'fas fa-question-circle',
      class: 'stat-questions',
      trend: 12,
      trendIcon: 'fas fa-arrow-up'
    },
    {
      value: 89,
      label: 'Farmers Helped Today',
      icon: 'fas fa-user-check',
      class: 'stat-farmers',
      trend: 8,
      trendIcon: 'fas fa-arrow-up'
    },
    {
      value: 24,
      label: 'Quick Response (hours)',
      icon: 'fas fa-clock',
      class: 'stat-response'
    },
    {
      value: 98,
      label: 'Satisfaction Rate',
      icon: 'fas fa-percentage',
      class: 'stat-satisfaction',
      trend: 3,
      trendIcon: 'fas fa-arrow-up'
    }
  ];

  // FAQ Data
  categories: FAQCategory[] = [];
  filteredCategories: FAQCategory[] = [];
  activeCategory: string = 'all';
  activeQuestionId: string | null = null;
  bookmarkedQuestions: Set<string> = new Set();

  // Filtering
  filteredQuestions: FAQQuestion[] = [];
  totalQuestions: number = 0;

  // Quick answer
  quickAnswer: string = '';
  quickAnswerId: string = '';

  // New question form
  newQuestion: NewQuestion = {
    text: '',
    category: '',
    urgency: 'medium',
    contactMethod: 'whatsapp'
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
    this.initializeFAQData();
    this.filterByCategory('all');
    this.startCountingAnimation();
  }

  initializeFAQData() {
    this.categories = [
      {
        id: 'products',
        name: 'Products & Solutions',
        questions: [
          {
            id: 'product-1',
            question: 'What are the main benefits of using NPK fertilizer for my crops?',
            answer: 'Mzuri Organics NPK fertilizer provides balanced nutrition with 15-15-15 NPK ratio, ensuring optimal growth. Key benefits include: increased yield by up to 40%, improved soil structure, enhanced crop quality, and better resistance to pests and diseases.',
            category: 'products',
            difficulty: 'beginner',
            readTime: 3,
            tags: ['NPK', 'fertilizer', 'nutrition', 'crops'],
            helpfulCount: 156,
            yesVotes: 142,
            noVotes: 14,
            keyTakeaways: [
              'Balanced 15-15-15 NPK ratio for all crops',
              'Increases yield by 30-40%',
              'Improves soil structure and fertility',
              'Reduces chemical dependency'
            ],
            proTips: [
              {
                title: 'Application Timing',
                description: 'Apply during planting and top-dress 4 weeks after germination',
                icon: 'fas fa-calendar-alt'
              },
              {
                title: 'Maize Specific',
                description: 'Use 50kg per acre for maize during planting',
                icon: 'fas fa-seedling'
              },
              {
                title: 'Storage',
                description: 'Keep in dry place to prevent caking',
                icon: 'fas fa-warehouse'
              }
            ],
            kenyanExample: {
              location: 'Nakuru County',
              description: 'Farmer John increased maize yield from 15 to 22 bags per acre using Mzuri NPK fertilizer with proper application methods.',
              stats: {
                yieldIncrease: '+47%',
                costSavings: 'KES 8,000',
                timePeriod: 'One Season'
              }
            },
            visualGuide: {
              comparison: [
                { attribute: 'Yield Increase', mzuri: '30-40%', conventional: '15-20%' },
                { attribute: 'Soil Health', mzuri: 'Improves', conventional: 'Degrades' },
                { attribute: 'Cost per Acre', mzuri: 'KES 5,000', conventional: 'KES 7,500' },
                { attribute: 'Environmental Impact', mzuri: 'Low', conventional: 'High' }
              ]
            }
          }
        ]
      },
      {
        id: 'farming',
        name: 'Farming Practices',
        questions: [
          {
            id: 'farming-1',
            question: 'How often should I apply BSF larvae to my poultry?',
            answer: 'BSF larvae should be applied as a protein supplement to poultry 2-3 times per week. For best results, feed 10-15% of total feed as BSF larvae. Monitor bird health and adjust accordingly.',
            category: 'farming',
            difficulty: 'beginner',
            readTime: 2,
            tags: ['BSF', 'poultry', 'feeding', 'protein'],
            helpfulCount: 89,
            yesVotes: 82,
            noVotes: 7
          }
        ]
      }
    ];

    this.totalQuestions = this.categories.reduce((total, category) => total + category.questions.length, 0);
  }

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;
    
    if (query.length > 0) {
      this.showSuggestions = false;
      this.filterQuestionsBySearch(query);
      this.findQuickAnswer(query);
    } else {
      this.filteredQuestions = [];
      this.quickAnswer = '';
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
      'npk': { 
        answer: 'NPK fertilizer provides balanced nutrition (15-15-15) for all crops. Apply 50kg/acre during planting.',
        id: 'product-1'
      },
      'delivery': {
        answer: 'We deliver nationwide within 2-3 business days. Nairobi delivery is free for orders above KES 10,000.',
        id: 'product-1'
      },
      'price': {
        answer: 'NPK fertilizer: KES 5,000 per 50kg bag. BSF larvae: KES 800 per kg. Bulk discounts available.',
        id: 'product-1'
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
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.onSearch({ target: { value: suggestion } });
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  filterByCategory(category: string) {
    this.activeCategory = category;
    
    if (category === 'all') {
      this.filteredCategories = [...this.categories];
      this.filteredQuestions = this.getAllQuestions();
    } else {
      this.filteredCategories = this.categories.filter(cat => cat.id === category);
      this.filteredQuestions = this.filteredCategories[0]?.questions || [];
    }
  }

  getCategoryCount(category: string): number {
    if (category === 'all') return this.totalQuestions;
    const cat = this.categories.find(c => c.id === category);
    return cat ? cat.questions.length : 0;
  }

  getAllQuestions(): FAQQuestion[] {
    return this.categories.flatMap(category => category.questions);
  }

  getProgressPercentage(): number {
    const total = this.totalQuestions;
    const current = this.filteredQuestions.length;
    return total > 0 ? (current / total) * 100 : 0;
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
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  toggleBookmark(questionId: string) {
    if (this.bookmarkedQuestions.has(questionId)) {
      this.bookmarkedQuestions.delete(questionId);
      this.showToast('info', 'Bookmark Removed', 'Question removed from bookmarks');
    } else {
      this.bookmarkedQuestions.add(questionId);
      this.showToast('success', 'Bookmarked', 'Question added to bookmarks');
    }
  }

  isBookmarked(questionId: string): boolean {
    return this.bookmarkedQuestions.has(questionId);
  }

  voteOnQuestion(questionId: string, vote: 'yes' | 'no') {
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
    }
  }

  getHelpfulPercentage(question: FAQQuestion): number {
    const total = question.yesVotes + question.noVotes;
    return total > 0 ? Math.round((question.yesVotes / total) * 100) : 0;
  }

  getCategoryIcon(categoryId: string): string {
    const icons: { [key: string]: string } = {
      'products': 'fas fa-vial',
      'farming': 'fas fa-tractor',
      'impact': 'fas fa-leaf',
      'partnership': 'fas fa-handshake',
      'technical': 'fas fa-cogs'
    };
    return icons[categoryId] || 'fas fa-question-circle';
  }

  getCategoryDescription(categoryId: string): string {
    const descriptions: { [key: string]: string } = {
      'products': 'Organic fertilizers, BSF larvae, and sustainable solutions',
      'farming': 'Best practices, techniques, and seasonal guidance',
      'impact': 'Environmental benefits and community success stories',
      'partnership': 'Orders, delivery, and collaboration opportunities',
      'technical': 'Application methods, troubleshooting, and technical support'
    };
    return descriptions[categoryId] || 'Frequently asked questions';
  }

  getCategoryHelpfulCount(categoryId: string): number {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) return 0;
    return category.questions.reduce((total, q) => total + q.helpfulCount, 0);
  }

  getTagType(tag: string): string {
    const tagTypes: { [key: string]: string } = {
      'npk': 'primary',
      'fertilizer': 'primary',
      'bsf': 'secondary',
      'larvae': 'secondary',
      'organic': 'success',
      'sustainable': 'success',
      'delivery': 'info',
      'pricing': 'warning',
      'technical': 'danger'
    };
    return tagTypes[tag.toLowerCase()] || 'default';
  }

  getRelatedQuestions(question: FAQQuestion): FAQQuestion[] {
    return this.getAllQuestions()
      .filter(q => 
        q.id !== question.id && 
        q.category === question.category &&
        q.tags.some(tag => question.tags.includes(tag))
      )
      .slice(0, 3);
  }

  navigateToQuestion(questionId: string) {
    this.scrollToQuestion(questionId);
    this.toggleQuestion(questionId);
  }

  submitQuestion() {
    if (!this.newQuestion.text || !this.newQuestion.category) {
      this.showToast('error', 'Missing Information', 'Please fill in all required fields');
      return;
    }

    this.submitting = true;
    
    setTimeout(() => {
      this.submitting = false;
      this.showToast('success', 'Question Submitted!', 
        `Our experts will respond within 24 hours via ${this.newQuestion.contactMethod}`);
      
      this.newQuestion = {
        text: '',
        category: '',
        urgency: 'medium',
        contactMethod: 'whatsapp'
      };
    }, 2000);
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
          this.showToast('success', 'Download Complete', 'Resource downloaded successfully');
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
        this.onSearch({ target: { value: transcript } });
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

  showToast(type: Toast['type'], title: string, message: string) {
    const toast: Toast = {
      id: ++this.toastIdCounter,
      type,
      title,
      message
    };
    
    this.toasts.push(toast);
    
    setTimeout(() => {
      this.removeToast(toast.id);
    }, 5000);
  }
  

  removeToast(id: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
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

  startCountingAnimation() {
    setTimeout(() => {
      const statElements = document.querySelectorAll('.animate-count');
      statElements.forEach(element => {
        const target = parseInt(element.getAttribute('data-target') || '0');
        this.animateCount(element as HTMLElement, target);
      });
    }, 500);
  }

  animateCount(element: HTMLElement, target: number) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toString();
      }
    }, 30);
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

  openLiveChat() {
    this.showToast('info', 'Live Chat', 'Connecting you with an expert...');
  }

// In your FaqComponent class, update the openVideoLibrary method:
openVideoLibrary() {
  // Open Mzuri Organics YouTube channel in a new tab
  window.open('https://www.youtube.com/@mzuriorganics', '_blank');
  
  // Optional: Show a toast notification
  this.showToast('info', 'YouTube Channel', 'Opening Mzuri Organics YouTube channel...');
}

// Or if you want a different name:
openYouTubeChannel() {
  window.open('https://www.youtube.com/@mzuriorganics', '_blank');
  this.showToast('info', 'YouTube Channel', 'Opening Mzuri Organics YouTube channel...');
}


  joinCommunity() {
    this.showToast('success', 'Community', 'Redirecting to farmer community...');
  }

  shareQuestion(question: FAQQuestion) {
    if (navigator.share) {
      navigator.share({
        title: question.question,
        text: question.answer.substring(0, 100) + '...',
        url: window.location.href + '#question-' + question.id
      });
    } else {
      navigator.clipboard.writeText(window.location.href + '#question-' + question.id);
      this.showToast('success', 'Copied!', 'Link copied to clipboard');
    }
  }

  printQuestion(question: FAQQuestion) {
    const printContent = `
      <h2>${question.question}</h2>
      <p><strong>Mzuri Organics Answer:</strong></p>
      <p>${question.answer}</p>
      ${question.keyTakeaways ? `<h3>Key Takeaways:</h3><ul>${question.keyTakeaways.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
      <p><em>From Mzuri Organics FAQ - ${new Date().toLocaleDateString()}</em></p>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${question.question}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2 { color: #2E7D32; }
              h3 { color: #388E3C; }
              ul { padding-left: 20px; }
              li { margin: 10px 0; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  translateQuestion(question: FAQQuestion) {
    this.showToast('info', 'Translation', 'Swahili translation coming soon...');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.search-container')) {
      this.showSuggestions = false;
    }
  }
}