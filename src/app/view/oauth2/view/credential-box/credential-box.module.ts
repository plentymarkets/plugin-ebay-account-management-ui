import {
    ModuleWithProviders,
    NgModule
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import {
    LocalizationModule,
    TranslationModule
} from "angular-l10n";
import { CredentialsService } from '../../../../core/rest/markets/credentials/credentials.service';
import { FormsModule } from '@angular/forms';
import { CredentialBoxComponent } from './credential-box.component';

@NgModule({
    imports:      [
        CommonModule,
        TranslationModule,
        LocalizationModule,
        FormsModule,
        TerraComponentsModule.forRoot(),
    ],
    providers:    [
        CredentialsService,
    ],
    exports:      [CredentialBoxComponent],
    declarations: [CredentialBoxComponent]
})
export class CredentialBoxModule
{
    static forRoot():ModuleWithProviders
    {
        return {
            ngModule:  CredentialBoxModule,
            providers: []
        };
    }

    static getMainComponent():string
    {
        return 'CredentialBoxComponent';
    }
}