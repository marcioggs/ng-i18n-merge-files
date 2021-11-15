import glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import * as changeCase from 'change-case';

/**
 * Used to find the files to be merged.
 * @type {string}
 */
const translationFilenamesGlobPattern = '/**/*.messages.*.json';
/**
 * Used to extract the language code from the filename.
 *
 * e.g. component-one.messages.fr.json -> fr
 * @type {RegExp}
 */
const translationFileLanguageCodeRegex = /.messages.(.*).json$/i;

/**
 * Used to extract the translation file base name from the filename.
 *
 * e.g. component-one.messages.fr.json -> component-one
 * @type {RegExp}
 */
const translationFileBaseNameRegex = /^(.*).messages./i;

/**
 * Merges the multiple partial messages files into a single message file per language.
 *
 * It will recursively find partial message files with pattern '/xx/x.messages.x.json' under the input root folder and
 * create an output file at the output folder for each of the languages found.
 *
 * @param inputRootFolder Input root folder containing partial message files
 * @param outputFolder Output folder where the merged files will be saved
 * @param idPrefix If a prefix based on the translation filename will be added to the translation keys
 * @param idPrefixStrategy Strategy to create the idPrefix
 */
export function merge(
  inputRootFolder: string,
  outputFolder: string,
  idPrefix: string,
  idPrefixStrategy: string
): void {
  glob(inputRootFolder + translationFilenamesGlobPattern, {}, (err, translationFilePaths) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }

    const mergedTranslationsJsonMap = buildMergedTranslationsJsonMap(
      translationFilePaths,
      idPrefix,
      idPrefixStrategy
    );

    saveMergedTranslationFiles(mergedTranslationsJsonMap, outputFolder);

    if (mergedTranslationsJsonMap.size === 0) {
      console.warn(
        `Didn't find any files on folder '${inputRootFolder}' matching pattern '${translationFilenamesGlobPattern}'.`
      );
    }
  });
}

/**
 * Builds a map containing the language code as the key and the merged translation JSON as the value, already in the
 * format expected by Angular.
 *
 * @param partialTranslationFilePaths Paths of the files containing partial translation
 * @param idPrefix If a prefix based on the translation filename will be added to the translation keys
 * @param idPrefixStrategy Strategy to create the idPrefix
 * @returns Map
 */
function buildMergedTranslationsJsonMap(
  partialTranslationFilePaths: string[],
  idPrefix: string,
  idPrefixStrategy: string
): Map<string, any> {
  const mergedTranslationsJsonMap = new Map<string, any>();

  partialTranslationFilePaths.forEach((partialTranslationFilePath) => {
    const partialTranslationFileContent = fs.readFileSync(partialTranslationFilePath, 'utf8');

    const partialTranslationJson = JSON.parse(partialTranslationFileContent);

    if (idPrefix) {
      addPrefixToTranslationMessageIds(
        partialTranslationJson,
        partialTranslationFilePath,
        idPrefixStrategy
      );
    }

    const languageCode = getLanguageCodeFromFilename(partialTranslationFilePath);

    if (!mergedTranslationsJsonMap.has(languageCode)) {
      mergedTranslationsJsonMap.set(languageCode, {
        locale: languageCode,
        translations: {},
      });
    }

    const mergedTranslationJson = mergedTranslationsJsonMap.get(languageCode);
    Object.assign(mergedTranslationJson.translations, partialTranslationJson);
  });

  return mergedTranslationsJsonMap;
}

/**
 * Adds a prefix to the messages ids on the given translation JSON.
 *
 * @param translationJson JSON that will have the prefix added to
 * @param translationFilePath Translation file path, used to extract the prefix
 * @param idPrefixStrategy Id prefix strategy
 */
function addPrefixToTranslationMessageIds(
  translationJson: any,
  translationFilePath: string,
  idPrefixStrategy: string
): void {
  const translationFileBaseName = getTranslationFileBaseName(translationFilePath);

  for (const property in translationJson) {
    const prefixedMessageId =
      buildMessageId(translationFileBaseName, idPrefixStrategy) + '.' + property;

    Object.defineProperty(
      translationJson,
      prefixedMessageId,
      Object.getOwnPropertyDescriptor(translationJson, property)!
    );
    delete translationJson[property];
  }
}

/**
 * Saves the merged translation JSONs into files.
 *
 * @param mergedTranslationsJsonMap Map containing the language code and the merged translation json
 * @param outputFolder Output folder where the merged files will be saved
 */
function saveMergedTranslationFiles(
  mergedTranslationsJsonMap: Map<string, any>,
  outputFolder: string
): void {
  fs.mkdirSync(outputFolder, { recursive: true });

  mergedTranslationsJsonMap.forEach((mergedTranslationJson, languageCode) => {
    const mergedTranslationFilePath = outputFolder + `/messages.${languageCode}.json`;
    const jsonStringifySpacesPrettyPrint = 2;
    fs.writeFileSync(
      mergedTranslationFilePath,
      JSON.stringify(mergedTranslationJson, null, jsonStringifySpacesPrettyPrint)
    );

    console.log(
      `Merged translation file generated at: ${path.normalize(mergedTranslationFilePath)}`
    );
  });
}

/**
 * Builds the message id.
 *
 * @param baseFilename The base filename (e.g. component-one)
 * @param prefixStrategy Prefix strategy
 * @returns Translation id
 */
function buildMessageId(baseFilename: string, prefixStrategy: string): string {
  let messageId;
  switch (prefixStrategy) {
    case 'as-is':
      messageId = baseFilename;
      break;
    case 'dot-case':
      messageId = changeCase.dotCase(baseFilename);
      break;
    default:
      messageId = changeCase.camelCase(baseFilename);
  }

  return messageId;
}

/**
 * Extracts the translation file base name from its full path.
 *
 * e.g. .../some/path/component-one.messages.fr.json -> component-one
 *
 * @param translationFilePath Translation file path
 * @returns Base name of the translation file
 */
function getTranslationFileBaseName(translationFilePath: string): string {
  const translationFilename = path.basename(translationFilePath);
  return translationFileBaseNameRegex.exec(translationFilename)![1];
}

/**
 * Extracts the language code from the filename.
 *
 * e.g. .../some/path/component-one.messages.fr.json -> fr
 *
 * @param filename Filename
 * @returns Language code
 */
function getLanguageCodeFromFilename(filename: string): string {
  return translationFileLanguageCodeRegex.exec(filename)![1];
}

module.exports = { merge };
