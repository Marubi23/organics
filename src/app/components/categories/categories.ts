// categories.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent {
  
  sdgs = [
    { title: 'No Poverty', description: 'Creating new income streams for farmers, youth, and women through buy-back models and waste-to-value enterprises' },
    { title: 'Zero Hunger', description: 'Boosting food security by regenerating soils, increasing yields, and improving crop nutrition through biological and organo-mineral fertilizers' },
    { title: 'Gender Equality', description: 'Empowering women in agriculture through training, leadership roles, and economic opportunities' },
    { title: 'Responsible Consumption', description: 'Transforming organic waste into high-value fertilizers and creating circular, zero-waste farming systems' },
    { title: 'Climate Action', description: 'Reducing emissions, enhancing soil carbon, and building climate-resilient farms through regenerative agriculture' },
    { title: 'Life on Land', description: 'Restoring degraded soils, improving biodiversity, and strengthening ecosystem health with microbe-rich inputs' }
  ];

  constructor(private router: Router) {}

  goToCareers() {
    this.router.navigate(['/careers/graduate-research-assistant']);
  }
}