import {
    NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {L10nLoader, TranslationModule} from 'angular-l10n';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/';
import { EbayOAuth2AppComponent } from "./ebay-oauth2-app.component";
import { LoadingConfig } from './core/config/loading.config';
import { AlertConfig } from './core/config/alert.config';
import { OAuth2Module } from './view/oauth2/oauth2.module';
import {l10nConfig} from "./core/config/l10n.config";

@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        FormsModule,
        TranslationModule.forRoot(l10nConfig),
        TerraComponentsModule.forRoot(),
        OAuth2Module.forRoot(),
    ],
    declarations: [
        EbayOAuth2AppComponent,
    ],

    providers: [
        LoadingConfig,
        AlertConfig,
    ],

    bootstrap: [
        EbayOAuth2AppComponent
    ]
})


export class EbayOAuth2AppModule
{
    constructor(public l10nLoader:L10nLoader)
    {
        this.l10nLoader.load();
    }
}