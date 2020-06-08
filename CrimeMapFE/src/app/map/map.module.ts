import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';


import { Routes, RouterModule } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapService } from '../map.service';
import { NgxSidebarControlModule } from '@runette/ngx-leaflet-sidebar';
import { InfoPanelComponent } from './info-panel/info-panel.component';

const routes: Routes = [
  { path: '', component: MapComponent }
];

@NgModule({
  declarations: [MapComponent, InfoPanelComponent],
  imports: [
    CommonModule,
    LeafletModule,
    NgxSidebarControlModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [
    MapService
  ]
})
export class MapModule { }
