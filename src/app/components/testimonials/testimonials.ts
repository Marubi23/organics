import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
  story: string;
  results: {
    icon: string;
    value: string;
    label: string;
  }[];
  category: 'farmer' | 'customer' | 'partner';
  joinDate: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.css']
})
export class TestimonialsComponent {
  activeCategory = 'all';
  
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Jane Wambui',
      location: 'Kakamega County',
      role: 'Organic Avocado Farmer',
      image: '/images/farmer.jpeg',
      quote: 'Mzuri Organics transformed my farm from struggling to thriving. The organic fertilizers increased my yields beyond imagination!',
      rating: 5,
      story: 'After years of using chemical fertilizers that degraded my soil, I discovered Mzuri Organics. Their training and organic inputs helped me transition to sustainable farming. Now I earn 3x more while protecting my land for future generations.',
      results: [
        { icon: 'fas fa-chart-line', value: '60%', label: 'Yield Increase' },
        { icon: 'fas fa-money-bill-wave', value: '3x', label: 'Income Growth' },
        { icon: 'fas fa-leaf', value: '100%', label: 'Organic' }
      ],
      category: 'farmer',
      joinDate: '2022'
    },
    {
      id: 2,
      name: 'Samuel Otieno',
      location: 'Busia County',
      role: 'Vermicompost Producer',
      image: '/images/farmer6.jpeg',
      quote: 'The training in vermicomposting changed everything. I now produce my own fertilizer and sell surplus to neighbors.',
      rating: 5,
      story: 'I went from being a subsistence farmer to a successful agripreneur. Mzuri Organics taught me vermicomposting, and now I run a thriving business supplying organic fertilizer to my community while creating jobs for local youth.',
      results: [
        { icon: 'fas fa-industry', value: '5 Tons', label: 'Monthly Production' },
        { icon: 'fas fa-users', value: '3', label: 'Jobs Created' },
        { icon: 'fas fa-recycle', value: '75%', label: 'Waste Reduced' }
      ],
      category: 'farmer',
      joinDate: '2021'
    },
    {
      id: 3,
      name: 'Grace Achieng',
      location: 'Vihiga County',
      role: 'Women Farmers Leader',
      image: '/images/farmer2.jpeg',
      quote: 'As a woman farmer, the support from Mzuri Organics helped me become a leader in my community.',
      rating: 5,
      story: 'Mzuri Organics empowered me with knowledge and resources that transformed not just my farm, but my entire community. I now train other women farmers and we\'ve formed a cooperative that markets our organic produce collectively.',
      results: [
        { icon: 'fas fa-graduation-cap', value: '30', label: 'Farmers Trained' },
        { icon: 'fas fa-female', value: '90%', label: 'Women Empowered' },
        { icon: 'fas fa-handshake', value: 'Co-op', label: 'Community Leader' }
      ],
      category: 'farmer',
      joinDate: '2020'
    },
    {
      id: 4,
      name: 'David Kimani',
      location: 'Nairobi',
      role: 'Restaurant Owner',
      image: '/images/farmer3.jpeg',
      quote: 'The quality and freshness of Mzuri Organics produce is unmatched. My customers can taste the difference!',
      rating: 5,
      story: 'Running an organic restaurant means every ingredient matters. Mzuri Organics delivers consistently fresh, flavorful produce that elevates our dishes. Our customers appreciate the farm-to-table story and quality.',
      results: [
        { icon: 'fas fa-utensils', value: '95%', label: 'Customer Satisfaction' },
        { icon: 'fas fa-star', value: '4.9', label: 'Restaurant Rating' },
        { icon: 'fas fa-calendar', value: '2 Years', label: 'Loyal Customer' }
      ],
      category: 'customer',
      joinDate: '2021'
    },
    {
      id: 5,
      name: 'Sarah Mwangi',
      location: 'Nakuru County',
      role: 'Organic Retailer',
      image: '/images/farmer5.jpeg',
      quote: 'Partnering with Mzuri Organics helped me build a trusted brand for organic products in my community.',
      rating: 5,
      story: 'As a retailer, I needed a reliable source of authentic organic products. Mzuri Organics not only supplies quality goods but also provides marketing support and consumer education that helps my business thrive.',
      results: [
        { icon: 'fas fa-store', value: '200%', label: 'Sales Growth' },
        { icon: 'fas fa-heart', value: '500+', label: 'Happy Customers' },
        { icon: 'fas fa-award', value: 'Top', label: 'Supplier' }
      ],
      category: 'partner',
      joinDate: '2022'
    },
    {
      id: 6,
      name: 'Michael Njoroge',
      location: 'Kiambu County',
      role: 'Tea Farmer',
      image: '/images/farmer4.jpeg',
      quote: 'The transition to organic farming was seamless with Mzuri Organics guidance and support.',
      rating: 5,
      story: 'I was skeptical about organic farming until I saw the results. Better soil health, premium prices for my tea, and the satisfaction of producing healthy, chemical-free products. Mzuri Organics made the journey rewarding.',
      results: [
        { icon: 'fas fa-mountain', value: '40%', label: 'Quality Premium' },
        { icon: 'fas fa-seedling', value: 'Healthy', label: 'Soil Health' },
        { icon: 'fas fa-globe', value: 'Export', label: 'Market Access' }
      ],
      category: 'farmer',
      joinDate: '2023'
    }
  ];

  filteredTestimonials = this.testimonials;

  filterTestimonials(category: string) {
    this.activeCategory = category;
    if (category === 'all') {
      this.filteredTestimonials = this.testimonials;
    } else {
      this.filteredTestimonials = this.testimonials.filter(t => t.category === category);
    }
  }

  getRatingStars(rating: number): number[] {
    return Array(rating).fill(1);
  }
  getCategoryIcon(category: string): string {
  switch(category) {
    case 'farmer': return 'fas fa-tractor';
    case 'customer': return 'fas fa-shopping-bag';
    case 'partner': return 'fas fa-handshake';
    default: return 'fas fa-star';
  }
}
}