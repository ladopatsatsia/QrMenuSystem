import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">{{ translate('DASHBOARD_TITLE') }}</h1>
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ translate('DASHBOARD_WELCOME') }}</h5>
              <p class="card-text">You can manage your venues, menus, and dishes using the side menu.</p>
              <a routerLink="/admin/objects" class="btn btn-primary">{{ translate('SIDEBAR_MANAGE_VENUES') }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class DashboardComponent {
  constructor(private authService: AuthService, private translationService: TranslationService) {}
  
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  logout() { this.authService.logout(); }
}
