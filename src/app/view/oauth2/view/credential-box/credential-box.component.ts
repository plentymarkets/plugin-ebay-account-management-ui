import {
    Component,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    LocaleService,
    Localization,
    Translation,
    TranslationService
} from 'angular-l10n';
import { CredentialsService } from '../../../../core/rest/markets/credentials/credentials.service';
import {
    TerraOverlayComponent,
    TerraOverlayButtonInterface
} from '@plentymarkets/terra-components';
import { CredentialInterface } from '../../../../core/rest/markets/credentials/data/credential.interface';
import { LoadingConfig } from '../../../../core/config/loading.config';
import { AlertConfig } from '../../../../core/config/alert.config';
import { CredentialsConfig } from '../../config/credentials.config';

@Component({
    selector: 'credential-box',
    template: require('./credential-box.component.html'),
    styles:   [require('./credential-box.component.scss').toString()]
})

export class CredentialBoxComponent extends Localization implements OnInit
{
    @Input('credential') credential:CredentialInterface;
    @ViewChild('overlay') public overlay:TerraOverlayComponent;

    private _cancelBtn:TerraOverlayButtonInterface;
    private _removeBtn:TerraOverlayButtonInterface;
    
    private _editModeActive:boolean;

    private _credentialCreatedAt:Date;
    private _credentialRefreshTokenExpiration:Date;

    constructor(private _credentialService:CredentialsService,
                public translation:TranslationService,
                public localeService:LocaleService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig,
                private _credentialsConfig:CredentialsConfig)
    {
        super(localeService, translation);
        
        this._editModeActive = false;
    }

    ngOnInit():void
    {
        this.cancelBtn = {
            icon:          'icon-cancel',
            caption:       this.translation.translate('cancel'),
            isDisabled:    false,
            clickFunction: () => this.onCancelRemoveCredentialsBtnClick()
        };

        this.removeBtn = {
            icon:          'icon-delete',
            caption:       this.translation.translate('remove'),
            isDisabled:    false,
            clickFunction: () => this.onRemoveCredentialsBtnClick()
        };
        
        this._credentialCreatedAt = new Date(this.credential.createdAt);
        
        this._credentialRefreshTokenExpiration = new Date(this.credential.data.refreshTokenExpiration);
    }

    private onRefreshCredentialsTokenBtnClick():void
    {
        this._credentialsConfig.oauth2Component.openAuthenticationPopup(this.credential.environment);
    }

    private onShowRemoveCredentialOverlayBtnClick():void
    {
        this.overlay.showOverlay();
    }

    private onCancelRemoveCredentialsBtnClick():void
    {
        this.overlay.hideOverlay();
    }

    private onRemoveCredentialsBtnClick():void
    {
        this.overlay.hideOverlay();

        this.removeCredentials(this.credential);
    }
    
    private onSaveCredentialsBtnClick():void
    {
        this.saveCredentials(this.credential);
    }

    private saveCredentials(credentials:CredentialInterface):void
    {
        this._loadingConfig.callLoadingEvent(true);

        this._credentialService.save(credentials).subscribe(
            response =>
            {
                this._editModeActive = false;

                this._alertConfig.callStatusEvent(this.translation.translate('successSaveCredentials'), 'success');
                this._loadingConfig.callLoadingEvent(false);
            },
            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('errorSaveCredentials') + ': ' + error.statusText,
                    'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    private removeCredentials(credential:CredentialInterface):void
    {
        this._loadingConfig.callLoadingEvent(true);

        this._credentialService.remove(credential.id).subscribe(
            response =>
            {
                if(response['affectedRows'] > 0)
                {
                    this._credentialsConfig.oauth2Component.initCredentialsInfoBoxes();

                    this._alertConfig.callStatusEvent(this.translation.translate('successRemoveCredentials'), 'success');
                }
                else
                {
                    this._alertConfig.callStatusEvent(this.translation.translate('errorRemoveCredentials'), 'info');
                }

                this._loadingConfig.callLoadingEvent(false);
            },
            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('errorRemoveCredentials') + ': ' + error.statusText,
                    'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    public get cancelBtn():TerraOverlayButtonInterface
    {
        return this._cancelBtn;
    }

    public set cancelBtn(value:TerraOverlayButtonInterface)
    {
        this._cancelBtn = value;
    }

    public get removeBtn():TerraOverlayButtonInterface
    {
        return this._removeBtn;
    }

    public set removeBtn(value:TerraOverlayButtonInterface)
    {
        this._removeBtn = value;
    }
}