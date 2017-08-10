import { Component, ChangeDetectionStrategy, ViewContainerRef, ViewChild } from '@angular/core';
import {
    LocaleService,
    Translation,
    TranslationService
} from 'angular-l10n';

@Component({
    selector: 'ebay-oauth2-app',
    template: require('./ebay-oauth2-app.component.html'),
    styles: [require('./ebay-oauth2-app.component.scss')],
    changeDetection: ChangeDetectionStrategy.Default
})

export class EbayOAuth2AppComponent extends Translation {

    private _viewContainerReference:ViewContainerRef;

    constructor(public locale:LocaleService,
                public translation:TranslationService,
                private _viewContainerRef:ViewContainerRef,
    )
    {
        super(translation);

        this._viewContainerReference = _viewContainerRef;

        // definitions for i18n
        if(process.env.ENV === 'production')
        {
            this.translation.addConfiguration().addProvider('assets/lang/locale_');
        }
        else
        {
            this.translation.addConfiguration().addProvider('src/app/assets/lang/locale_');
        }

        this.locale.addConfiguration()
            .addLanguages(['de',
                'en'])
            .setCookieExpiration(30)
            .defineDefaultLocale('en', 'EN');

        let langInLocalStorage:string = localStorage.getItem('plentymarkets_lang_') || 'de';

        this.locale.setCurrentLanguage(langInLocalStorage);

        this.locale.init();
        this.translation.init();
    }


    private action:any = this.getUrlVars()['action'];
    private _isLoading = true;

    private getUrlVars() {
        var vars = {};

        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (substring: string, ...args: any[]): string {
            vars[args[0]] = args[1];
            return;
        });

        return vars;
    }

    public reload() {
        location.reload();
    }

    public get isLoading():boolean
    {
        return this._isLoading;
    }

    public set isLoading(v:boolean)
    {
        this._isLoading = v;
    }

    public callStatusEvent(message, type)
    {
        let detail = {
            type: type,
            message: message
        };

        let customEvent:CustomEvent = new CustomEvent('status', {detail: detail});

        window.parent.window.parent.window.dispatchEvent(customEvent);
    }

    public callLoadingEvent(isLoading:boolean)
    {
        let detail = {
            isLoading: isLoading
        };

        let customEvent:CustomEvent = new CustomEvent('loadingStatus', {detail: detail});

        window.parent.window.parent.window.dispatchEvent(customEvent);
    }
}
