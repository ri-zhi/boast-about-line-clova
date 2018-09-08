const clova = require('@line/clova-cek-sdk-nodejs');
const line = require('@line/bot-sdk');
const express = require('express');
const axios = require('axios');

async function getRestaurant(){
  const url = 'GNAVI_SEARCH_URL'
  const res = await axios.get(url);
  return res.data.rest.name_kana
}

async function getRestaurantUrl(){
    const url = 'GNAVI_SEARCH_URL'
    const res = await axios.get(url);
    return res.data.rest.url
}

// 応答の最後に追加するテンプレート
const TEMPLATE_INQUIRY = '自慢を教えて';

const clovaSkillHandler = clova.Client
  .configureSkill()
  // スキルの起動リクエスト
  .onLaunchRequest(responseHelper => {
    responseHelper.setSimpleSpeech({
      lang: 'ja',
      type: 'PlainText',
      value: `はーい。「おだてるちゃん」だよ。${TEMPLATE_INQUIRY}`,
    });
  })
  // カスタムインテント or ビルトインインテント
  .onIntentRequest(async responseHelper => {
    const intent = responseHelper.getIntentName();
    const userId = 'USER_ID';
    let output_speech;
    let restName = await getRestaurant();
    switch (intent) {
      // ユーザーのインプットが自慢だと判別された場合。
      case 'BoastIntent': {
        // 自慢（スロット）を取得
        const slots = responseHelper.getSlots()
        if(slots.life != null) {
          output_speech = {
            "type": "SpeechList",
            "values": [
              {
                "type": "URL",
                "lang": "",
                "value": "SOUND_URL"
              }
            ]
          }
          responseHelper.setOutputSpeech(output_speech)
        }else if(slots.work != null) {
          const client = new line.Client({
            channelAccessToken: 'ACCESS_TOKEN'
          });

          const restUrl = await getRestaurantUrl()
          const message = {
            type: 'text',
            text: `提案したお店だよ ${restUrl}`
          };

          client.pushMessage(userId, message)

          output_speech = {
            "type": "SpeechList",
            "values": [
              {
                "type": "URL",
                "lang": "" ,
                "value": "SOUND_URL"
              },
              {
                "type": "PlainText",
                "lang": "ja",
                "value": `明日${restName}に行こうよ`
              }
            ]
          }
          responseHelper.setOutputSpeech(output_speech)
        }else{
          output_speech = {
            "type": "SpeechList",
            "values": [
              {
                "type": "URL",
                "lang": "",
                "value": "SOUND_URL"
              }
            ]
          }
          responseHelper.setOutputSpeech(output_speech)
        }
        break;
      }
    }
  })
  // スキルの終了リクエスト
  .onSessionEndedRequest(responseHelper => {
    speech = {
      lang: 'ja',
      type: 'PlainText',
      value: `じゃ、また話を聞かせてね。ばいばい。`
    }
    responseHelper.setSimpleSpeech(speech)
  })
  .handle();

const app = new express();
//TODO
// リクエストの検証を行う場合。環境変数APPLICATION_ID(値はClova Developer Center上で入力したExtension ID)が必須
const clovaMiddleware = clova.Middleware({
  applicationId: process.env.APPLICATION_ID
});
app.post('/clova', clovaMiddleware, clovaSkillHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
