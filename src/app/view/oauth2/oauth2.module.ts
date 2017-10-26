import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import { CredentialsService } from '../../core/rest/markets/credentials/credentials.service';
import { AuthService } from '../../core/rest/markets/ebay/auth/auth.service';
import { CredentialBoxModule } from './view/credential-box/credential-box.module';
import { FormsModule } from '@angular/forms';
import { OAuth2Component } from './oauth2.component';
import { CredentialsConfig } from './config/credentials.config';

@NgModule({
    imports:      [
        CommonModule,
        TranslationModule,
        FormsModule,
        TerraComponentsModule.forRoot(),
        CredentialBoxModule.forRoot(),
    ],
    providers:    [
        CredentialsConfig,
        AuthService,
        CredentialsService,
    ],
    exports: [
        OAuth2Component
    ],
    declarations: [
        OAuth2Component
    ]
})
export class OAuth2Module
{
    static forRoot()
    {
        return {
            ngModule:  OAuth2Module,
            providers: [
            ]
        };
    }

    static getMainComponent():string
    {
        return 'OAuth2Component';
    }
}