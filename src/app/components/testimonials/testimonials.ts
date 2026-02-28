import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  county: string;
  region: 'Western' | 'Rift Valley' | 'Nyanza';
  tribe: 'Luhya' | 'Kalenjin' | 'Kisii' | 'Luo';
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
  featured: boolean;
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
  activeRegion = 'all';
  
  testimonials: Testimonial[] = [
    // ===== WESTERN REGION - LUHYA =====
    {
      id: 1,
      name: 'Mukhwana Wafula',
      location: 'Bungoma County',
      county: 'Bungoma',
      region: 'Western',
      tribe: 'Luhya',
      role: 'Sugarcane & Maize Farmer',
      image: '/images/farmer-luhya1.jpg',
      quote: 'Omulimi omukhonyeki khulwa Mzuri Organics. Itsimba tsianje tsikhola khandi! (My harvests have multiplied thanks to Mzuri Organics!)',
      rating: 5,
      story: 'For 15 years, I struggled with declining yields on my family farm. After attending a Mzuri Organics workshop in Bungoma town, I switched to their organic fertilizers. My maize harvest increased from 15 bags to 40 bags per acre. My sugarcane is now the sweetest in the entire Webuye area!',
      results: [
        { icon: 'fas fa-chart-line', value: '250%', label: 'Yield Increase' },
        { icon: 'fas fa-tractor', value: '40 bags', label: 'Maize per Acre' },
        { icon: 'fas fa-users', value: '6', label: 'Children in School' }
      ],
      category: 'farmer',
      joinDate: '2021',
      featured: true
    },
    {
      id: 2,
      name: 'Mama Risper Nasimiyu',
      location: 'Kakamega County',
      county: 'Kakamega',
      region: 'Western',
      tribe: 'Luhya',
      role: 'Vegetable Farmer & Women Group Leader',
      image: '/images/farmer-luhya2.jpg',
      quote: 'Khusio mwalo, olime khu Mzuri! Sibula obulayi buli tsisubha. (Since I started using Mzuri, my vegetables sell out before I reach the market!)',
      rating: 5,
      story: 'I chair the Shibuli Women Farmers Group with 45 members. Mzuri Organics trained us on organic vegetable farming and now we supply hotels in Kakamega town. Our sukuma wiki (kale) is so fresh that customers come directly to our farms. I\'ve built a permanent house from this farming!',
      results: [
        { icon: 'fas fa-female', value: '45', label: 'Women Empowered' },
        { icon: 'fas fa-home', value: 'Built', label: 'Permanent House' },
        { icon: 'fas fa-leaf', value: 'Organic', label: 'Certified' }
      ],
      category: 'farmer',
      joinDate: '2020',
      featured: true
    },
    {
      id: 3,
      name: 'John Simiyu',
      location: 'Trans Nzoia County',
      county: 'Trans Nzoia',
      region: 'Rift Valley',
      tribe: 'Luhya',
      role: 'Large-Scale Maize Farmer',
      image: '/images/farmer-luhya3.jpg',
      quote: 'Kitale is the breadbasket, but Mzuri made it my goldmine! 100 acres of pure organic success.',
      rating: 5,
      story: 'I farm 100 acres in Kitale. When I switched to Mzuri Organics fertilizers, my neighbors thought I was crazy. Now they\'re the ones asking for my secret. My production costs dropped by 40% while yields doubled. I\'m now supplying maize flour mills across the region.',
      results: [
        { icon: 'fas fa-chart-line', value: '100%', label: 'Yield Increase' },
        { icon: 'fas fa-coins', value: '40%', label: 'Cost Reduction' },
        { icon: 'fas fa-truck', value: '50 tons', label: 'Monthly Supply' }
      ],
      category: 'farmer',
      joinDate: '2019',
      featured: false
    },

    // ===== RIFT VALLEY - KALENJIN =====
    {
      id: 4,
      name: 'Kipchumba Rono',
      location: 'Uasin Gishu County',
      county: 'Uasin Gishu',
      region: 'Rift Valley',
      tribe: 'Kalenjin',
      role: 'Dairy & Fodder Farmer',
      image: '/images/farmer-kalenjin1.jpg',
      quote: 'Barak kelya Mzuri! Chepng\'obik komiech ama konyoe. (Mzuri is a blessing! My cows are healthier and produce more milk.)',
      rating: 5,
      story: 'I have 25 dairy cows in Eldoret. My biggest challenge was quality fodder. Mzuri Organics introduced me to their fodder solutions and organic supplements. My milk production increased from 15 liters to 25 liters per cow daily. I now supply to Brookside Dairy with premium prices.',
      results: [
        { icon: 'fas fa-cow', value: '25', label: 'Dairy Cows' },
        { icon: 'fas fa-tint', value: '25L', label: 'Milk per Cow' },
        { icon: 'fas fa-star', value: 'Premium', label: 'Quality Grade' }
      ],
      category: 'farmer',
      joinDate: '2022',
      featured: true
    },
    {
      id: 5,
      name: 'Chepkorir Jelagat',
      location: 'Nandi County',
      county: 'Nandi',
      region: 'Rift Valley',
      tribe: 'Kalenjin',
      role: 'Tea Farmer',
      image: '/images/farmer-kalenjin2.jpg',
      quote: 'Ng\'ale ne bosie Mzuri, igei chaiyok che bo mosororin. (Since using Mzuri, my tea leaves are always fresh and high-quality.)',
      rating: 5,
      story: 'Tea farming in Nandi Hills is competitive. My leaves fetch premium prices at the factory because of their quality. Mzuri Organics taught me sustainable farming that keeps my soil healthy year-round. My children are now in university because of tea!',
      results: [
        { icon: 'fas fa-mountain', value: 'Premium', label: 'Tea Grade' },
        { icon: 'fas fa-graduation-cap', value: '3', label: 'Children in Uni' },
        { icon: 'fas fa-calendar', value: '12 Years', label: 'Sustainable' }
      ],
      category: 'farmer',
      joinDate: '2018',
      featured: false
    },
    {
      id: 6,
      name: 'Kimutai Langat',
      location: 'Kericho County',
      county: 'Kericho',
      region: 'Rift Valley',
      tribe: 'Kalenjin',
      role: 'Horticulture Farmer',
      image: '/images/farmer-kalenjin3.jpg',
      quote: 'Kipsigis elders say a man who feeds his community is a chief. Mzuri helped me become that man.',
      rating: 5,
      story: 'I grow tomatoes, onions, and cabbages in Kericho. Before Mzuri, I struggled with pests and poor soil. Their organic solutions changed everything. I now supply all the local schools in my area and have employed 10 youth from my village.',
      results: [
        { icon: 'fas fa-school', value: '5', label: 'Schools Supplied' },
        { icon: 'fas fa-users', value: '10', label: 'Youth Employed' },
        { icon: 'fas fa-chart-line', value: '300%', label: 'Production' }
      ],
      category: 'farmer',
      joinDate: '2021',
      featured: true
    },

    // ===== NYANZA - KISII/LUO =====
    {
      id: 7,
      name: 'Omondi Odhiambo',
      location: 'Kisumu County',
      county: 'Kisumu',
      region: 'Nyanza',
      tribe: 'Luo',
      role: 'Fish Farmer',
      image: '/images/farmer-luo1.jpg',
      quote: 'Rech maga koro dongo gi maber! Mzuri oseyie ni anyalo chido rech e ot dala. (My fish now grow bigger! Mzuri has enabled me to farm fish at home.)',
      rating: 5,
      story: 'I started with 500 fingerlings in Kisumu. Mzuri Organics provided me with organic fish feed supplements that doubled my harvest. I now have 10 ponds and supply fish to hotels in Kisumu city. My wife and I have trained 30 other youth in fish farming.',
      results: [
        { icon: 'fas fa-fish', value: '10', label: 'Fish Ponds' },
        { icon: 'fas fa-hotel', value: '15', label: 'Hotel Clients' },
        { icon: 'fas fa-chart-line', value: '200%', label: 'Growth' }
      ],
      category: 'farmer',
      joinDate: '2022',
      featured: true
    },
    {
      id: 8,
      name: 'Nyakundi Mogaka',
      location: 'Kisii County',
      county: 'Kisii',
      region: 'Nyanza',
      tribe: 'Kisii',
      role: 'Banana & Avocado Farmer',
      image: '/images/farmer-kisii1.jpg',
      quote: 'Erio riaye! Maboko ase nchoka. (It\'s a miracle! My bananas have multiplied.)',
      rating: 5,
      story: 'Kisii is known for bananas, but mine are now famous across the county. Mzuri Organics gave me the knowledge to transition to organic farming. My avocado trees produce fruits year-round. I\'ve bought a plot in Ogembo town from my farming proceeds.',
      results: [
        { icon: 'fas fa-tree', value: '500', label: 'Banana Stools' },
        { icon: 'fas fa-home', value: 'Bought', label: 'Plot of Land' },
        { icon: 'fas fa-truck', value: '2 trucks', label: 'Weekly Sales' }
      ],
      category: 'farmer',
      joinDate: '2020',
      featured: false
    },

    // ===== CUSTOMER SUCCESS STORIES =====
    {
      id: 9,
      name: 'Mama Alice Mutenyo',
      location: 'Bungoma Town',
      county: 'Bungoma',
      region: 'Western',
      tribe: 'Luhya',
      role: 'Restaurant Owner',
      image: '/images/customer-luhya1.jpg',
      quote: 'My customers travel from as far as Kitale just to eat my vegetables. That\'s the Mzuri difference!',
      rating: 5,
      story: 'I run "Mama Alice Hotel" in Bungoma town. Since I started buying all my produce from Mzuri Organics farmers, my business has tripled. Customers specifically ask for my organic sukuma wiki and managu. I now employ 5 women from the neighborhood.',
      results: [
        { icon: 'fas fa-store', value: '300%', label: 'Business Growth' },
        { icon: 'fas fa-users', value: '5', label: 'Women Employed' },
        { icon: 'fas fa-star', value: '4.9', label: 'Customer Rating' }
      ],
      category: 'customer',
      joinDate: '2021',
      featured: true
    },
    {
      id: 10,
      name: 'Kiprotich Arap Sugut',
      location: 'Eldoret Town',
      county: 'Uasin Gishu',
      region: 'Rift Valley',
      tribe: 'Kalenjin',
      role: 'Organic Food Store Owner',
      image: '/images/customer-kalenjin1.jpg',
      quote: 'Eldoret\'s health-conscious community trusts my store because I trust Mzuri Organics.',
      rating: 5,
      story: 'I opened "Healthy Basket" in Eldoret CBD two years ago. Sourcing exclusively from Mzuri Organics verified farmers has built my reputation. I now have a waiting list of customers for organic vegetables. I\'m opening a second branch in Kitengela.',
      results: [
        { icon: 'fas fa-store', value: '2', label: 'Branches' },
        { icon: 'fas fa-users', value: '1,000+', label: 'Regular Customers' },
        { icon: 'fas fa-trophy', value: 'Award', label: 'Best Organic Store' }
      ],
      category: 'customer',
      joinDate: '2022',
      featured: false
    },

    // ===== PARTNER STORIES =====
    {
      id: 11,
      name: 'Hon. James Kemboi',
      location: 'Marakwet East',
      county: 'Elgeyo Marakwet',
      region: 'Rift Valley',
      tribe: 'Kalenjin',
      role: 'Community Leader & Partner',
      image: '/images/partner-kalenjin1.jpg',
      quote: 'Bringing Mzuri Organics to my constituency is the best decision I\'ve made for my people.',
      rating: 5,
      story: 'As a community leader, I saw our youth migrating to cities for work. I partnered with Mzuri Organics to train 200 youth in organic farming. Now they\'re earning more in their villages than they would in cities. We\'ve reduced unemployment by 40% in two years.',
      results: [
        { icon: 'fas fa-users', value: '200', label: 'Youth Trained' },
        { icon: 'fas fa-chart-line', value: '40%', label: 'Unemployment Down' },
        { icon: 'fas fa-handshake', value: 'Partner', label: 'Community Impact' }
      ],
      category: 'partner',
      joinDate: '2021',
      featured: true
    },
    {
      id: 12,
      name: 'Dr. Christine Akinyi',
      location: 'Kakamega Town',
      county: 'Kakamega',
      region: 'Western',
      tribe: 'Luhya',
      role: 'Agronomist & Extension Officer',
      image: '/images/partner-luhya1.jpg',
      quote: 'I\'ve worked in agriculture for 20 years. Mzuri Organics is the real deal for our farmers.',
      rating: 5,
      story: 'I partner with Mzuri Organics to provide training to farmers across Western region. Their commitment to organic methods and farmer success is unmatched. Together, we\'ve helped over 1,000 farmers transition to profitable organic farming.',
      results: [
        { icon: 'fas fa-graduation-cap', value: '1,000+', label: 'Farmers Trained' },
        { icon: 'fas fa-calendar', value: '20 Years', label: 'Experience' },
        { icon: 'fas fa-leaf', value: '50+', label: 'Partner Groups' }
      ],
      category: 'partner',
      joinDate: '2020',
      featured: true
    }
  ];

  filteredTestimonials: Testimonial[] = this.testimonials;

  filterTestimonials(category: string) {
    this.activeCategory = category;
    this.applyFilters();
  }

  filterByRegion(region: string) {
    this.activeRegion = region;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.testimonials;

    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(t => t.category === this.activeCategory);
    }

    if (this.activeRegion !== 'all') {
      filtered = filtered.filter(t => t.region === this.activeRegion);
    }

    this.filteredTestimonials = filtered;
  }

  getRatingStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getCategoryIcon(category: string): string {
    switch(category) {
      case 'farmer': return 'fas fa-tractor';
      case 'customer': return 'fas fa-shopping-bag';
      case 'partner': return 'fas fa-handshake';
      default: return 'fas fa-star';
    }
  }

  getRegionIcon(region: string): string {
    switch(region) {
      case 'Western': return 'fas fa-mountain';
      case 'Rift Valley': return 'fas fa-mountain-sun';
      case 'Nyanza': return 'fas fa-water';
      default: return 'fas fa-map-marker-alt';
    }
  }

  getTribeIcon(tribe: string): string {
    switch(tribe) {
      case 'Luhya': return 'fas fa-drumstick-bite';
      case 'Kalenjin': return 'fas fa-cow';
      case 'Kisii': return 'fas fa-tree';
      case 'Luo': return 'fas fa-fish';
      default: return 'fas fa-user';
    }
  }

  getRegionColor(region: string): string {
    switch(region) {
      case 'Western': return '#88c431'; // Green
      case 'Rift Valley': return '#d49a42'; // Gold
      case 'Nyanza': return '#25D366'; // WhatsApp green (for water)
      default: return '#88c431';
    }
  }
}