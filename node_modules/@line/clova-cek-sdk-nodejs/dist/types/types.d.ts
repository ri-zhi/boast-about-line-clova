import express from 'express';
declare namespace Clova {
    interface ClovaMessage {
        requestBody: RequestBody;
        responseBody: ResponseBody;
    }
    interface RequestBody {
        context: Context;
        request: Request;
        session: Session;
        version: string;
    }
    type Context = {
        AudioPlayer?: {
            offsetInMilliseconds?: number;
            playerActivity: string;
            stream?: any;
            totalInMilliseconds?: number;
        };
        System: {
            application: {
                applicationId: string;
            };
            device: {
                deviceId: string;
                display: {
                    contentLayer?: {
                        width: number;
                        height: number;
                    };
                    dpi?: number;
                    orientation?: string;
                    size: string;
                };
            };
            user: {
                userId: string;
                accessToken: string;
            };
        };
    };
    type Request = LaunchRequest | IntentRequest | SessionEndedRequest;
    type LaunchRequest = {
        type: 'LaunchRequest';
    };
    type IntentRequest = {
        type: 'IntentRequest';
        intent: {
            name: string;
            slots: {
                [key: string]: {
                    name: string;
                    value: SlotValue;
                };
            };
        };
    };
    type SessionEndedRequest = {
        type: 'SessionEndedRequest';
    };
    type Session = {
        new: boolean;
        sessionAttributes: object;
        sessionId: string;
        user: {
            userId: string;
            accessToken?: string;
        };
    };
    interface ResponseBody {
        response: Response;
        sessionAttributes: object;
        version: string;
    }
    interface Response {
        card: Card;
        directives: Array<Directive>;
        outputSpeech: OutputSpeech;
        reprompt?: {
            outputSpeech: OutputSpeech;
        };
        shouldEndSession: boolean;
    }
    type Card = {};
    type Directive = {
        header: {
            messageId: string;
            name: string;
            namespace: string;
        };
        payload: object;
    };
    type OutputSpeech = OutputSpeechSimple | OutputSpeechList | OutputSpeechSet | {};
    type OutputSpeechSimple = {
        brief?: SpeechInfoObject;
        type: 'SimpleSpeech';
        values: SpeechInfoObject;
        verbose?: OutputSpeechVerbose;
    };
    type OutputSpeechList = {
        brief?: SpeechInfoObject;
        type: 'SpeechList';
        values: Array<SpeechInfoObject>;
        verbose?: OutputSpeechVerbose;
    };
    type OutputSpeechSet = {
        brief: SpeechInfoObject;
        type: 'SpeechSet';
        values?: SpeechInfoObject;
        verbose: OutputSpeechVerbose;
    };
    type OutputSpeechVerbose = OutputSpeechSimpleVerbose | OutputSpeechListVerbose;
    type OutputSpeechSimpleVerbose = {
        type: 'SimpleSpeech';
        values: SpeechInfoObject;
    };
    type OutputSpeechListVerbose = {
        type: 'SpeechList';
        values: Array<SpeechInfoObject>;
    };
    type SpeechInfoObject = SpeechInfoText | SpeechInfoUrl;
    type SpeechInfoText = {
        lang: SpeechLang;
        type: 'PlainText';
        value: string;
    };
    type SpeechInfoUrl = {
        lang: '';
        type: 'URL';
        value: string;
    };
    type SlotValue = string | number | null;
    type SpeechLang = 'ja' | 'ko' | 'en';
    type OutputSpeechType = 'SimpleSpeech' | 'SpeechList' | 'SpeechSet';
    interface SkillConfigurator {
        config: {
            requestHandlers: {
                [index: string]: Function;
            };
        };
        on(requestType: string, requestHandler: Function): SkillConfigurator;
        onLaunchRequest(requestHandler: Function): SkillConfigurator;
        onIntentRequest(requestHandler: Function): SkillConfigurator;
        onSessionEndedRequest(requestHandler: Function): SkillConfigurator;
        handle(): Function;
    }
    interface MiddlewareOptions {
        applicationId: string;
    }
    interface ClientContext {
        requestObject: RequestBody;
        responseObject: ResponseBody;
        endSession(): void;
        getSessionId(): string;
        getIntentName(): string | null;
        getSlots(): {
            [key: string]: SlotValue;
        };
        getSlot(slotName: string): SlotValue;
        setOutputSpeech(outputSpeech: OutputSpeech, reprompt?: boolean): void;
        setSimpleSpeech(speechInfo: SpeechInfoObject, reprompt?: boolean): this;
        setSpeechList(speechInfo: Array<SpeechInfoObject>, reprompt?: boolean): this;
        setSpeechSet(speechInfoBrief: SpeechInfoObject, speechInfoVerbose: OutputSpeechVerbose, reprompt?: boolean): this;
    }
    type Middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => void;
}
export default Clova;
