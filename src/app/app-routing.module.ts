import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudComponent } from './components/crud/crud.component';
import { SobreNosComponent } from './components/sobre-nos/sobre-nos.component';
import { ContatoComponent } from './components/contato/contato.component';
import { PoliticaDePrivacidadeComponent } from './components/politica-de-privacidade/politica-de-privacidade.component';

const routes: Routes = [
  { path: 'crud', component: CrudComponent },
  { path: 'sobre', component: SobreNosComponent },
  { path: 'contato', component: ContatoComponent },
  { path: 'privacidade', component: PoliticaDePrivacidadeComponent}, 
  { path: '', redirectTo: '/crud', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }