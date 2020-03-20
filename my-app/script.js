var filePath = process.argv[2];
var FileReader = require("fs");
if (!filePath) {
    console.log("Missing argument. Please specify the file's path.");
    process.exit(1); // error code 1
}

FileReader.readFile(filePath, "utf8", (err, data) => {
    if (err) {
        console.error(err);
    } else {
        console.log(data)
    }
});