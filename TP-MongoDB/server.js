const express = require("express");
const app = express();
const path = require('path');
const port = 3000;
const bodyParser = require("body-parser");

const uuidv4 = require("uuid/v4");

const mongoose = require("mongoose");

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "/static")));
app.use(bodyParser.json());

const filePath = path.join(__dirname, "static/cities.json")

var templateVar = {
    PageTitle: "My server",
    PageH1: "Voici le contenu du fichier"
}


mongoose.connect("mongodb://localhost/TP_Web", { useNewUrlParser: true })

const db = mongoose.connection;
const citySchema = new mongoose.Schema({
    name: String
})

const City = mongoose.model("City", citySchema)
db.on("error", console.error.bind(console, "db connection error"));
db.once("open", function() {

})

app.get('/', (req, res) => {
    res.render('index', templateVar)
});


app.get('/cities', (req, res) => {
    City.find((err, cities) => {
        if (err) return console.error(err);
        console.log(cities)
        templateVar.list = JSON.parse(JSON.stringify(cities));
        res.render('template', templateVar)
    })
});

app.post('/city', bodyParser.json(), (req, res) => {
    FileReader.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            if (req.body.name !== undefined || req.body.name !== null) {
                var json = {
                    "id": uuidv4(),
                    'name': req.body.name
                }
                FileReader.appendFile(filePath, JSON.stringify(json), function(err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
            }


            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 404;
            res.end()
        } else {
            if (req.body.name !== undefined || req.body.name !== null) {
                var json = {
                    id: uuidv4(),
                    name: req.body.name
                }
                var store = JSON.parse(data)
                console.log("cities ", store.cities)
                store.cities.push(json)
                console.log("add", store.cities)
                FileReader.writeFile(filePath, JSON.stringify(store), function(err) {
                    if (err) {

                        console.log(err)
                    } else {
                        console.log(data)
                        templateVar.list = JSON.parse(data).cities
                        res.setHeader('Content-Type', 'text/html');
                        res.statusCode = 200;

                        res.render('template', templateVar)
                    }

                });
            }

        }
    })
});
app.put('/city/:id', (req, res) => {
    var cityId = req.params && req.params.id ? req.params.id : null;
    if (cityId == null) {
        console.log("bad request, no id found")
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        res.end()
    }

});
app.delete('/city/:id', (req, res) => {
    var cityId = req.params && req.params.id ? req.params.id : null;
    if (cityId == null) {
        console.log("bad request, no id found")
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        res.end()
    }

    // lecture json
    FileReader.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 404;
            res.end()
        } else {
            if (req.body.name !== undefined || req.body.name !== null) {
                var store = JSON.parse(data)
                console.log("cities ", store.cities)
                console.log("param", cityId)
                var index = '-1'
                store.cities.forEach(city => {
                    if (city.id == cityId) {
                        index = store.cities.indexOf(city);
                        console.log(" DANS LE FOR", city, store.cities.indexOf(city))
                    }
                });
                console.log(index)
                index != -1 ? store.cities.splice(index, 1) : '';
                console.log("rm", store.cities)
                FileReader.writeFile(filePath, JSON.stringify(store), function(err) {
                    if (err) {

                        console.log(err)
                    } else {
                        console.log(data)
                        templateVar.list = JSON.parse(data).cities
                        res.setHeader('Content-Type', 'text/html');
                        res.statusCode = 200;

                        res.render('template', templateVar)
                    }

                });
            }
        }
    });
});


app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})