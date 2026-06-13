import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-job-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-post.html',
  styleUrls: ['./blog-post.css']
})
export class BlogJobPostComponent implements OnInit, OnDestroy {

  currentYear = new Date().getFullYear();
  private countdownInterval: any;

  days = '00';
  hours = '00';
  minutes = '00';
  seconds = '00';

  // ✅ FIXED: correct filenames from your folder
  advertPdfPath = '/pdfs/FF-Bio-Graduate-Research-Assistant-Advert.pdf';
  torPdfPath = '/pdfs/FF-Bio-Graduate-Research-Assistant-ToR.pdf';

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown(): void {
    this.updateCountdown();

    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown(): void {
    const deadline = new Date('June 25, 2026 17:00:00').getTime();
    const now = new Date().getTime();
    const diff = deadline - now;

    if (diff <= 0) {
      this.days = '00';
      this.hours = '00';
      this.minutes = '00';
      this.seconds = '00';

      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
      return;
    }

    const daysVal = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursVal = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesVal = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsVal = Math.floor((diff % (1000 * 60)) / 1000);

    this.days = daysVal.toString().padStart(2, '0');
    this.hours = hoursVal.toString().padStart(2, '0');
    this.minutes = minutesVal.toString().padStart(2, '0');
    this.seconds = secondsVal.toString().padStart(2, '0');
  }

  // ✅ SIMPLE & RELIABLE DOWNLOAD (WORKS ON MOBILE + DESKTOP)
  downloadFile(pdfPath: string, fileName: string): void {
    console.log('Downloading:', pdfPath);

    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = fileName;
    link.target = '_blank';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  copyEmail(): void {
    navigator.clipboard.writeText('hr@mzuriorganics.co.ke');
    alert('Email address copied to clipboard!');
  }
}