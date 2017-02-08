import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/';
import { LocaleModule } from "angular2localization/angular2localization";
import { LocalizationModule } from "angular2localization/angular2localization";
import { LocaleService } from "angular2localization/angular2localization";
import { LocalizationService } from "angular2localization/angular2localization";
import { ModalModule, ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';
import { EbayAuthenticationComponent } from "./ebay-authentication.component.ts";
import { AuthenticationComponent } from "./authentication/authentication.component";
import { AuthenticationService } from "./authentication/service/authentication.service";
import { CredentialsService } from "./authentication/service/credentials.service";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        LocaleModule,
        LocalizationModule,
        TerraComponentsModule.forRoot()
    ],
    declarations: [
        EbayAuthenticationComponent,
        AuthenticationComponent
    ],

    providers: [
        AuthenticationService,
        CredentialsService,
        LocaleService,
        LocalizationService,
        {provide: ComponentsHelper, useClass: ComponentsHelper}
    ],

    bootstrap: [
        EbayAuthenticationComponent
    ]
})

export class EbayAuthenticationModule {
}