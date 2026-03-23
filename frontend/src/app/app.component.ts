import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from './core/services/api.service';
import { TranslationService } from './core/services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router, private api: ApiService, private translationService: TranslationService) {}

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  showSidebar(): boolean {
    return this.router.url.startsWith('/admin') && this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
