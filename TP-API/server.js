const express = require("express");
const app = express();
const path = require('path');
const port = 3000;
const bodyParser = require("body-parser");

const uuidv4 = require("uuid/v4");

var FileReader = require("fs");
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "/static")));
app.use(bodyParser.json());

const filePath = path.join(__dirname, "static/cities.json")

var templateVar = {
    PageTitle: "My server",
    PageH1: "Voici le contenu du fichier"
}

// app.get('/', (req, res) => {
//     var pathParam = req.param('path', 'data.csv');
//     FileReader.readFile(path.join(__dirname + '/static/', pathParam), "utf8", (err, data) => {
//         if (err) {
//             console.error(err);
//             res.setHeader('Content-Type', 'text/html');
//             res.statusCode = 404;
//             res.end()
//         } else {
//             table = parse(data);
//             const generatedTemplate = compiledFunction({
//                 list: table,
//                 PageTitle: "My server",
//                 pageH1: "Voici le contenu du fichier"
//             })
//             res.setHeader('Content-Type', 'text/html');
//             res.statusCode = 200;
//             res.end(generatedTemplate)
//         }
//     })
// });


app.get('/', (req, res) => {
    res.render('index', templateVar)
});


app.get('/cities', (req, res) => {
    FileReader.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 404;
            res.end()
        } else {
            res.setHeader('Content-Type', 'text/html');
            res.statusCode = 200;
            templateVar.list = JSON.parse(data).cities;
            console.log(templateVar.list)
            res.render('template', templateVar)
        }
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

                console.log(store.cities, "addd", store.cities.push(json), "string")
                FileReader.writeFile(filePath, store.cities, function(err) {
                    if (err) {

                        throw err
                    };
                    res.setHeader('Content-Type', 'text/html');
                    res.statusCode = 200;

                    res.render('template', templateVar)
                });
            }

        }
    })
});
app.put('/city/:id', (req, res) => {

});
app.delete('', (req, res) => {

});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})