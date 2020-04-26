const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const app = express();
const port = process.env.PORT || 3000

//define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setup handlebars engine & views location
app.set('view engine','hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// set static directory to serve to browser
app.use(express.static(publicDirectoryPath));

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'John Levengood',
    });
});

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About',
        name: 'John Levengood',
    });
});

app.get('/help', (req,res) => {
    res.render('help', {
        helpmessage: "Don't worry! We'll get this figured out together. Thanks for contacting us.",
        title: 'Help',
        name: 'John Levengood',
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.',
        })
    }
    
    console.log(req.query.search);
    res.send({
        products: [],
    });
})

app.get('/weather', (req,res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.',
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send( { error });
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                address: req.query.address,
                forecast: forecastData,
                location,
            });
        })
    })
});

app.get('/help/*', (req,res) => {
    res.render('404', {
        errorMessage: "Help article not found. Please try again.",
        title: '404: Sorry',
        name: 'John Levengood',
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: "Page Not Found. Better luck next time.",
        title: '404: Sorry',
        name: 'John Levengood',
    });
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});