import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations: Record<string, string> = {};
  private langSubject = new BehaviorSubject<string>('NO');
  lang$ = this.langSubject.asObservable().pipe(distinctUntilChanged());

  constructor(private http: HttpClient) {}

  loadTranslations(lang: string): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`/assets/translation/${lang}.json`).pipe(
      map((translations) => {
        this.translations = translations;
        this.langSubject.next(lang);
        return translations;
      })
    );
  }

  getTranslation(key: string): string {
    return this.translations[key] || key;
  }

  getCurrentLang(): string {
    return this.langSubject.getValue();
  }

  changeLanguage(lang: string) {
    // check to avoid infinite loops
    if (this.getCurrentLang() !== lang) {
      this.loadTranslations(lang).subscribe(() => {
        localStorage.setItem('language', lang);
        // send when the translation is loaded
        this.langSubject.next(lang);
      });
    }
  }

  setLanguage(lang: string) {
    if (this.getCurrentLang() !== lang) {
      this.langSubject.next(lang);
    }
  }
}
