import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row g-4">
        <div class="col-md-7">
          <h1 class="mb-4 fw-bold text-dark">{{ translate('DASHBOARD_TITLE') }}</h1>
          <div class="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
            <div class="card-body p-4">
              <h5 class="card-title fw-bold text-primary mb-3">{{ translate('DASHBOARD_WELCOME') }}</h5>
              <p class="card-text text-muted">You can manage your venues, menus, and dishes using the side menu.</p>
              <a routerLink="/admin/objects" class="btn btn-primary rounded-pill px-4 shadow-sm mt-2">{{ translate('SIDEBAR_MANAGE_VENUES') }}</a>
            </div>
          </div>
        </div>

        <!-- Change Password Section -->
        <div class="col-md-5">
          <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div class="card-header bg-white border-0 pt-4 pb-0 px-4">
              <h5 class="fw-bold text-dark mb-0">
                <i class="bi bi-shield-lock me-2 text-primary"></i>{{ translate('DASHBOARD_CHANGE_PASSWORD') }}
              </h5>
            </div>
            <div class="card-body p-4">
              <div class="mb-3">
                <label class="form-label small text-muted text-uppercase fw-bold">{{ translate('PASSWORD_CURRENT') }}</label>
                <input type="password" [(ngModel)]="currentPassword" class="form-control rounded-3 border-2">
              </div>
              <div class="mb-3">
                <label class="form-label small text-muted text-uppercase fw-bold">{{ translate('PASSWORD_NEW') }}</label>
                <input type="password" [(ngModel)]="newPassword" class="form-control rounded-3 border-2">
              </div>
              <div class="mb-4">
                <label class="form-label small text-muted text-uppercase fw-bold">{{ translate('PASSWORD_CONFIRM') }}</label>
                <input type="password" [(ngModel)]="confirmPassword" class="form-control rounded-3 border-2">
              </div>

              <div *ngIf="message" class="alert mb-4 py-2 small border-0 rounded-3" [ngClass]="isError ? 'alert-danger' : 'alert-success'">
                <i class="bi" [ngClass]="isError ? 'bi-exclamation-circle' : 'bi-check-circle'"></i> {{ message }}
              </div>

              <button class="btn btn-primary w-100 rounded-pill py-2 shadow-sm fw-bold" 
                      (click)="changePassword()" 
                      [disabled]="isSubmitting || !currentPassword || !newPassword || newPassword !== confirmPassword">
                <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ translate('BUTTON_CHANGE_PASSWORD') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class DashboardComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isSubmitting = false;
  message = '';
  isError = false;

  constructor(private authService: AuthService, private translationService: TranslationService) {}
  
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      this.isError = true;
      return;
    }

    this.isSubmitting = true;
    this.message = '';
    const userId = this.authService.currentUserValue?.id;

    if (!userId) {
      this.message = 'User ID not found. Please log in again.';
      this.isError = true;
      this.isSubmitting = false;
      return;
    }

    this.authService.changePassword(userId, this.currentPassword, this.newPassword).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.message = this.translate('PASSWORD_CHANGE_SUCCESS');
        this.isError = false;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.isSubmitting = false;
        this.message = err.error?.resultData?.errors?.[0] || err.error?.errors?.[0] || this.translate('PASSWORD_CHANGE_ERROR');
        this.isError = true;
      }
    });
  }

  logout() { this.authService.logout(); }
}
