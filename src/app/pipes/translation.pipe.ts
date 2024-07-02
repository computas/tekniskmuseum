import { Pipe, PipeTransform,inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
    name: 'translate',
    standalone: true,
    pure: false
})
export class TranslatePipe implements PipeTransform {
    //constructor(private translationService: TranslationService) { }
    private translationService = inject(TranslationService);
    
    transform(value: string): string {
        return this.translationService.getTranslation(value);
    }
}
