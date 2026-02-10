import { Injectable, signal } from '@angular/core';

export interface LoadingConfig {
  type?: 'pulse' | 'spin' | 'dual';
  size?: 'sm' | 'md' | 'lg';
  backdrop?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading = signal<boolean>(false);
  private _config = signal<LoadingConfig>({});
  
  readonly isLoading = this._isLoading.asReadonly();
  readonly config = this._config.asReadonly();

  show(config: LoadingConfig = {}): void {
    const defaultConfig: LoadingConfig = {
      type: 'dual',
      size: 'md',
      backdrop: true,
      ...config
    };
    
    this._config.set(defaultConfig);
    this._isLoading.set(true);
  }

  hide(): void {
    this._isLoading.set(false);
    this._config.set({});
  }

  showFullPage(): void {
    this.show({
      type: 'dual',
      size: 'lg',
      backdrop: true
    });
  }

  showInline(): void {
    this.show({
      type: 'spin',
      size: 'md',
      backdrop: false
    });
  }
}