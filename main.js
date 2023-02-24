const config = require('./config.json')
const dir = require('node-dir');
const fs = require('fs');
const { translate } = require('bing-translate-api');

const { PATH, EXPECTED_LANGUAGE, REQUEST_TIMEOUT } = config;
const CP_DIRS = require('./cp_dirs.json');
const CP_FILES = require('./cp_files.json');

// reset("cp_dirs.json");
// reset("cp_files.json");

(async () => {
    const { files, dirs } = await dir.promiseFiles(PATH, 'all')
    filesArr = extract(files)
    dirsArr = extract(dirs)
    await translateFile(dirsArr, CP_DIRS)
    await translateFile(filesArr, CP_FILES)
})()

/**
 * This function is responsible to reset all persisted checkpoint values
 * 
 * @param {String} filename 
 * -- checkpoint file to reset 
 * - value (cp_dirs|cp_files)
 */
function reset(filename) {
    fs.writeFileSync(filename, JSON.stringify({
        LAST_FILE_INDEX: 0,
        PATH: filename
    }))

    console.log("Reset complete", filename)
}

/**
 * This function is responsible to create delay between commands
 * 
 * @param {Number} ms Milisecond
 */
var delay = ms => new Promise(resolve => setTimeout(resolve, ms))

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
 * @param {Number} checkpoint Last translated file index/Checkpoint
 * @param {Object} files Array of object containing extracted path and filename
 */
var translateFile = async (files, checkpoint) => {
    let checkpointIndex = checkpoint.LAST_FILE_INDEX
    if (checkpointIndex > 1) console.log("Checkpoint index found!")

    console.log(`Expected finish in ${Math.ceil(files.length * REQUEST_TIMEOUT / 60)} Minutes`)

    let index = 0
    for (const file of files) {
        const { path, fileName } = file

        console.log(checkpointIndex, index)
        if (checkpointIndex > 1 && checkpointIndex > index) {
            index++
            continue
        }
        else {
            await delay(REQUEST_TIMEOUT)
            const { translation } = await translate(fileName, null, EXPECTED_LANGUAGE)
            fs.rename(path + fileName, path + translation, err => {
                if (err) console.log(err)
                console.log(checkpointIndex, fileName)
            })

            fs.writeFileSync(checkpoint.PATH, JSON.stringify({
                LAST_FILE_INDEX: checkpointIndex,
                PATH: checkpoint.PATH
            }))
        }
        index++
        checkpointIndex++
    }
}

