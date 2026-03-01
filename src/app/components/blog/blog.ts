// src/app/components/blog/blog.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../../pages/cart/cart';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  publishDate: Date;
  category: 'farming-tips' | 'success-stories' | 'industry-news' | 'sustainable-agriculture';
  imageUrl: string;
  readTime: number;
  tags: string[];
  featured: boolean;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, CartComponent],
  templateUrl: './blog.html',
  styleUrls: ['./blog.css']
})
export class BlogComponent {
  blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Transforming Kenyan Agriculture: How Biofertilizers Increased Yields by 40%',
      excerpt: 'Discover how smallholder farmers in Western Kenya are achieving remarkable crop yields through sustainable organic practices and Mzuri biofertilizers.',
      content: 'Full article content...',
      author: 'John Kamau',
      authorRole: 'Commercial Farmer',
      publishDate: new Date('2024-01-15'),
      category: 'success-stories',
      imageUrl: '/images/blog.jpeg',
      readTime: 6,
      tags: ['biofertilizers', 'yield-increase', 'organic-farming', 'kenya'],
      featured: true
    },
    {
      id: '2',
      title: '5 Sustainable Farming Practices Every Kenyan Farmer Should Adopt in 2024',
      excerpt: 'Expert insights on sustainable agricultural practices that reduce costs, improve soil health, and increase productivity for East African farmers.',
      content: 'Full article content...',
      author: 'Dr. Sarah Mwangi',
      authorRole: 'Agricultural Scientist',
      publishDate: new Date('2024-01-12'),
      category: 'farming-tips',
      imageUrl: '/images/blog2.jpeg',
      readTime: 8,
      tags: ['sustainable', 'farming-tips', 'soil-health', 'east-africa'],
      featured: true
    },
    {
      id: '3',
      title: 'The Future of Livestock Farming: Insect-Based Protein Feeds Revolution',
      excerpt: 'How insect-based protein feeds are transforming livestock nutrition while promoting circular economy principles in African agriculture.',
      content: 'Full article content...',
      author: 'Mzuri Organics Team',
      authorRole: 'Innovation Department',
      publishDate: new Date('2024-01-08'),
      category: 'industry-news',
      imageUrl: '/images/blog3.jpeg',
      readTime: 7,
      tags: ['insect-protein', 'livestock', 'sustainable-feeds', 'innovation'],
      featured: false
    },
    {
      id: '4',
      title: 'Bioconversion Technology: Turning Agricultural Waste into Organic Wealth',
      excerpt: 'An in-depth look at how Mzuri Organics is leading the way in converting farm waste into high-value organic fertilizers through advanced bioconversion.',
      content: 'Full article content...',
      author: 'Professor James Omondi',
      authorRole: 'Environmental Scientist',
      publishDate: new Date('2024-01-05'),
      category: 'sustainable-agriculture',
      imageUrl: '/images/blog4.jpeg',
      readTime: 9,
      tags: ['bioconversion', 'waste-management', 'organic-fertilizers', 'technology'],
      featured: false
    },
    {
      id: '5',
      title: 'Soil Health Restoration: Our Journey with Regenerative Agriculture',
      excerpt: 'Case study showing how regenerative farming practices have restored degraded soils and improved farm profitability in Kakamega County.',
      content: 'Full article content...',
      author: 'Mary Atieno',
      authorRole: 'Farm Manager',
      publishDate: new Date('2024-01-02'),
      category: 'success-stories',
      imageUrl: '/images/blog5.jpeg',
      readTime: 5,
      tags: ['regenerative-agriculture', 'soil-health', 'kenya', 'case-study'],
      featured: false
    },
    {
      id: '6',
      title: 'Organic Certification in Kenya: A Comprehensive Guide for Farmers',
      excerpt: 'Everything Kenyan farmers need to know about organic certification processes, benefits, and how to get started with sustainable farming.',
      content: 'Full article content...',
      author: 'Kenya Organic Association',
      authorRole: 'Certification Body',
      publishDate: new Date('2023-12-28'),
      category: 'farming-tips',
      imageUrl: '/images/blog6.jpeg',
      readTime: 10,
      tags: ['organic-certification', 'guidelines', 'kenya', 'best-practices'],
      featured: false
    }
  ];

  categories = [
    { value: 'all', label: 'All Articles', icon: 'all' },
    { value: 'success-stories', label: 'Success Stories', icon: 'success' },
    { value: 'farming-tips', label: 'Farming Tips', icon: 'tips' },
    { value: 'industry-news', label: 'Industry News', icon: 'news' },
    { value: 'sustainable-agriculture', label: 'Sustainable Ag', icon: 'sustainable' }
  ];

  selectedCategory = 'all';

  get filteredPosts() {
    if (this.selectedCategory === 'all') {
      return this.blogPosts;
    }
    return this.blogPosts.filter(post => post.category === this.selectedCategory);
  }

  get featuredPosts() {
    return this.blogPosts.filter(post => post.featured);
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
  }

  getCategoryLabel(categoryValue: string): string {
    const category = this.categories.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  }

  getCategoryIcon(categoryValue: string): string {
    const icons: { [key: string]: string } = {
      'all': `M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 8h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1zm3-8h-2c-.55 0-1-.45-1-1s.45-1 1-1h2c.55 0 1 .45 1 1s-.45 1-1 1zm0 4h-2c-.55 0-1-.45-1-1s.45-1 1-1h2c.55 0 1 .45 1 1s-.45 1-1 1z`,
      'success': `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z`,
      'tips': `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z`,
      'news': `M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z`,
      'sustainable': `M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.18 5 4.05 5 7.41 0 2.08-.8 3.97-2.1 5.39z`
    };
    return icons[categoryValue] || icons['all'];
  }
}