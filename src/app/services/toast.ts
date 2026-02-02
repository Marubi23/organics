// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  private currentId = 0;

  toasts$: Observable<Toast[]> = this.toasts.asObservable();

  constructor() {}

  /**
   * Show success toast
   */
  showSuccess(message: string, duration: number = 3000): void {
    this.addToast({
      id: ++this.currentId,
      type: 'success',
      message,
      duration,
      icon: 'fas fa-check-circle'
    });
  }

  /**
   * Show error toast
   */
  showError(message: string, duration: number = 4000): void {
    this.addToast({
      id: ++this.currentId,
      type: 'error',
      message,
      duration,
      icon: 'fas fa-exclamation-circle'
    });
  }

  /**
   * Show warning toast
   */
  showWarning(message: string, duration: number = 3500): void {
    this.addToast({
      id: ++this.currentId,
      type: 'warning',
      message,
      duration,
      icon: 'fas fa-exclamation-triangle'
    });
  }

  /**
   * Show info toast
   */
  showInfo(message: string, duration: number = 3000): void {
    this.addToast({
      id: ++this.currentId,
      type: 'info',
      message,
      duration,
      icon: 'fas fa-info-circle'
    });
  }

  /**
   * Add a new toast
   */
  private addToast(toast: Toast): void {
    const currentToasts = this.toasts.value;
    this.toasts.next([...currentToasts, toast]);

    // Auto-remove after duration
    setTimeout(() => {
      this.removeToast(toast.id);
    }, toast.duration);
  }

  /**
   * Remove toast by ID
   */
  removeToast(id: number): void {
    const currentToasts = this.toasts.value.filter(toast => toast.id !== id);
    this.toasts.next(currentToasts);
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    this.toasts.next([]);
  }

  /**
   * Get toast color based on type
   */
  getToastColor(type: Toast['type']): string {
    const colors = {
      success: 'hsl(125, 89%, 31%)', // Green
      error: '#e53e3e', // Red
      warning: '#f39c12', // Orange
      info: '#3498db' // Blue
    };
    return colors[type];
  }

  /**
   * Get toast background color based on type
   */
  getToastBackground(type: Toast['type']): string {
    const backgrounds = {
      success: 'linear-gradient(135deg, hsla(125, 89%, 31%, 0.1), white)',
      error: 'linear-gradient(135deg, rgba(229, 62, 62, 0.1), white)',
      warning: 'linear-gradient(135deg, rgba(243, 156, 18, 0.1), white)',
      info: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), white)'
    };
    return backgrounds[type];
  }
}