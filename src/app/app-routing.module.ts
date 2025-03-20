import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { FlowsComponent } from './flows/flows.component';
import { InterfacesComponent } from './interfaces/interfaces.component';
import { HostsComponent } from './hosts/hosts.component';
import { OriginsComponent } from './origins/origins.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupsComponent } from './groups/groups.component';
import { ModelsComponent } from './models/models.component';
import { LogsListComponent } from './logs/logs-list/logs-list.component';
import { AuthComponent } from './auth/auth.component';
import { EmailsComponent } from './emails/emails.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },,
  { path: 'flows', component: FlowsComponent },
  { path: 'comunications', component: EmailsComponent },
  { path: 'interfaces', component: InterfacesComponent },
  { path: 'hosts', component: HostsComponent },
  { path: 'origins', component: OriginsComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'models', component: ModelsComponent },
  { path: 'logs', component: LogsListComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
