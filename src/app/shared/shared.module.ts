import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WebviewDirective } from './directives/';

import { PageNotFoundComponent, ColorPickerComponent } from './components/';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, ColorPickerComponent],
  imports: [CommonModule, FormsModule],
  exports: [WebviewDirective, FormsModule, ColorPickerComponent]
})
export class SharedModule {}
