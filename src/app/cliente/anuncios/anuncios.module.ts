import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnunciosPageRoutingModule } from './anuncios-routing.module';

import { AnunciosPage } from './anuncios.page';

import { SplitButtonModule } from 'primeng/splitbutton';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnunciosPageRoutingModule,
    SplitButtonModule
  ],
  declarations: [AnunciosPage]
})
export class AnunciosPageModule {}
