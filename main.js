const masterPath = "E:\\Software\\Microsoft VS Code"
/* const fs = require("fs");

let currentPath = masterPath

const filesArr = [], foldersArr = []

let parentFolders = 0
while (true) {
    const folders = fs.readdirSync(currentPath).filter(file => !file.includes('.'))
    parentFolders = folders.length
    if(!folders)
    for (const folder of folders) {
        foldersArr.push(folder)
        currentPath += `\\${folder}`
        const files = fs.readdirSync(currentPath).filter(file => file.includes('.'))
        if(files.length <= 0) break
        for (const file of files) {
            filesArr.push(file)
        }
        break
    }
    break
}

console.log("Folders: ", foldersArr)
console.log("Files: ", filesArr) */

let fs = require('fs');
let path = require('path');

const files = [], folders = []
let walk = function (dir, done) {
    let results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        folders.push(file)
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    files.push(file)

                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

walk(masterPath, (err, results) => {
    if (err) throw err

    console.log("results", results.length)
    console.log("files", files.length, "folders", folders.length)
    fs.writeFileSync('files.json', JSON.stringify(files))
    fs.writeFileSync('folders.json', JSON.stringify(folders))
})