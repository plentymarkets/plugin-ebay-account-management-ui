import {
    APP_INITIALIZER,
    NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslationModule } from 'angular-l10n';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/';
import { EbayOAuth2AppComponent } from "./ebay-oauth2-app.component";
import { LocalizationConfig } from './core/localization/localization.config';
import { LoadingConfig } from './core/config/loading.config';
import { AlertConfig } from './core/config/alert.config';
import { OAuth2Module } from './view/oauth2/oauth2.module';

@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        FormsModule,
        TranslationModule.forRoot(),
        TerraComponentsModule.forRoot(),
        OAuth2Module.forRoot(),
    ],
    declarations: [
        EbayOAuth2AppComponent,
    ],

    providers: [
        LoadingConfig,
        AlertConfig,
        LocalizationConfig,
        {
            provide:    APP_INITIALIZER,
            useFactory: initLocalization,
            deps:       [LocalizationConfig],
            multi:      true
        }
    ],

    bootstrap: [
        EbayOAuth2AppComponent
    ]
})

export class EbayOAuth2AppModule
{
}

export function initLocalization(localizationConfig:LocalizationConfig):Function
{
    return () => localizationConfig.load();
}