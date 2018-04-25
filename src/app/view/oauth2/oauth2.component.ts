import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    Language,
    TranslationService
} from 'angular-l10n';
import { CredentialsService } from '../../core/rest/markets/credentials/credentials.service';
import { AuthService } from '../../core/rest/markets/ebay/auth/auth.service';
import { TerraOverlayComponent } from '@plentymarkets/terra-components';
import { CredentialInterface } from '../../core/rest/markets/credentials/data/credential.interface';
import { LoadingConfig } from '../../core/config/loading.config';
import { AlertConfig } from '../../core/config/alert.config';
import { CredentialsConfig } from './config/credentials.config';

@Component({
    selector: 'oauth2',
    template: require('./oauth2.component.html'),
    styles:   [require('./oauth2.component.scss').toString()]
})

export class OAuth2Component implements OnInit
{
    @ViewChild('removeCredentialsConfirmationOverlay') public removeCredentialsConfirmationOverlay:TerraOverlayComponent;

    @Language()
    public lang:string;

    private _credentialsList:Array<CredentialInterface>;

    constructor(private _credentialService:CredentialsService,
                private _authService:AuthService,
                public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig,
                private _credentialsConfig:CredentialsConfig)
    {
        this.initCredentialsInfoBoxes();
    }

    ngOnInit():void
    {
        this._credentialsConfig.oauth2Component = this;
    }

    public initCredentialsInfoBoxes():void
    {
        this._loadingConfig.callLoadingEvent(true);

        this._credentialService.search().subscribe(
            response =>
            {
                this._credentialsList = [];

                let entries = response['entries'];

                for(let index in entries)
                {
                    let data:CredentialInterface = entries[index];

                    this._credentialsList.push({
                        id:          data.id,
                        environment: data.environment,
                        status:      data.status,
                        data:        data.data,
                        market:      data.market,
                        updatedAt:   data.updatedAt,
                        createdAt:   data.createdAt,
                    });
                }

                this._loadingConfig.callLoadingEvent(false);
            },
            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('errorLoadCredentials') + ': ' + error.statusText,
                    'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    public openAuthenticationPopup(environment:string = 'production')
    {
        this._loadingConfig.callLoadingEvent(true);

        this._authService.getLoginUrl(environment).subscribe(
            response =>
            {
                let popup = window.open(
                    response.loginUrl,
                    'eBay Login',
                    'toolbar=no, location=#, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=600, height=600, top=0, left=50');

                let pollTimer = window.setInterval(() =>
                {
                    if(popup.closed !== false)
                    {
                        window.clearInterval(pollTimer);

                        this.initCredentialsInfoBoxes();

                        this._loadingConfig.callLoadingEvent(false);
                    }
                }, 200);
            },
            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('errorAuthentication') + ': ' + error.statusText,
                    'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }
}