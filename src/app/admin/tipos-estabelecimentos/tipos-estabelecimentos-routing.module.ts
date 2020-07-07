import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiposEstabelecimentosPage } from './tipos-estabelecimentos.page';

const routes: Routes = [
  {
    path: '',
    component: TiposEstabelecimentosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiposEstabelecimentosPageRoutingModule {}
