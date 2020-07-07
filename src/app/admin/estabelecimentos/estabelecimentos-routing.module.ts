import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstabelecimentosPage } from './estabelecimentos.page';

const routes: Routes = [
  {
    path: '',
    component: EstabelecimentosPage
  },
  {
    path: 'adicionar',
    loadChildren: () => import('./adicionar/adicionar.module').then( m => m.AdicionarPageModule)
  },
  {
    path: 'detalhes/:key',
    loadChildren: () => import('./detalhes/detalhes.module').then( m => m.DetalhesPageModule)
  },
  {
    path: 'editar/:key',
    loadChildren: () => import('./editar/editar.module').then( m => m.EditarPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstabelecimentosPageRoutingModule {}
