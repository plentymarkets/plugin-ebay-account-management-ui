import { Component, OnInit, forwardRef, Inject, ViewChild } from '@angular/core';
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { CredentialsData } from './data/credentials-data';
import { CredentialsService } from './service/credentials.service';
import { AuthenticationService } from './service/authentication.service';
import { EbayOAuth2AppComponent } from '../ebay-oauth2-app.component';
import {
    TerraOverlayComponent,
    TerraOverlayButtonInterface
} from '@plentymarkets/terra-components/index';
import DateTimeFormat = Intl.DateTimeFormat;

@Component({
    selector: 'oauth2',
    template: require('./oauth2.component.html'),
    styles: [require('./oauth2.component.scss').toString()]
})

export class OAuth2Component extends Translation implements OnInit
{
    @ViewChild('removeCredentialsConfirmationOverlay') public removeCredentialsConfirmationOverlay:TerraOverlayComponent;

    private _cancelRemoveCredentialsButtonInterface:TerraOverlayButtonInterface;
    private _removeCredentialsButtonInterface:TerraOverlayButtonInterface;

    private isLoading:boolean = true;
    private credentialsList:Array<CredentialsData>;
    private credentialsToBeDeleted:CredentialsData = null;
    private credentialsUserIdToBeDeleted:string;

    constructor(
        private credentialService:CredentialsService,
        private authenticationService:AuthenticationService,
        @Inject(forwardRef(() => EbayOAuth2AppComponent)) private ebayOAuth2AppComponent:EbayOAuth2AppComponent,
        public translation:TranslationService
    )
    {
        super(translation);

        this.initCredentialsInfoboxes();
    }

    ngOnInit(): void
    {
        this.cancelRemoveCredentialsButtonInterface = {
            icon: 'icon-cancel',
            caption: 'Abbrechen', //this.localization.translate('cancel'),
            isDisabled: false,
            clickFunction: () => this.hideRemoveCredentialsOverlay()
        };

        this.removeCredentialsButtonInterface = {
            icon: 'icon-delete',
            caption: 'Löschen', //this.localization.translate('remove'),
            isDisabled: false,
            clickFunction: () => this.removeCredentials(this.credentialsToBeDeleted)
        };
    }

    private setLoading(isLoading:boolean)
    {
        this.ebayOAuth2AppComponent.callLoadingEvent(isLoading);
        this.isLoading = isLoading;
    }

    private reload():void
    {
        location.reload();
    }


    private initCredentialsInfoboxes():void
    {
        this.setLoading(true);

        this.credentialService.search().subscribe(
            response => {
                this.credentialsList = [];

                let entries = response['entries'];

                for (let index in entries) {
                    let data:CredentialsData = entries[index];

                    this.credentialsList.push({
                        id: data.id,
                        environment: data.environment,
                        status: data.status,
                        data: data.data,
                        market: data.market,
                        createdAt: data.createdAt,
                        editMode: false,
                    });
                }

                this.setLoading(false);
                this.ebayOAuth2AppComponent.isLoading = false;
            },
            error => {
                this.ebayOAuth2AppComponent.callStatusEvent(this.translation.translate('errorLoadCredentials') + ': ' + error.statusText, 'danger');
                this.ebayOAuth2AppComponent.isLoading = false;
                this.setLoading(false);
            }
        );
    }

    private openAuthenticationPopup(environment:string = 'production')
    {
        this.setLoading(true);

        this.authenticationService.getLoginUrl(environment).subscribe(
            response => {

                var popup = window.open(
                    response.loginUrl,
                    'eBay Login',
                    'toolbar=no, location=#, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=600, height=600, top=0, left=50');

                var pollTimer = window.setInterval(() => {
                    if (popup.closed !== false)
                    {
                        window.clearInterval(pollTimer);

                        this.initCredentialsInfoboxes();

                        this.setLoading(false);
                    }
                }, 200);
            },
            error => {
                this.ebayOAuth2AppComponent.callStatusEvent(this.translation.translate('errorAuthentication') + ': ' + error.statusText, 'danger');
                this.ebayOAuth2AppComponent.isLoading = false;
                this.setLoading(false);
            }
        );
    }

    private saveCredentials(credentials:CredentialsData):void
    {
        this.setLoading(true);

        this.credentialService.save(credentials).subscribe(
            response => {
                credentials.editMode = false;

                this.ebayOAuth2AppComponent.callStatusEvent(this.translation.translate('successSaveCredentials'), 'success');
                this.setLoading(false);
            },
            error => {
                this.ebayOAuth2AppComponent.callStatusEvent(this.translation.translate('errorSaveCredentials') + ': ' + error.statusText, 'danger');
                this.ebayOAuth2AppComponent.isLoading = false;
                this.setLoading(false);
            }
        );
    }

    private refreshCredentialsToken(credentials:CredentialsData):void
    {
        this.openAuthenticationPopup(credentials.environment);
    }

    private removeCredentials(credentials:CredentialsData):void
    {
        this.setLoading(true);

        this.hideRemoveCredentialsOverlay();

        this.credentialService.remove(credentials.id).subscribe(
            response => {
                if(response['affectedRows'] > 0)
                {
                    this.initCredentialsInfoboxes();

                    this.ebayOAuth2AppComponent.callStatusEvent(this.translation.translate('successRemoveCredentials'), 'success');
                }
                else
                {
                    this.ebayOAuth2AppComponent.callStatusEvent(this.translation.translate('errorRemoveCredentials'), 'info');
                }

                this.setLoading(false);
            },
            error => {
                this.ebayOAuth2AppComponent.callStatusEvent(this.translation.translate('errorRemoveCredentials') + ': ' + error.statusText, 'danger');
                this.ebayOAuth2AppComponent.isLoading = false;
                this.setLoading(false);
            }
        );

        this.credentialsUserIdToBeDeleted = '';
        this.credentialsToBeDeleted = null;
    }

    public get cancelRemoveCredentialsButtonInterface():TerraOverlayButtonInterface
    {
        return this._cancelRemoveCredentialsButtonInterface;
    }

    public set cancelRemoveCredentialsButtonInterface(value:TerraOverlayButtonInterface)
    {
        this._cancelRemoveCredentialsButtonInterface = value;
    }

    public get removeCredentialsButtonInterface():TerraOverlayButtonInterface
    {
        return this._removeCredentialsButtonInterface;
    }

    public set removeCredentialsButtonInterface(value:TerraOverlayButtonInterface)
    {
        this._removeCredentialsButtonInterface = value;
    }

    private showRemoveCredentialsOverlay(credentials:CredentialsData):void
    {
        this.credentialsToBeDeleted = credentials;
        this.credentialsUserIdToBeDeleted = credentials.data.userId;
        this.removeCredentialsConfirmationOverlay.showOverlay();
    }

    private hideRemoveCredentialsOverlay():void
    {
        this.removeCredentialsConfirmationOverlay.hideOverlay();
    }
}