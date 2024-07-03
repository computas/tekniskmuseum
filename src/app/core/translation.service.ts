import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private translations: any = {};
    private langSubject = new BehaviorSubject<string>('NO');
    lang$ = this.langSubject.asObservable();

    constructor(private http: HttpClient) { }
    
    loadTranslations(lang: string): Observable<any> {
        return this.http.get(`/assets/translation/${lang}.json`).pipe(
            map(translations => {
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

    changeLanguage(lang:string) {
        this.loadTranslations(lang).subscribe();
        localStorage.setItem('language', lang);
        this.langSubject.next(lang);
    }
}
