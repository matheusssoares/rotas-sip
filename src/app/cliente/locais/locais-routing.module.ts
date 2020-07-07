import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocaisPage } from './locais.page';

const routes: Routes = [
  {
    path: '',
    component: LocaisPage
  },
  {
    path: 'detalhes/:key',
    loadChildren: () => import('./detalhes/detalhes.module').then( m => m.DetalhesPageModule)
  },
  {
    path: 'adicionar',
    loadChildren: () => import('./adicionar/adicionar.module').then( m => m.AdicionarPageModule)
  },
  {
    path: 'categorias/:key',
    loadChildren: () => import('./categorias/categorias.module').then( m => m.CategoriasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocaisPageRoutingModule {}
