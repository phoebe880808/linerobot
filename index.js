import 'dotenv/config'
import linebot from 'linebot'
import axios from 'axios'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
})

// 當機器人收到訊息會執行
// 事情做完後會執行這個 function
// 如果收到的是文字就用文字回答
bot.on('message', async (event) => {
  try {
    // 鸚鵡
    // if (event.message.type === 'text') {
    //   await event.reply(event.message.text)
    // } else {
    //   await event.reply('我聽不懂')
    // }

    if (event.message.type !== 'text') {
      return
    }

    // 農村地方美食小吃特色料理
    // https://data.gov.tw/dataset/6037
    const { data } = await axios.get(
      'https://data.moa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx?IsTransData=1&UnitId=193',
    )
    const result = data.find((value) => {
      if (value.Name.includes(event.message.text)) {
        return true
      } else {
        return false
      }
    })

    if (!result) {
      await event.reply('找不到')
    } else {
      await event.reply([
        { type: 'image', originalContentUrl: result.PicURL, previewImageUrl: result.PicURL },
        {
          type: 'location',
          title: result.Name,
          address: result.City + result.Town + result.Address,
          latitude: result.Latitude,
          longitude: result.Longitude,
        },
      ])
    }
  } catch (error) {
    console.error(error)
  }
})

bot.listen('/', 3000, () => {
  console.log('機器人啟動')
})
// .find(function)
// 迴圈陣列，每個東西都執行提供的 function
// 回傳第一個執行 function 結果為 true 的值
// npx 下載到暫存區域去執行
