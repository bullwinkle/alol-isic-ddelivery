import 'hammerjs';
import './polyfills.ts';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
if (environment.production) {
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
    .then(function (res) { return console.info('bootstraped', res); })
    .catch(function (err) { return console.warn('bootstrap failed', err); });
//# sourceMappingURL=/Users/macbookpro/Projects/strizhapp/web/app/src/main.js.map