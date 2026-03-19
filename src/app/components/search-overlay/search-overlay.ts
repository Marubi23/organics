import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface SearchResult {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-overlay.html',
  styleUrls: ['./search-overlay.css']
})
export class SearchOverlayComponent implements AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef;

  searchTerm = '';
  
  quickTags = [
    { text: 'Fertilizers', icon: 'fas fa-flask', tag: 'fertilizer' },
    { text: 'Feeds', icon: 'fas fa-paw', tag: 'feeds' },
    { text: 'Organic', icon: 'fas fa-leaf', tag: 'organic' }
  ];

  allProducts: SearchResult[] = [
    { id: 1, name: 'VermiFrass Active', description: 'Organic fertilizer', price: 1500, image: 'images/product3.jpg' },
    { id: 2, name: 'NPK Active', description: 'Organo-mineral fertilizer', price: 2000, image: 'images/product2.jpg' },
    { id: 3, name: 'i-Chick Mash', description: 'Starter feed', price: 3200, image: 'images/chick mash.jpeg' }
  ];

  filteredProducts: SearchResult[] = [];

  constructor(private router: Router) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredProducts = [];
      return;
    }
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.allProducts.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }

  searchTag(tag: { tag: string }) {
    this.searchTerm = tag.tag;
    this.onSearch();
  }

  goToProduct(product: SearchResult) {
    this.close.emit();
    this.router.navigate(['/products']);
  }
}