const http = require("http");
const pug = require("pug");
const port = 3000;
const compiledFunction = pug.compileFile("template.pug")

var FileReader = require("fs");

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

const server = http.createServer(
    (req, res) => {
        var table = [];

        console.log(req.url, req.url.split('/')[req.url.length - 1])
        console.log(res.data)

        // var filePath = '.' + req.url;

        var filePath = "./data.csv";
        RegExp(/.svg/g).test(req.url) ? filePath = "." + req.url : "";
        FileReader.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data);
                table = parse(data);
                console.log(table)
            }
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        const generatedTemplate = compiledFunction({
            list: table,
            PageTitle: "My server",
            pageH1: "Voici le contenu du fichier"
        })
        res.end(generatedTemplate)
    }
)




server.listen(port, () => {
    console.log(`Server running at port ${port}`);
})