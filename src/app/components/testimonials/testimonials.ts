import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CartComponent } from '../../pages/cart/cart';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':increment, :decrement', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  currentIndex = 0;
  private intervalId: any;
  imageLoaded = false;

  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Mukhwana Wafula',
      role: 'Sugarcane & Maize Farmer',
      image: '/images/farmer-luhya1.jpg',
      quote: 'Omulimi omukhonyeki khulwa Mzuri Organics. Itsimba tsianje tsikhola khandi! My harvests have multiplied from 15 bags to 40 bags per acre!'
    },
    {
      id: 2,
      name: 'Mama Risper Nasimiyu',
      role: 'Vegetable Farmer & Women Group Leader',
      image: '/images/farmer-luhya2.jpg',
      quote: 'Khusio mwalo, olime khu Mzuri! Since I started using Mzuri, my vegetables sell out before I reach the market!'
    },
    {
      id: 3,
      name: 'Kipchumba Rono',
      role: 'Dairy Farmer',
      image: '/images/farmer-kalenjin1.jpg',
      quote: 'Barak kelya Mzuri! My cows are healthier and produce more milk - from 15L to 25L per cow daily!'
    },
    {
      id: 4,
      name: 'Omondi Odhiambo',
      role: 'Fish Farmer',
      image: '/images/farmer-luo1.jpg',
      quote: 'Rech maga koro dongo gi maber! My fish now grow bigger and I supply to 15 hotels in Kisumu city!'
    },
    {
      id: 5,
      name: 'Mama Alice Mutenyo',
      role: 'Restaurant Owner',
      image: '/images/customer-luhya1.jpg',
      quote: 'My customers travel from as far as Kitale just to eat my vegetables. That\'s the Mzuri difference!'
    },
    {
      id: 6,
      name: 'Hon. James Kemboi',
      role: 'Community Leader & Partner',
      image: '/images/partner-kalenjin1.jpg',
      quote: 'Bringing Mzuri Organics to my constituency is the best decision I\'ve made for my people. 200 youth trained!'
    }
  ];

  currentTestimonial: Testimonial = this.testimonials[0];

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextTestimonial() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.currentTestimonial = this.testimonials[this.currentIndex];
    this.imageLoaded = false;
  }

  previousTestimonial() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    this.currentTestimonial = this.testimonials[this.currentIndex];
    this.imageLoaded = false;
  }

  goToTestimonial(index: number) {
    if (index !== this.currentIndex) {
      this.currentIndex = index;
      this.currentTestimonial = this.testimonials[index];
      this.imageLoaded = false;
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }
}