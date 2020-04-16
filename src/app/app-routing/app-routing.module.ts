import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../modules/home/home.component';

const routes: Routes = [
//   {
//          path: '',
//          redirectTo: '',
//          pathMatch: 'full'
//   },
  { 
        path: '', 
        component: HomeComponent 
  },
//   { 
//          path: 'starting-pitchers', 
//          component: StartingPitcherComponent 
//   },
   {
          path: '**', 
          component: HomeComponent
   }
 
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
