import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslationModule } from 'angular-l10n';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/';
import { EbayOAuth2AppComponent } from "./ebay-oauth2-app.component";
import { OAuth2Component } from "./oauth2/oauth2.component";
import { AuthenticationService } from "./oauth2/service/authentication.service";
import { CredentialsService } from "./oauth2/service/credentials.service";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        TranslationModule.forRoot(),
        TerraComponentsModule.forRoot()
    ],
    declarations: [
        EbayOAuth2AppComponent,
        OAuth2Component
    ],

    providers: [
        AuthenticationService,
        CredentialsService
    ],

    bootstrap: [
        EbayOAuth2AppComponent
    ]
})

export class EbayOAuth2AppModule
{
}