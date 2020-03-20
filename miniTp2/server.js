const http = require("http");
const pug = require("pug");
const port = 3000;
const compiledFunction = pug.compileFile("template.pug")

var FileReader = require("fs");


const server = http.createServer(
    (req, res) => {
        var table = [];

        console.log(req.url, req.url.split('/')[req.url.length - 1])
        console.log(res.data)

        // var filePath = '.' + req.url;
        var filePath = "./data.csv";
        FileReader.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log(data);
                table = data;
            }
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');

        const generatedTemplate = compiledFunction({
            list: table
        })
        res.end(generatedTemplate)
    }
)




server.listen(port, () => {
    console.log(`Server running at port ${port}`);
})