import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

type LanguageCode = 'ka' | 'en' | 'ru';

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
            [alt]="getDisplayName(object)">
          <div class="hero-cover__overlay"></div>
        </div>

        <div class="hero-content">
          <div class="hero-content__inner">
            <div class="hero-language-bar" *ngIf="activeLanguages.length > 0">
              <span class="hero-language-bar__label">Menu language</span>
              <div class="hero-language-bar__chips">
                <button
                  *ngFor="let language of activeLanguages"
                  type="button"
                  class="hero-language-chip"
                  [class.hero-language-chip--active]="selectedLanguage === language"
                  (click)="selectLanguage(language)">
                  {{ getLanguageLabel(language) }}
                </button>
              </div>
            </div>

            <h1 class="hero-title">{{ getDisplayName(object) }}</h1>

            <div class="hero-meta" *ngIf="getDisplayAddress(object) || getDisplayDescription(object)">
              <div class="hero-meta__pill" *ngIf="getDisplayAddress(object)">
                <i class="bi bi-geo-alt"></i>
                <span>{{ getDisplayAddress(object) }}</span>
              </div>
              <div class="hero-meta__pill" *ngIf="getDisplayDescription(object)">
                <i class="bi bi-journal-text"></i>
                <span>{{ getDisplayDescription(object) }}</span>
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
        <section class="language-prompt" *ngIf="activeLanguages.length > 0 && !selectedLanguage">
          <div class="menu-section">
            <div class="menu-section__eyebrow menu-section__eyebrow--warm">Step 1</div>
            <h2 class="menu-section__title menu-section__title--dark">Choose your language</h2>
          </div>

          <div class="language-grid">
            <button
              *ngFor="let language of activeLanguages"
              type="button"
              class="language-card"
              (click)="selectLanguage(language)">
              <div class="language-card__badge">{{ getLanguageFlag(language) }}</div>
              <div class="language-card__title">{{ getLanguageLabel(language) }}</div>
              <div class="language-card__subtitle">{{ getLanguageNativeLabel(language) }}</div>
            </button>
          </div>
        </section>

        <section class="menu-section" *ngIf="activeLanguages.length === 0">
          <div class="empty-state">
            <div class="empty-state__icon">
              <i class="bi bi-translate"></i>
            </div>
            <p class="empty-state__text">No active languages are configured for this menu yet.</p>
          </div>
        </section>

        <ng-container *ngIf="selectedLanguage">
          <div class="menu-section" *ngIf="!selectedMenu">
            <div class="menu-section__eyebrow menu-section__eyebrow--warm">Step 2</div>
            <h2 class="menu-section__title menu-section__title--dark">{{ getUiText('chooseCategory') }}</h2>
            <p class="menu-section__hint">{{ getUiText('languageLabel') }}: {{ getLanguageLabel(selectedLanguage) }}</p>
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
                  [alt]="getDisplayName(menu)"
                  class="category-card__image">
                <div class="category-card__fallback" *ngIf="!menu.imageUrl"></div>
                <div class="category-card__overlay"></div>
              </div>

              <div class="category-card__content">
                <h3 class="category-card__title">{{ getDisplayName(menu) }}</h3>
              </div>
            </button>
          </div>

          <div class="menu-section" *ngIf="selectedMenu">
            <div class="category-hero">
              <img
                *ngIf="selectedMenu.imageUrl"
                [src]="getFullUrl(selectedMenu.imageUrl)"
                [alt]="getDisplayName(selectedMenu)"
                class="category-hero__image">
              <div class="category-hero__fallback" *ngIf="!selectedMenu.imageUrl"></div>
              <div class="category-hero__overlay"></div>
              <div class="category-hero__content">
                <div class="menu-section__eyebrow">{{ getUiText('categoryEyebrow') }}</div>
                <h2 class="menu-section__title">{{ getDisplayName(selectedMenu) }}</h2>
                <p class="category-hero__description" *ngIf="getDisplayDescription(selectedMenu)">
                  {{ getDisplayDescription(selectedMenu) }}
                </p>
              </div>
            </div>
          </div>

          <div class="item-list" *ngIf="selectedMenu">
            <div *ngFor="let item of items" class="menu-item" (click)="openItemDetails(item)">
              <div class="menu-item__inner">
                <div class="menu-item__content">
                  <div class="menu-item__copy">
                    <h5 class="menu-item__name">{{ getDisplayName(item) }}</h5>
                    <p class="menu-item__description" *ngIf="getDisplayDescription(item)">{{ getDisplayDescription(item) }}</p>
                    <div class="menu-item__price-row">
                      <span class="menu-item__price">{{ item.price | currency }}</span>
                    </div>
                  </div>
                  <div class="menu-item__media" *ngIf="item.imageUrl">
                    <img [src]="getFullUrl(item.imageUrl)" class="menu-item__image" [alt]="getDisplayName(item)">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="selectedMenu && items.length === 0" class="empty-state">
            <div class="empty-state__icon">
              <i class="bi bi-journal-x"></i>
            </div>
            <p class="empty-state__text">{{ getUiText('noItems') }}</p>
          </div>
        </ng-container>
      </main>

      <div class="item-modal-overlay" *ngIf="selectedItem" (click)="closeItemDetails()">
        <div class="item-modal" (click)="$event.stopPropagation()">
          <button class="item-modal__close" (click)="closeItemDetails()">
            <i class="bi bi-x-lg"></i>
          </button>

          <div class="item-modal__media" *ngIf="selectedItem.imageUrl">
            <img [src]="getFullUrl(selectedItem.imageUrl)" [alt]="getDisplayName(selectedItem)">
          </div>

          <div class="item-modal__content">
            <div class="item-modal__header">
              <h2 class="item-modal__title">{{ getDisplayName(selectedItem) }}</h2>
              <span class="item-modal__price">{{ selectedItem.price | currency }}</span>
            </div>

            <div class="item-modal__body">
              <h4 class="item-modal__section-title">{{ getUiText('descriptionTitle') }}</h4>
              <p class="item-modal__description">{{ getDisplayDescription(selectedItem) || getUiText('noDescription') }}</p>
            </div>

            <div class="item-modal__footer">
              <button class="item-modal__btn-close" (click)="closeItemDetails()">{{ getUiText('close') }}</button>
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
      background: linear-gradient(180deg, #fffaf6 0%, #ffffff 32%, #fffdf9 100%);
      color: #14171f;
      font-family: Inter, "Segoe UI", sans-serif;
    }

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

    .hero-language-bar {
      display: grid;
      gap: 0.55rem;
      margin-bottom: 1rem;
    }

    .hero-language-bar__label {
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.86);
    }

    .hero-language-bar__chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
    }

    .hero-language-chip {
      border: 0;
      border-radius: 999px;
      padding: 0.58rem 0.9rem;
      background: rgba(255, 255, 255, 0.14);
      color: #ffffff;
      font-size: 0.85rem;
      font-weight: 700;
      backdrop-filter: blur(10px);
    }

    .hero-language-chip--active {
      background: #ffffff;
      color: #171b24;
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

    .menu-tabs-wrap__inner,
    .menu-content {
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
      padding: 0 0.9rem;
    }

    .menu-content {
      padding-top: 1rem;
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
    }

    .menu-section {
      padding: 0.5rem 0 0.25rem;
    }

    .menu-section__eyebrow {
      margin-bottom: 0.45rem;
      color: #ffffff;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .menu-section__eyebrow--warm {
      color: #f97316;
    }

    .menu-section__title {
      margin: 0;
      font-size: 1.45rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #ffffff;
    }

    .menu-section__title--dark {
      color: #171b24;
    }

    .menu-section__hint {
      margin: 0.4rem 0 0;
      font-size: 0.88rem;
      color: #6a7282;
      line-height: 1.45;
    }

    .language-grid {
      display: grid;
      gap: 0.8rem;
      padding-top: 1rem;
    }

    .language-card {
      display: grid;
      justify-items: start;
      gap: 0.3rem;
      width: 100%;
      border: 1px solid rgba(237, 240, 245, 0.95);
      border-radius: 22px;
      padding: 1rem;
      background: #ffffff;
      box-shadow: 0 12px 28px rgba(20, 26, 39, 0.05);
      text-align: left;
    }

    .language-card__badge {
      font-size: 1.6rem;
    }

    .language-card__title {
      font-size: 1rem;
      font-weight: 800;
      color: #171b24;
    }

    .language-card__subtitle {
      color: #6a7282;
      font-size: 0.84rem;
    }

    .category-list,
    .item-list {
      display: grid;
      gap: 0.8rem;
      padding-top: 0.85rem;
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
    }

    .category-card__background,
    .category-card__overlay {
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
      background: linear-gradient(135deg, #f97316 0%, #fb923c 45%, #fdba74 100%);
    }

    .category-card__overlay {
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
      text-align: center;
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

    .category-hero__description {
      margin: 0.4rem 0 0;
      color: rgba(255, 255, 255, 0.84);
      font-size: 0.88rem;
      line-height: 1.45;
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
    }

    .menu-item__media {
      width: 96px;
      height: 96px;
      border-radius: 16px;
      overflow: hidden;
      flex: 0 0 96px;
      background: #f4f6f8;
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
    }

    .item-modal {
      position: relative;
      width: 100%;
      max-width: 400px;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
    }

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
      gap: 0.75rem;
    }

    .item-modal__title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 800;
      color: #1a1e26;
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
    }
  `]
})
export class ObjectDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  object: any;
  menus: any[] = [];
  selectedMenu: any;
  items: any[] = [];
  selectedItem: any = null;
  activeLanguages: LanguageCode[] = [];
  selectedLanguage: LanguageCode | null = null;
  apiUrl = environment.baseUrl;
  isTabsElevated = false;
  private readonly uiText: Record<LanguageCode, Record<string, string>> = {
    ka: {
      chooseCategory: 'აირჩიე კატეგორია',
      languageLabel: 'ენა',
      categoryEyebrow: 'კატეგორია',
      noItems: 'ამ კატეგორიაში კერძები ჯერ არ არის დამატებული.',
      descriptionTitle: 'აღწერა',
      noDescription: 'აღწერა არ არის მითითებული.',
      close: 'დახურვა'
    },
    en: {
      chooseCategory: 'Choose a category',
      languageLabel: 'Language',
      categoryEyebrow: 'Category',
      noItems: 'No items available in this category yet.',
      descriptionTitle: 'Description',
      noDescription: 'No description available.',
      close: 'Close'
    },
    ru: {
      chooseCategory: 'Выберите категорию',
      languageLabel: 'Язык',
      categoryEyebrow: 'Категория',
      noItems: 'В этой категории пока нет блюд.',
      descriptionTitle: 'Описание',
      noDescription: 'Описание не указано.',
      close: 'Закрыть'
    }
  };

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.api.get('/public/languages').subscribe((languages: string[]) => {
      this.activeLanguages = (languages ?? []).filter((code): code is LanguageCode =>
        code === 'ka' || code === 'en' || code === 'ru'
      );
    });

    this.api.get(`/public/objects/${id}`).subscribe(res => {
      this.object = res.resultData;
    });

    this.api.get(`/public/objects/${id}/menus`).subscribe(res => {
      this.menus = res.resultData;
    });
  }

  ngAfterViewInit() {
    this.syncStickyState();
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  selectLanguage(language: LanguageCode) {
    this.selectedLanguage = language;
  }

  openCategory(menu: any) {
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
    document.body.style.overflow = 'hidden';
  }

  closeItemDetails() {
    this.selectedItem = null;
    document.body.style.overflow = '';
  }

  getFullUrl(url: string | null | undefined): string {
    if (!url) {
      return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80';
    }

    if (url.startsWith('http')) {
      return url;
    }

    return `${this.apiUrl}${url}`;
  }

  getDisplayName(entity: any): string {
    return this.getLocalizedField(entity, 'Name');
  }

  getDisplayDescription(entity: any): string {
    return this.getLocalizedField(entity, 'Description');
  }

  getDisplayAddress(entity: any): string {
    return this.getLocalizedField(entity, 'Address');
  }

  getLanguageLabel(language: LanguageCode): string {
    switch (language) {
      case 'ka':
        return 'ქართული';
      case 'en':
        return 'English';
      case 'ru':
        return 'Русский';
    }
  }

  getLanguageNativeLabel(language: LanguageCode): string {
    switch (language) {
      case 'ka':
        return 'ქართული';
      case 'en':
        return 'English';
      case 'ru':
        return 'Русский';
    }
  }

  getLanguageFlag(language: LanguageCode): string {
    switch (language) {
      case 'ka':
        return 'GE';
      case 'en':
        return 'EN';
      case 'ru':
        return 'RU';
    }
  }

  getUiText(key: string): string {
    const language = this.selectedLanguage ?? 'ka';
    return this.uiText[language][key] ?? this.uiText.ka[key] ?? key;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.syncStickyState();
  }

  private syncStickyState() {
    this.isTabsElevated = window.scrollY > 8;
  }

  private getLocalizedField(entity: any, baseKey: 'Name' | 'Description' | 'Address'): string {
    if (!entity) {
      return '';
    }

    const defaultValue = entity[this.lowercaseFirst(baseKey)] ?? '';
    const languageKey = this.getLanguageKey(baseKey);
    const localizedValue = languageKey ? entity[languageKey] : '';

    return localizedValue || defaultValue || '';
  }

  private getLanguageKey(baseKey: 'Name' | 'Description' | 'Address'): string | null {
    if (!this.selectedLanguage || this.selectedLanguage === 'ka') {
      return null;
    }

    return `${this.lowercaseFirst(baseKey)}${this.selectedLanguage === 'en' ? 'En' : 'Ru'}`;
  }

  private lowercaseFirst(value: string): string {
    return value.charAt(0).toLowerCase() + value.slice(1);
  }
}
