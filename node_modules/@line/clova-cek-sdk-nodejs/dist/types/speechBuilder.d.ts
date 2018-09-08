import Clova from './types';
export declare class SpeechBuilder {
    private static defaultLang;
    static DEFAULT_LANG: Clova.SpeechLang;
    static createSpeechText(value: string, lang?: Clova.SpeechLang): Clova.SpeechInfoText;
    static createSpeechUrl(value: string): Clova.SpeechInfoUrl;
}
