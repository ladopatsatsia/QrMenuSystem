import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-object-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="menu-page" *ngIf="object">
      <header class="hero-shell">
        <div class="hero-cover">
          <img
            class="hero-cover__image"
            [src]="getFullUrl(object.imageUrl)"
            [alt]="object.name">
          <div class="hero-cover__overlay"></div>
        </div>

        <div class="hero-content">
          <div class="hero-content__inner">
            <h1 class="hero-title">{{ object.name }}</h1>

            <div class="hero-meta" *ngIf="object.address || object.description">
              <div class="hero-meta__pill" *ngIf="object.address">
                <i class="bi bi-geo-alt"></i>
                <span>{{ object.address }}</span>
              </div>
              <div class="hero-meta__pill" *ngIf="object.description">
                <i class="bi bi-journal-text"></i>
                <span>{{ object.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="menu-tabs-wrap" *ngIf="selectedMenu" [class.menu-tabs-wrap--elevated]="isTabsElevated">
        <div class="menu-tabs-wrap__inner">
          <div class="menu-topbar">
            <button type="button" class="menu-back-button" (click)="backToCategories()">
              <i class="bi bi-arrow-left"></i>
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      <main class="menu-content">
        <div class="menu-section" *ngIf="!selectedMenu">
          <div class="menu-section__eyebrow">Categories</div>
          <h2 class="menu-section__title">Choose a category</h2>
          <p class="menu-section__hint">Tap a category to explore the dishes inside.</p>
        </div>

        <div class="category-list" *ngIf="!selectedMenu">
          <button
            *ngFor="let menu of menus"
            type="button"
            class="category-card"
            (click)="openCategory(menu)">
            <div class="category-card__background">
              <img
                *ngIf="menu.imageUrl"
                [src]="getFullUrl(menu.imageUrl)"
                [alt]="menu.name"
                class="category-card__image">
              <div class="category-card__fallback" *ngIf="!menu.imageUrl"></div>
              <div class="category-card__overlay"></div>
            </div>

            <div class="category-card__content">
              <h3 class="category-card__title">{{ menu.name }}</h3>
            </div>
          </button>
        </div>

        <div class="menu-section" *ngIf="selectedMenu">
          <div class="category-hero">
            <img
              *ngIf="selectedMenu.imageUrl"
              [src]="getFullUrl(selectedMenu.imageUrl)"
              [alt]="selectedMenu.name"
              class="category-hero__image">
            <div class="category-hero__fallback" *ngIf="!selectedMenu.imageUrl"></div>
            <div class="category-hero__overlay"></div>
            <div class="category-hero__content">
              <div class="menu-section__eyebrow">Category</div>
              <h2 class="menu-section__title">{{ selectedMenu.name }}</h2>
            </div>
          </div>
        </div>

        <div class="item-list" *ngIf="selectedMenu">
          <div *ngFor="let item of items" class="menu-item" (click)="openItemDetails(item)">
            <div class="menu-item__inner">
              <div class="menu-item__content">
                <div class="menu-item__copy">
                  <h5 class="menu-item__name">{{ item.name }}</h5>
                  <p class="menu-item__description" *ngIf="item.description">{{ item.description }}</p>
                  <div class="menu-item__price-row">
                    <span class="menu-item__price">{{ item.price | currency }}</span>
                  </div>
                </div>
                <div class="menu-item__media" *ngIf="item.imageUrl">
                  <img [src]="getFullUrl(item.imageUrl)" class="menu-item__image" [alt]="item.name">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="selectedMenu && items.length === 0" class="empty-state">
          <div class="empty-state__icon">
            <i class="bi bi-journal-x"></i>
          </div>
          <p class="empty-state__text">No items available in this category yet.</p>
        </div>
      </main>

      <!-- Dish Details Modal -->
      <div class="item-modal-overlay" *ngIf="selectedItem" (click)="closeItemDetails()">
        <div class="item-modal" (click)="$event.stopPropagation()">
          <button class="item-modal__close" (click)="closeItemDetails()">
            <i class="bi bi-x-lg"></i>
          </button>
          
          <div class="item-modal__media" *ngIf="selectedItem.imageUrl">
            <img [src]="getFullUrl(selectedItem.imageUrl)" [alt]="selectedItem.name">
          </div>
          
          <div class="item-modal__content">
            <div class="item-modal__header">
              <h2 class="item-modal__title">{{ selectedItem.name }}</h2>
              <span class="item-modal__price">{{ selectedItem.price | currency }}</span>
            </div>
            
            <div class="item-modal__body">
              <h4 class="item-modal__section-title">აღწერა</h4>
              <p class="item-modal__description">{{ selectedItem.description || 'აღწერა არ არის მითითებული' }}</p>
            </div>
            
            <div class="item-modal__footer">
              <button class="item-modal__btn-close" (click)="closeItemDetails()">დახურვა</button>
            </div>
          </div>
        </div>
      </div>

      <footer class="menu-footer">
        <p class="menu-footer__text">Powered by QR Menu</p>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background:
        linear-gradient(180deg, #fffaf6 0%, #ffffff 32%, #fffdf9 100%);
      color: #14171f;
      font-family: Inter, "Segoe UI", sans-serif;
    }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .menu-page {
      min-height: 100vh;
      padding-bottom: 1.5rem;
    }

    .hero-shell {
      position: relative;
      min-height: 280px;
    }

    .hero-cover {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .hero-cover__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transform: scale(1.02);
    }

    .hero-cover__overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(14, 16, 20, 0.18) 0%, rgba(14, 16, 20, 0.48) 55%, rgba(14, 16, 20, 0.78) 100%),
        linear-gradient(0deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0));
    }

    .hero-content {
      position: relative;
      min-height: 280px;
      display: flex;
      align-items: flex-end;
      padding: 1rem 0.9rem 0.9rem;
    }

    .hero-content__inner {
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
      color: #ffffff;
    }

    .hero-title {
      margin: 0;
      font-size: 2rem;
      font-weight: 800;
      line-height: 0.98;
      letter-spacing: -0.04em;
      text-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }

    .hero-meta {
      display: flex;
      gap: 0.65rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .hero-meta__pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      width: 100%;
      padding: 0.65rem 0.9rem;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.14);
      backdrop-filter: blur(12px);
      font-size: 0.86rem;
      line-height: 1.3;
      color: rgba(255, 255, 255, 0.96);
    }

    .hero-meta__pill i {
      font-size: 0.95rem;
    }

    .menu-tabs-wrap {
      position: sticky;
      top: 0;
      z-index: 20;
      padding: 0.75rem 0 0.7rem;
      background: rgba(255, 250, 245, 0.92);
      backdrop-filter: blur(18px);
      transition: box-shadow 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
    }

    .menu-tabs-wrap--elevated {
      box-shadow: 0 8px 26px rgba(27, 31, 44, 0.08);
      border-bottom: 1px solid rgba(223, 227, 236, 0.7);
    }

    .menu-tabs-wrap__inner {
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
      padding: 0 0.9rem;
    }

    .menu-topbar {
      display: flex;
      align-items: center;
      min-height: 46px;
    }

    .menu-back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: 0;
      padding: 0.75rem 0.95rem;
      border-radius: 999px;
      background: #ffffff;
      color: #202532;
      font-size: 0.92rem;
      font-weight: 700;
      box-shadow: 0 6px 16px rgba(18, 24, 40, 0.06);
      transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
    }

    .menu-back-button:hover {
      background: #fff4ea;
      box-shadow: 0 10px 22px rgba(18, 24, 40, 0.08);
    }

    .menu-back-button:active {
      transform: scale(0.98);
    }

    .menu-content {
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
      padding: 1rem 0.9rem 0;
    }

    .menu-section {
      padding: 0.5rem 0 0.25rem;
    }

    .menu-section__eyebrow {
      margin-bottom: 0.45rem;
      color: #f97316;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .menu-section__title {
      margin: 0;
      font-size: 1.45rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #ffffff;
    }

    .menu-section__hint {
      margin: 0.4rem 0 0;
      font-size: 0.88rem;
      color: #6a7282;
      line-height: 1.45;
    }

    .category-list {
      display: grid;
      gap: 0.8rem;
      padding: 0.85rem 0 0;
    }

    .category-card {
      position: relative;
      width: 100%;
      min-height: 116px;
      padding: 0;
      border: 0;
      border-radius: 20px;
      overflow: hidden;
      text-align: left;
      box-shadow: 0 14px 28px rgba(20, 26, 39, 0.12);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .category-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 18px 34px rgba(20, 26, 39, 0.16);
    }

    .category-card:active {
      transform: scale(0.99);
    }

    .category-card__background {
      position: absolute;
      inset: 0;
    }

    .category-card__image,
    .category-card__fallback {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .category-card__fallback {
      background:
        linear-gradient(135deg, #f97316 0%, #fb923c 45%, #fdba74 100%);
    }

    .category-card__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(17, 20, 26, 0.18) 0%, rgba(17, 20, 26, 0.62) 100%);
    }

    .category-card__content {
      position: relative;
      min-height: 116px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .category-card__title {
      margin: 0;
      color: #ffffff;
      font-size: 1.18rem;
      font-weight: 800;
      line-height: 1.2;
      text-align: center;
      text-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
      letter-spacing: -0.02em;
    }

    .category-hero {
      position: relative;
      min-height: 146px;
      border-radius: 22px;
      overflow: hidden;
      box-shadow: 0 16px 32px rgba(20, 26, 39, 0.16);
      margin-bottom: 0.35rem;
    }

    .category-hero__image,
    .category-hero__fallback {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .category-hero__fallback {
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
    }

    .category-hero__overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.18) 0%, rgba(15, 23, 42, 0.72) 100%);
    }

    .category-hero__content {
      position: relative;
      min-height: 146px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1rem;
    }

    .category-hero .menu-section__eyebrow {
      color: rgba(255, 255, 255, 0.82);
      margin-bottom: 0.3rem;
    }

    .item-list {
      display: grid;
      gap: 0.75rem;
      padding: 0.8rem 0 0;
    }

    .menu-item {
      min-width: 0;
    }

    .menu-item__inner {
      padding: 0.92rem;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.98);
      border: 1px solid rgba(238, 240, 244, 0.95);
      box-shadow: 0 10px 24px rgba(20, 26, 39, 0.05);
    }

    .menu-item__content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.9rem;
      min-width: 0;
    }

    .menu-item__copy {
      min-width: 0;
      flex: 1 1 auto;
    }

    .menu-item__name {
      margin: 0;
      font-size: 0.98rem;
      font-weight: 800;
      line-height: 1.28;
      color: #151922;
    }

    .menu-item__description {
      margin: 0.4rem 0 0;
      color: #6d7483;
      font-size: 0.82rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .menu-item__price-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.8rem;
    }

    .menu-item__price {
      display: inline-flex;
      align-items: center;
      padding: 0.42rem 0.66rem;
      border-radius: 999px;
      background: #fff3e8;
      color: #f16a1b;
      font-size: 0.9rem;
      font-weight: 800;
      letter-spacing: -0.01em;
    }

    .menu-item__media {
      width: 96px;
      height: 96px;
      border-radius: 16px;
      overflow: hidden;
      flex: 0 0 96px;
      background: #f4f6f8;
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .menu-item__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .empty-state {
      margin-top: 1rem;
      padding: 2rem 1.25rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(237, 240, 245, 0.95);
      box-shadow: 0 12px 30px rgba(20, 26, 39, 0.04);
      text-align: center;
    }

    .empty-state__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      margin-bottom: 0.9rem;
      border-radius: 18px;
      background: #fff3e8;
      color: #f16a1b;
      font-size: 1.5rem;
    }

    .empty-state__text {
      margin: 0;
      color: #707887;
      font-size: 0.95rem;
    }

    .menu-footer {
      padding: 1.25rem 0.9rem 0;
      text-align: center;
    }

    .menu-footer__text {
      margin: 0;
      color: #8a92a2;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    @media (max-width: 399px) {
      .hero-shell,
      .hero-content {
        min-height: 250px;
      }

      .hero-title {
        font-size: 1.7rem;
      }

      .hero-meta__pill {
        padding: 0.58rem 0.75rem;
        font-size: 0.8rem;
        line-height: 1.4;
      }

      .menu-tab {
        padding: 0.7rem 0.82rem;
        font-size: 0.82rem;
      }

      .menu-item__inner {
        padding: 0.82rem;
      }

      .menu-item__content {
        gap: 0.7rem;
      }

      .menu-item__media {
        width: 68px;
        height: 68px;
        border-radius: 12px;
        flex-basis: 68px;
      }

      .menu-item__name {
        font-size: 0.94rem;
      }

      .menu-item__description {
        font-size: 0.8rem;
        max-width: 20ch;
      }

      .menu-item__price {
        font-size: 0.92rem;
      }

      .category-card {
        min-height: 104px;
      }

      .category-card__content {
        min-height: 104px;
        padding: 0.85rem;
      }

      .category-card__title {
        font-size: 1.06rem;
      }

      .category-hero,
      .category-hero__content {
        min-height: 132px;
      }
    }

    /* Modal Styles */
    .item-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.2s ease-out;
    }

    .item-modal {
      position: relative;
      width: 100%;
      max-width: 400px;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(20px) scale(0.98); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .item-modal__close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 36px;
      height: 36px;
      border-radius: 999px;
      border: 0;
      background: rgba(255, 255, 255, 0.9);
      color: #1a1e26;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s;
    }

    .item-modal__close:active { transform: scale(0.9); }

    .item-modal__media {
      width: 100%;
      height: 240px;
      overflow: hidden;
    }

    .item-modal__media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-modal__content {
      padding: 1.5rem;
    }

    .item-modal__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }

    .item-modal__title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 800;
      color: #1a1e26;
      letter-spacing: -0.02em;
    }

    .item-modal__price {
      font-size: 1.15rem;
      font-weight: 800;
      color: #f16a1b;
      padding: 0.4rem 0.8rem;
      background: #fff3e8;
      border-radius: 999px;
      white-space: nowrap;
    }

    .item-modal__section-title {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #f97316;
      margin: 0 0 0.5rem;
    }

    .item-modal__description {
      margin: 0;
      font-size: 0.92rem;
      line-height: 1.6;
      color: #4b5563;
      white-space: pre-wrap;
    }

    .item-modal__footer {
      margin-top: 2rem;
    }

    .item-modal__btn-close {
      width: 100%;
      padding: 0.9rem;
      border: 0;
      border-radius: 16px;
      background: #f3f4f6;
      color: #4b5563;
      font-weight: 700;
      font-size: 0.95rem;
      transition: background-color 0.2s;
    }
    .item-modal__btn-close:active { background: #e5e7eb; }
  `]
})
export class ObjectDetailComponent implements OnInit, AfterViewInit {
  object: any;
  menus: any[] = [];
  selectedMenu: any;
  items: any[] = [];
  apiUrl = environment.baseUrl;
  isTabsElevated = false;
  selectedItem: any = null;

  getFullUrl(url: string | null | undefined): string {
    if (!url) return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80';
    if (url.startsWith('http')) return url;
    return `${this.apiUrl}${url}`;
  }

  @ViewChild('menuTabsScroller') menuTabsScroller?: ElementRef<HTMLDivElement>;
  @ViewChildren('menuTabButton') menuTabButtons?: QueryList<ElementRef<HTMLButtonElement>>;

  private tabRailScrollTimeout?: number;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngAfterViewInit() {
    this.syncStickyState();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.get(`/public/objects/${id}`).subscribe(res => {
      this.object = res.resultData;
    });
    this.api.get(`/public/objects/${id}/menus`).subscribe(res => {
      this.menus = res.resultData;
    });
  }

  openCategory(menu: any) {
    this.selectMenu(menu);
  }

  selectMenu(menu: any) {
    this.selectedMenu = menu;
    this.api.get(`/public/menus/${menu.id}/items`).subscribe(res => {
      this.items = res.resultData;
    });
  }

  backToCategories() {
    this.selectedMenu = null;
    this.items = [];
  }

  openItemDetails(item: any) {
    this.selectedItem = item;
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeItemDetails() {
    this.selectedItem = null;
    document.body.style.overflow = '';
  }

  onTabRailScroll() {
    if (this.tabRailScrollTimeout) {
      window.clearTimeout(this.tabRailScrollTimeout);
    }

    this.tabRailScrollTimeout = window.setTimeout(() => {
      this.updateActiveMenuFromRailPosition();
    }, 90);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.syncStickyState();
  }

  private syncStickyState() {
    this.isTabsElevated = window.scrollY > 8;
  }

  private scrollActiveTabIntoView() {
    window.setTimeout(() => {
      const scroller = this.menuTabsScroller?.nativeElement;
      const buttons = this.menuTabButtons?.toArray() ?? [];
      const selectedIndex = this.menus.findIndex(menu => menu.id === this.selectedMenu?.id);
      const selectedButton = selectedIndex >= 0 ? buttons[selectedIndex]?.nativeElement : undefined;

      if (!scroller || !selectedButton) {
        return;
      }

      const targetLeft = selectedButton.offsetLeft - (scroller.clientWidth - selectedButton.clientWidth) / 2;
      scroller.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth'
      });
    });
  }

  private updateActiveMenuFromRailPosition() {
    const scroller = this.menuTabsScroller?.nativeElement;
    const buttons = this.menuTabButtons?.toArray() ?? [];

    if (!scroller || buttons.length === 0) {
      return;
    }

    const railCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    buttons.forEach((buttonRef, index) => {
      const button = buttonRef.nativeElement;
      const buttonCenter = button.offsetLeft + button.clientWidth / 2;
      const distance = Math.abs(buttonCenter - railCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    const nearestMenu = this.menus[nearestIndex];
    if (nearestMenu && nearestMenu.id !== this.selectedMenu?.id) {
      this.selectMenu(nearestMenu);
    }
  }
}
