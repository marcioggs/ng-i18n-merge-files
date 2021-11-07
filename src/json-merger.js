const glob = require('glob');
const fs = require('fs');
const path = require('path');

const messagesFilenameGlobPattern = '/**/*.messages.*.json';
const messagesFilenameRegex = /.messages.(.*).json$/i;

/**
 * Merges the multiple partial messages files into a single message file per language.
 *
 * It will recursively find partial message files with pattern '/xx/x.messages.x.json' under the input root folder and
 * create an output file at the output folder for each of the languages found.
 *
 * @param inputRootFolder Input root folder containing partial message files
 * @param outputFolder Output folder where the merged files will be saved
 */
function merge(inputRootFolder, outputFolder) {

    glob(inputRootFolder + messagesFilenameGlobPattern, {}, (err, messageFilePaths) => {
        if (err) {
            console.error(err);
            process.exit(-1);
        }

        const langJsonMap = buildLangJsonMap(messageFilePaths);
        saveToFiles(langJsonMap, outputFolder);

        if (langJsonMap.size === 0) {
            console.warn(`Didn't find any files on folder '${inputRootFolder}' matching pattern '${messagesFilenameGlobPattern}'.`);
        }
    });
}

/**
 * Builds a map containing the language code as the key and the JSON on the format expected by Angular Localization as the key.
 *
 * @param messageFilePaths Paths of the files containing partial translation
 * @returns Map
 */
function buildLangJsonMap(messageFilePaths) {
    let langJsonMap = new Map();

    messageFilePaths.forEach(messageFilePath => {

        const messageFileContent = fs.readFileSync(messageFilePath, 'utf8');
        const messageJson = JSON.parse(messageFileContent);

        const langCode = getLanguageCodeFromFilename(messageFilePath);

        if (!langJsonMap.has(langCode)) {
            langJsonMap.set(langCode, {locale: langCode, translations: {}});
        }

        const mergedJson = langJsonMap.get(langCode);
        Object.assign(mergedJson.translations, messageJson);
    });

    return langJsonMap;
}

/**
 * Saves all the translation files present in the language JSON map to the output folder
 *
 * @param langJsonMap Language JSON map
 * @param outputFolder Output folder where the merged files will be saved
 */
function saveToFiles(langJsonMap, outputFolder) {
    fs.mkdirSync(outputFolder, {recursive: true});

    langJsonMap.forEach((json, language) => {

        const mergedFilePath = outputFolder + `/messages.${language}.json`;
        fs.writeFileSync(mergedFilePath, JSON.stringify(json, null, 2));

        console.log(`Merged translation file generated at: ${path.normalize(mergedFilePath)}`);
    });
}

/**
 * Extracts the language code from the filename.
 *
 * @param filename Filename
 * @returns Language code
 */
function getLanguageCodeFromFilename(filename) {
    return messagesFilenameRegex.exec(filename)[1];
}

module.exports = {merge};