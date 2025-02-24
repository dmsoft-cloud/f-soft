import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { NgChartsModule } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';  // Importa BaseChartDirective

import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



import { AppComponent } from './app.component';
import { DropdownDirective } from './utils/dropdown.directive';

import { HighlightedDirective } from './utils/highlighted.directive';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToggleSwitchComponent } from './utils/toggle-switch/toggle-switch.component';
import { DefaultTableComponent } from './utils/default-table/default-table.component';
import { DefaultDetailComponent } from './utils/default-detail/default-detail.component';
import { DefaultTableFilterComponent } from './utils/default-table-filter/default-table-filter.component';
import { ModelsComponent } from './models/models.component';
import { LogsListComponent } from './logs/logs-list/logs-list.component';
import { LoginComponent } from './login/login.component';
import { InterfacesComponent } from './interfaces/interfaces.component';
import { HostsComponent } from './hosts/hosts.component';
import { HostsListComponent } from './hosts/hosts-list/hosts-list.component';
import { HostsDetailComponent } from './hosts/hosts-detail/hosts-detail.component';
import { HeaderComponent } from './header/header.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupsListComponent } from './groups/groups-list/groups-list.component';
import { GroupsDetailComponent } from './groups/groups-detail/groups-detail.component';
import { FlowsComponent } from './flows/flows.component';
import { FlowsListComponent } from './flows/flows-list/flows-list.component';
import { FlowsDetailComponent } from './flows/flows-detail/flows-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GenericDetailComponent } from './utils/generic-detail/generic-detail.component';
import { InterfacesListComponent } from './interfaces/interfaces-list/interfaces-list.component';
import { InterfacesDetailComponent } from './interfaces/interfaces-detail/interfaces-detail.component';
import { GroupEditComponent } from './groups/group-edit/group-edit.component';
import { InterfaceEditComponent } from './interfaces/interface-edit/interface-edit.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './utils/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ConfigService, initializeApp  } from './utils/config.service';
import { GenericEditComponent } from './utils/generic-edit/generic-edit.component';
import { ModelsListComponent } from './models/models-list/models-list.component';
import { ModelsDetailComponent } from './models/models-detail/models-detail.component';
import { ModelsEditComponent } from './models/models-edit/models-edit.component';
import { HostEditComponent } from './hosts/host-edit/host-edit.component';
import { FlowEditComponent } from './flows/flow-edit/flow-edit.component';
import { OriginsComponent } from './origins/origins.component';
import { OriginsListComponent } from './origins/origins-list/origins-list.component';
import { OriginsDetailComponent } from './origins/origins-detail/origins-detail.component';
import { OriginEditComponent } from './origins/origin-edit/origin-edit.component';
import { SelectCustomComponent } from './utils/select-custom/select-custom.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule




@NgModule({ declarations: [
        AppComponent,
        ToggleSwitchComponent,
        DefaultTableComponent,
        DefaultDetailComponent,
        DefaultTableFilterComponent,
        ModelsComponent,
        LogsListComponent,
        LoginComponent,
        InterfacesComponent,
        HostsComponent,
        HostsListComponent,
        HostsDetailComponent,
        HeaderComponent,
        GroupsComponent,
        GroupsListComponent,
        GroupsDetailComponent,
        FlowsComponent,
        FlowsListComponent,
        FlowsDetailComponent,
        DashboardComponent,
        GenericDetailComponent,
        GenericEditComponent,
        InterfacesListComponent,
        InterfacesDetailComponent,
        GroupEditComponent,
        InterfaceEditComponent,
        AuthComponent,
        LoadingSpinnerComponent,
        ModelsListComponent,
        ModelsDetailComponent,
        ModelsEditComponent,
        HostEditComponent,
        FlowEditComponent,
        OriginsComponent,
        OriginsListComponent,
        OriginsDetailComponent,
        OriginEditComponent,
        SelectCustomComponent
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        BrowserAnimationsModule,
        NgChartsModule,  
        AppRoutingModule,
        FormsModule,
        CommonModule,
        NgbModule, // Importa il modulo Modal e configuralo globalmente
        ReactiveFormsModule], 
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [ConfigService],
            multi: true
        },
        provideAnimationsAsync(), provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
