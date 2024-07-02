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
        console.log(`Loading translations for ${lang}`);    // SLETT MEG SENERE!
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
        // check to avoid infinite loops
        if (this.getCurrentLang() !== lang) {
            this.loadTranslations(lang).subscribe(() => {
                localStorage.setItem('language', lang);
                // send when the translation is loaded
                this.langSubject.next(lang)
            })
        } else {
            console.log(`Loading is already ${lang}`);  //SLETT MEG SENERE
        }
        // this.loadTranslations(lang).subscribe();
        // localStorage.setItem('language', lang);
        // this.langSubject.next(lang);
    }
}
