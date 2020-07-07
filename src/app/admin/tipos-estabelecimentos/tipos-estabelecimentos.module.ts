import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TiposEstabelecimentosPageRoutingModule } from './tipos-estabelecimentos-routing.module';

import { TiposEstabelecimentosPage } from './tipos-estabelecimentos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TiposEstabelecimentosPageRoutingModule
  ],
  declarations: [TiposEstabelecimentosPage]
})
export class TiposEstabelecimentosPageModule {}
