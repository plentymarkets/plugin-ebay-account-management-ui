import { Component, ChangeDetectionStrategy, ViewContainerRef, ViewChild } from '@angular/core';
import { Locale } from 'angular2localization';
import { LocaleService } from "angular2localization/angular2localization";
import { LocalizationService } from "angular2localization/angular2localization";

@Component({
    selector: 'ebay-oauth2-app',
    template: require('./ebay-oauth2-app.component.html'),
    styles: [require('./ebay-oauth2-app.component.scss').toString()],
    changeDetection: ChangeDetectionStrategy.Default
})

export class EbayOAuth2AppComponent extends Locale {

    private _viewContainerReference:ViewContainerRef;

    constructor(locale:LocaleService,
                localization:LocalizationService,
                private _viewContainerRef:ViewContainerRef,
    )
    {
        super(locale, localization);

        this._viewContainerReference = _viewContainerRef;

        // definitions for i18n
        if(process.env.ENV === 'production')
        {
            this.localization.translationProvider('assets/lang/locale_');
        }
        else
        {
            this.localization.translationProvider('src/app/assets/lang/locale_');
        }

        this.locale.addLanguage('de');
        this.locale.addLanguage('en');
        this.locale.definePreferredLocale('en', 'EN', 30); //default language is en

        let langInLocalStorage:string = localStorage.getItem('plentymarkets_lang_') || 'de';

        this.locale.setCurrentLocale(langInLocalStorage, langInLocalStorage.toUpperCase());
        this.localization.updateTranslation();
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