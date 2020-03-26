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
        });



    }
)




server.listen(port, () => {
    console.log(`Server running at port ${port}`);
})