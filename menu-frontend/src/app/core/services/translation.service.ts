import { Injectable } from '@angular/core';
import { KA_TRANSLATIONS } from '../translations/ka';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = 'ka';
  private translations: any = {
    ka: KA_TRANSLATIONS
  };

  translate(key: string): string {
    return this.translations[this.currentLanguage][key] || key;
  }
}
