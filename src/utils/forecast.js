const request = require('request');

const forecast = (latX, lonY, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=f6f85724c5b89e919424a38882c4728e&query=' + latX + ',' + lonY + '&units=f';

    request({ url, json: true }, (error, { body } ) => {
        if (error) {
            callback('Unable to connect to weather service', undefined);
        } else if (body.error) {
            callback('Unable to find location', undefined);
        } else {
            callback(undefined, body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + ' degrees outside. It feels like ' + body.current.feelslike + ' degrees out. Humity is at ' + body.current.humidity + '%.');
        }
    })
}

module.exports = forecast;