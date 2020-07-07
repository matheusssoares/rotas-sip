import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoticiasPage } from './noticias.page';

const routes: Routes = [
  {
    path: '',
    component: NoticiasPage
  },
  {
    path: 'visualizar',
    loadChildren: () => import('./visualizar/visualizar.module').then( m => m.VisualizarPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticiasPageRoutingModule {}
