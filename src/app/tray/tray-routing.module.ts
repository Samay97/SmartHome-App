import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TrayComponent } from './tray.component';

const routes: Routes = [
  {
    path: 'traywindow',
    component: TrayComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrayRoutingModule {}
