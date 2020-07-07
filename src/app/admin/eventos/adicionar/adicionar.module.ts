import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdicionarPageRoutingModule } from './adicionar-routing.module';

import { AdicionarPage } from './adicionar.page';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdicionarPageRoutingModule,
    BrMaskerModule
  ],
  declarations: [AdicionarPage]
})
export class AdicionarPageModule {}
