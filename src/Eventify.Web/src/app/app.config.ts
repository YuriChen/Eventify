import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideZard } from '@/shared/core/provider/providezard';
import { ZardComboboxImports } from '@/shared/components/combobox/combobox.imports';
import { ZardDatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideZard(),
  ]
};
