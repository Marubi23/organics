// src/app/services/mpesa.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentRequest {
  phoneNumber: string;
  amount: number;
  accountReference?: string;
  transactionDesc?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  checkoutRequestID?: string;
  merchantRequestID?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MpesaService {
  private apiUrl = 'http://localhost:5000/api/mpesa';

  constructor(private http: HttpClient) {}

  initiatePayment(paymentData: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/initiate-payment`, paymentData);
  }
}