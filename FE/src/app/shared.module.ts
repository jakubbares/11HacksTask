import { NgModule } from '@angular/core';

import { Autosize } from './directives/autosize.directive';
import {PaddingAuto} from './directives/padding-top.directive';

@NgModule({
  declarations: [
    Autosize,
    PaddingAuto
  ],
  exports: [
    Autosize,
    PaddingAuto
  ]
})
export class SharedModule{}
