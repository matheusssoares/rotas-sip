import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'admin/dashboard',
    canActivate: [AuthService],
    loadChildren: () => import('./admin/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'cadastre-se',
    loadChildren: () => import('./cadastre-se/cadastre-se.module').then( m => m.CadastreSePageModule)
  },
  {
    path: 'admin/tipos-estabelecimentos',
    canActivate: [AuthService],
    loadChildren: () => import('./admin/tipos-estabelecimentos/tipos-estabelecimentos.module').then( m => m.TiposEstabelecimentosPageModule)
  },
  {
    path: 'admin/estabelecimentos',
    canActivate: [AuthService],
    loadChildren: () => import('./admin/estabelecimentos/estabelecimentos.module').then( m => m.EstabelecimentosPageModule)
  },
  {
    path: 'admin/noticias',
    canActivate: [AuthService],
    loadChildren: () => import('./admin/noticias/noticias.module').then( m => m.NoticiasPageModule)
  },
  {
    path: 'admin/eventos',
    canActivate: [AuthService],
    loadChildren: () => import('./admin/eventos/eventos.module').then( m => m.EventosPageModule)
  },
  {
    path: 'admin/anuncios',
    canActivate: [AuthService],
    loadChildren: () => import('./admin/anuncios/anuncios.module').then( m => m.AnunciosPageModule)
  },
  {
    path: 'admin/usuarios',
    loadChildren: () => import('./admin/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'cliente/dashboard',
    canActivate: [AuthService],
    loadChildren: () => import('./cliente/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'cliente/historia',
    canActivate: [AuthService],
    loadChildren: () => import('./cliente/historia/historia.module').then( m => m.HistoriaPageModule)
  },
  {
    path: 'cliente/eventos/adicionar',
    canActivate: [AuthService],
    loadChildren: () => import('./cliente/eventos/adicionar/adicionar.module').then( m => m.AdicionarPageModule)
  },
  {
    path: 'cliente/eventos/visualizar/:key',
    canActivate: [AuthService],
    loadChildren: () => import('./cliente/eventos/visualizar/visualizar.module').then( m => m.VisualizarPageModule)
  },
  {
    path: 'cliente/eventos/editar/:key',
    canActivate: [AuthService],
    loadChildren: () => import('./cliente/eventos/editar/editar.module').then( m => m.EditarPageModule)
  },
  {
    path: 'cliente/anuncios',
    canActivate: [AuthService],
    loadChildren: () => import('./cliente/anuncios/anuncios.module').then( m => m.AnunciosPageModule)
  },
  {
    path: 'cliente/locais',
    canActivate: [AuthService],
    loadChildren: () => import('./cliente/locais/locais.module').then( m => m.LocaisPageModule)
  },
  {
    path: 'perfil',
    canActivate: [AuthService],
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
