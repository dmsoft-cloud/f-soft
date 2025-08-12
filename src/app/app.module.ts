import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { QuillModule } from 'ngx-quill';



import { AppComponent } from './app.component';
import { DropdownDirective } from './utils/dropdown.directive';

import { HighlightedDirective } from './utils/highlighted.directive';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToggleSwitchComponent } from './utils/toggle-switch/toggle-switch.component';
import { DefaultTableComponent } from './utils/default-table/default-table.component';
import { DefaultDetailComponent } from './utils/default-detail/default-detail.component';
import { DefaultTableFilterComponent } from './filters/default-table-filter/default-table-filter.component';
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
import { ReactiveFormsModule } from '@angular/forms';
import { SelectFilteredCustomComponent } from './utils/select-filtered-custom/select-filtered-custom.component';
import { SelectFiltered2CustomComponent } from './utils/select-filtered2-custom/select-filtered2-custom.component';
import { EmailsComponent } from './emails/emails.component';
import { EmailsListComponent } from './emails/emails-list/emails-list.component';
import { EmailsDetailComponent } from './emails/emails-detail/emails-detail.component';
import { EmailEditComponent } from './emails/email-edit/email-edit.component';
import { DefaultTableNewComponent } from "./utils/default-table-new/default-table-new.component";
import { ErrorHandlerService } from './utils/error-handler.service';
import { FlowsFilterFormComponent } from './filters/flows-filter-form/flows-filter-form.component';
import { OptionsComponent } from './utils/options/options.component';
import { GenericWizardComponent } from './utils/generic-wizard/generic-wizard.component';
import { GenericVerticalWizardComponent } from './utils/generic-vertical-wizard/generic-vertical-wizard.component';
import { FlowWizardComponent } from './flows/flow-wizard/flow-wizard.component';
import { WizardStepDirective } from './utils/wizard-step.directive';
import { FlowGoupSectionWizardComponent } from './flows/flow-wizard/flow-goup-section-wizard/flow-goup-section-wizard.component';
import { SelectFilteredCustomNewComponent } from './utils/select-filtered-custom-new/select-filtered-custom-new.component';
import { FlowInterfaceSectionWizardComponent } from './flows/flow-wizard/flow-interface-section-wizard/flow-interface-section-wizard.component';
import { FlowOriginSectionWizardComponent } from './flows/flow-wizard/flow-origin-section-wizard/flow-origin-section-wizard.component';
import { FlowModelSectionWizardComponent } from './flows/flow-wizard/flow-model-section-wizard/flow-model-section-wizard.component';
import { BaseEditComponent } from './utils/base-edit/base-edit.component';
import { FlowLastSectionWizardComponent } from './flows/flow-wizard/flow-last-section-wizard/flow-last-section-wizard.component';
import { LogEditComponent } from './logs/log-edit/log-edit.component';






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
        SelectCustomComponent,
        SelectFilteredCustomComponent,
        SelectFiltered2CustomComponent,
        EmailsComponent,
        EmailsListComponent,
        EmailsDetailComponent,
        EmailEditComponent,
        FlowsFilterFormComponent,
        OptionsComponent,
        GenericWizardComponent,
        GenericVerticalWizardComponent,
        FlowWizardComponent,
        WizardStepDirective,
        FlowGoupSectionWizardComponent,
        SelectFilteredCustomNewComponent,
        FlowInterfaceSectionWizardComponent,
        FlowOriginSectionWizardComponent,
        FlowModelSectionWizardComponent,
        FlowLastSectionWizardComponent,
        LogEditComponent
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
    BrowserAnimationsModule,
    TableModule, // Modulo per p-table
    QuillModule.forRoot(),
    InputTextModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    NgbModule,
    ToastModule,
    EditorModule,
    ReactiveFormsModule, DefaultTableNewComponent], 
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        MessageService,
        ErrorHandlerService,
        ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [ConfigService],
            multi: true
        },
        provideAnimationsAsync(), provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
