const masterPath = "D:\\Torrent";
const translateFileLimit = 5;
const translateFileTimeout = 2000;
const lang = "en";
const dir = require('node-dir');
const fs = require('fs');
const { translate } = require('bing-translate-api');
const failedFileProcess = [];

dir.promiseFiles(masterPath, 'all')
    .then(files => {
        filesArr = extract(files.files)
        dirsArr = extract(files.dirs)

        translateFile(dirsArr)
        translateFile(filesArr)

        if (failedFileProcess.length > 0)
            fs.writeFileSync('failedFileProcess.json', JSON.stringify(failedFileProcess))
    })
    .catch(err => {
        console.log(err)
        failedFileProcess.push({ path: err.path })
    })

/**
 * This function is responsible to create delay between commands
 * 
 * @param {Number} ms Milisecond
 */
var delay = ms => {
    console.log("Delay invoked")
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * This function is responsible to extract path and its file name
 * 
 * @param {Array} src source array containing multiple attribute
 */
var extract = src =>
    src.map(file => {
        const [_, path, fileName] = file.match(/(.*\\)(.*)/)
        return { path, fileName }
    })

/**
 * This function is responsible to translate and replace file
 * 
 * @param {Object} obj Array of object containing extracted path and filename
 */
var translateFile = async obj => {
    let index = 0
    for (const file of obj) {
        const { path, fileName } = file

        if (index % translateFileLimit === 0) await delay(translateFileTimeout)
        console.log(index, fileName)
        // await translate(fileName, null, lang).then(async ({ translation }) => {
        //     console.log(fileName)
        //     try {
        //         fs.rename(path + fileName, path + translation, err => {
        //             if (err) console.log(err)
        //             index++
        //         })
        //     } catch (error) {
        //         failedFileProcess.push({ path, fileName })
        //     }
        // })
    }
}

