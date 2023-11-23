const { Client, GatewayIntentBits } = require('discord.js');
const request = require('request');
const cron = require('node-cron');
require("dotenv").config();

// 為替APIのURL
var API_URL = "https://api.exchangerate-api.com/v4/latest/JPY";

// Discord BOT クライアントの初期化
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ],
});

client.on('ready', () => {
  console.log('--------------------');
  console.log(`Client ready!`);
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('--------------------');
  client.user.setActivity("オノ", { type: 'PLAYING' })

  cron.schedule('30 0 * * *', () => {
    const channel = client.channels.cache.get(process.env.channelId);
    
    request.get({
      uri: API_URL,
      headers: {'Content-type': 'application/json'},
      json: true
      }, function(err, req, data){
        var api_obj = JSON.parse(JSON.stringify(data));
        var dateTime = new Date(api_obj["time_last_updated"] * 1000);
        console.log(`1 JPY = ${api_obj["rates"]["KRW"]} KRW (${dateTime.toLocaleDateString('ja-JP')} ${dateTime.toLocaleTimeString('ja-JP')})`);
        channel.setTopic(`1 JPY = ${api_obj["rates"]["KRW"]} KRW (${dateTime.toLocaleDateString('ja-JP')} ${dateTime.toLocaleTimeString('ja-JP')})`);
      });
    });
});

client.login(process.env.token);