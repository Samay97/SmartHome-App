import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { TrayRoutingModule } from './tray-routing.module';
import { TrayComponent } from './tray.component';

@NgModule({
  declarations: [TrayComponent],
  imports: [CommonModule, SharedModule, TrayRoutingModule]
})
export class TrayModule {}
