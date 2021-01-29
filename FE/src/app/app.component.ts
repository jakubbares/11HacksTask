import {Component, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "./services/authentication.service";
import { TranslateService } from '@ngx-translate/core';
import {TranslationService} from "./services/translation.service";
import {Store} from "./services/store";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.store.print = !this.store.print;
    this.translate.use(this.store.print ? "cs" : "en");
    this.translation.change(this.store.print ? "cs" : "en")
  }

  constructor(private router: Router,
              public store: Store,
              private translate: TranslateService,
              private translation: TranslationService,
              public authService: AuthenticationService) {
    this.translate.addLangs(['en', 'cs']);
    this.translate.setDefaultLang('cs');
  }
}
