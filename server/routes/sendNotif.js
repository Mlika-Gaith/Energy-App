var admin = require('firebase-admin');
const Token = require('../models/Token');
const schedule = require('node-schedule');
const Measure = require('../models/Measure');
const moment = require('moment');
var serviceAccount = require('../secretKey.json');
// intialize Firebase
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

async function sendNotifications(title, body) {
  const tokens = await Token.find();
  if (tokens.length !== 0) {
    let sendTokens = tokens.map(item => {
      return item.token;
    });
    const message = {
      data: {title: title, body: body},
      tokens: sendTokens,
    };

    admin
      .messaging()
      .sendMulticast(message)
      .then(response => {
        console.log(response.successCount + ' messages were sent successfully');
      });
  }
}
schedule.scheduleJob('*/5 * * * *', function () {
  sendNotifications(
    'Time To Check On Your Electricity Meters',
    'Keep Track Of Your Hourly Energy Consumption For Better Energy Savings.',
  );
});
schedule.scheduleJob('*/5 * * * *', async function () {
  let daySum = 0;
  let yesterdaySum = 0;
  let dailyDiffPrct = 0;
  let body = '';
  try {
    const measures = await Measure.find();
    for (const element of measures) {
      let day = moment(element.createdAt).format('MM-DD');
      let today = moment().format('MM-DD');
      if (moment(day).isSame(today)) {
        daySum += element.real_value;
      }
    }
    for (const element of measures) {
      let day = moment(element.createdAt).format('MM-DD');
      let yesterday = moment().subtract(1, 'days').format('MM-DD');
      if (moment(day).isSame(yesterday)) {
        yesterdaySum += element.real_value;
      }
    }
    dailyDiffPrct = (((daySum - yesterdaySum) / yesterdaySum) * 100).toFixed(2);
    if (dailyDiffPrct > 0) {
      body =
        'Your Consumption Today is ' +
        daySum +
        ' kWh And consumption has increased by ' +
        dailyDiffPrct +
        '% since Yesterday.';
    } else if (dailyDiffPrct < 0) {
      body =
        'Your Consumption Today is ' +
        daySum +
        ' kWh And consumption has decreased by ' +
        dailyDiffPrct +
        '% since Yesterday.';
    } else {
      body =
        'Your Consumption Today is ' +
        daySum +
        ' kWh And consumption is stable since Yesterday';
    }
  } catch (error) {
    console.log(error);
  }
  sendNotifications('Your Daily Consumption Reminder', body);
});
