const masterPath = "D:\\Sources\\Documents\\Projects\\todomvc"
const lang = "zh-Hans"
const dir = require('node-dir');
const fs = require('fs')
const { translate } = require('bing-translate-api');

/**
 * This function is responsible to create delay between command
 */

const delay = ms => {
    console.log("Delay invoked")
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * This function is responsible to extract path and its file name
 * 
 * Parameter:
 * src = source array containing multiple attribute
 */
const extract = src =>
    src.map(file => {
        const [_, path, fileName] = file.match(/(.*\\)(.*)/)
        return { path, fileName }
    })

/**
 * This function is responsible to translate and replace file
 * 
 * Parameter:
 * obj = Array of object containing extracted path and filename
 */

let index = 0
const translateFile = obj => {
    for (const file of obj) {
        const { path, fileName } = file

        // await translate(fileName, null, lang).then(async ({ translation }) => {
        //     console.log(index, "Action Performed")
        //     fs.rename(path + fileName, path + translation, err => {
        //         if (err) console.log(err)
        //         index++
        //     })
        // })
    }
}

dir
    .promiseFiles(masterPath, 'all')
    .then(files => {
        filesArr = extract(files.files)
        dirsArr = extract(files.dirs)

        translateFile(dirsArr)
    })
    .catch(err => console.log(err))