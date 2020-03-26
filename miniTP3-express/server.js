const express = require("express");
const app = express();
const port = 3000;

const pug = require("pug");
const compiledFunction = pug.compileFile("template.pug")
var FileReader = require("fs");


app.use(express.static("static"));

function parse(data) {
    var json = {}
    var dataRaw = data.split("\n");
    var i = 0;
    dataRaw.forEach(raw => {
        json[i] = {
            "user": raw.split(";")[0],
            "city": raw.split(";")[1]
        }
        i++;
    });
    return json;
}

app.get('/', (req, res) => {
    var pathParam = req.param('path', 'data.csv');
    FileReader.readFile(pathParam, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.setHeader('Content-Type', 'text/html');
            res.end()
            res.statusCode = 200;
        } else {
            table = parse(data);
            const generatedTemplate = compiledFunction({
                list: table,
                PageTitle: "My server",
                pageH1: "Voici le contenu du fichier"
            })
            res.setHeader('Content-Type', 'text/html');
            res.end(generatedTemplate)
            res.statusCode = 200;
        }
    })
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})