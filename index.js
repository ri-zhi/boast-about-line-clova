const clova = require('@line/clova-cek-sdk-nodejs')
const line = require('@line/bot-sdk')
const express = require('express')
const axios = require('axios')

async function getRestaurant(){
  const url = 'GNAVI_SEARCH_API_URL'
  const response = await axios.get(url)
  return {name: response.data.rest[0].name_kana, url: response.data.rest[0].url}
}

function sendLine(restaurantUrl){
  const userId = 'USER_ID'
  const client = new line.Client({
    channelAccessToken: 'ACCESS_TOKEN'
  })

  const message = {
    type: 'text',
    text: `提案したお店だよ ${restaurantUrl}`
  }

  client.pushMessage(userId, message)
}

const clovaSkillHandler = clova.Client
  .configureSkill()
  // スキルの起動リクエスト
  .onLaunchRequest(responseHelper => {
    responseHelper.setSimpleSpeech({
      lang: 'ja',
      type: 'PlainText',
      value: `はーい。おだてるちゃんだよ。自慢を教えて`,
    })
  })
  // カスタムインテント or ビルトインインテント
  .onIntentRequest(async responseHelper => {
    const intent = responseHelper.getIntentName()
    let outputSpeech
    switch (intent) {
      // ユーザーのインプットが自慢だと判別された場合。
      case 'BoastIntent': {
        // 自慢（スロット）を取得
        const slots = responseHelper.getSlots()
        if (slots.boast != null) {
          const restaurant = await getRestaurant()
          outputSpeech = {
            "type": "SpeechList",
            "values": [
              {
                "type": "URL",
                "lang": "",
                "value": "SOUND_URL"
              },
              {
                "type": "PlainText",
                "lang": "ja",
                "value": `やったね。今度頑張ったご褒美として${restaurant.name}に行こうよ`
              }
            ]
          }
          sendLine(restaurant.url)
          responseHelper.setOutputSpeech(outputSpeech)
        }else{
          outputSpeech = {
            "type": "SpeechList",
            "values": [
              {
                "type": "PlainText",
                "lang": "",
                "value": "すごいね。他にはない。もっと聞かせて。"
              }
            ]
          }
          responseHelper.setOutputSpeech(outputSpeech)
        }
        break
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
  .handle()

const app = new express()
const clovaMiddleware = clova.Middleware({
  applicationId: process.env.APPLICATION_ID
})
app.post('/clova', clovaMiddleware, clovaSkillHandler)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on ${port}`)
})
