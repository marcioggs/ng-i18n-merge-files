import { MergeStrategy } from './strategies/merge-strategy';
import glob from 'glob';
import fs from 'fs';
import path from 'path';
import * as changeCase from 'change-case';
import { IdPrefixStrategyType } from '../arguments/arguments';

/**
 * Class that will merge the translation files by applying the given merge strategy for the chosen format.
 */
export class MergeExecutor {
  /**
   * Used to find the files to be merged.
   * @type {string}
   */
  private readonly translationFilenamesGlobPattern = `/**/*.messages.*.${this.mergerInterface.extension}`;
  /**
   * Used to extract the language code from the filename.
   *
   * e.g. component-one.messages.fr.json -> fr
   * @type {RegExp}
   */
  private readonly translationFileLanguageCodeRegexPattern = `.messages.(.*).${this.mergerInterface.extension}$`;

  /**
   * Used to extract the translation file base name from the filename.
   *
   * e.g. component-one.messages.fr.json -> component-one
   * @type {RegExp}
   */
  private readonly translationFileBaseNameRegexPattern = `^(.*).messages.*.${this.mergerInterface.extension}$`;
  /**
   * Character that will be used to separate the prefix from the message id.
   *
   * e.g. "componentName.messageId"
   */
  private readonly messagePrefixSeparator = '.';

  constructor(private mergerInterface: MergeStrategy<any>) {}

  /**
   * Merges the partial translation files found in the inputRootFolder and saves to the outputFolder.
   *
   * If the idPrefix is set to true, the translation messages id will be prefixed with the name of the translation file.
   *
   * @param inputRootFolder Input root folder containing partial message files
   * @param outputFolder Output folder where the merged files will be saved
   * @param idPrefix If a prefix based on the translation filename will be added to the translation keys
   * @param idPrefixStrategy Naming strategy used to create the idPrefix
   */
  merge(
    inputRootFolder: string,
    outputFolder: string,
    idPrefix: boolean,
    idPrefixStrategy: IdPrefixStrategyType
  ): void {
    const partialTranslationFilePaths = glob.sync(
      inputRootFolder + this.translationFilenamesGlobPattern
    );

    const languageToPartialTranslationObjectsMap = this.buildLanguageToPartialTranslationObjectsMap(
      partialTranslationFilePaths,
      idPrefix,
      idPrefixStrategy
    );

    const mergedTranslationObjectsMap = this.mergePartialTranslationObjects(
      languageToPartialTranslationObjectsMap
    );

    this.saveToFiles(mergedTranslationObjectsMap, outputFolder);
  }

  /**
   * Builds a map containing the partial translation objects grouped by language and adds the prefix to the message id
   * if idPrefix is set.
   *
   * @param partialTranslationFilePaths Path of the partial translation file paths
   * @param idPrefix If the prefix should be added to the message ids
   * @param idPrefixStrategy Naming strategy used to create the idPrefix
   */
  private buildLanguageToPartialTranslationObjectsMap(
    partialTranslationFilePaths: string[],
    idPrefix: boolean,
    idPrefixStrategy: IdPrefixStrategyType
  ): Map<string, any[]> {
    const languageToPartialTranslationObjectsMap = new Map<string, any[]>();

    partialTranslationFilePaths.forEach((partialTranslationFilePath) => {
      const partialTranslationFileContent = fs.readFileSync(partialTranslationFilePath, 'utf8');

      let partialTranslationObject: any;
      try {
        partialTranslationObject = this.mergerInterface.parseToObject(
          partialTranslationFileContent
        );
      } catch (error: any) {
        throw {
          error: error.name,
          message: error.message,
          file: partialTranslationFilePath,
        };
      }

      if (idPrefix) {
        partialTranslationObject = this.addPrefixToMessageIds(
          partialTranslationObject,
          idPrefixStrategy,
          partialTranslationFilePath
        );
      }

      const partialTranslationObjectsPerLanguage = this.getLanguagePartialTranslationObjects(
        languageToPartialTranslationObjectsMap,
        partialTranslationFilePath
      );
      partialTranslationObjectsPerLanguage.push(partialTranslationObject);
    });

    return languageToPartialTranslationObjectsMap;
  }

  /**
   * Adds a prefix based on the file name to the message ids contained in the translation object.
   *
   * @param partialTranslationObject Translation object
   * @param idPrefixStrategy Naming strategy used to create the idPrefix
   * @param partialTranslationFilePath File path, used to define the prefix
   */
  private addPrefixToMessageIds(
    partialTranslationObject: any,
    idPrefixStrategy: IdPrefixStrategyType,
    partialTranslationFilePath: string
  ) {
    const translationFileBaseName = this.getTranslationFileBaseName(partialTranslationFilePath);
    const messagePrefix = this.buildMessagePrefix(translationFileBaseName, idPrefixStrategy);
    return this.mergerInterface.addPrefixToMessageIds(
      partialTranslationObject,
      messagePrefix,
      this.messagePrefixSeparator
    );
  }

  /**
   * Extracts the translation file base name from its full path.
   *
   * e.g. .../some/path/component-one.messages.fr.json -> component-one
   *
   * @param translationFilePath Translation file path
   * @returns Base name of the translation file
   */
  private getTranslationFileBaseName(translationFilePath: string): string {
    const translationFilename = path.basename(translationFilePath);
    return new RegExp(this.translationFileBaseNameRegexPattern, 'i').exec(translationFilename)![1];
  }

  /**
   * Builds the message id by adding the prefix based on the filename.
   *
   * @param baseFilename The base filename (e.g. component-one)
   * @param prefixStrategy Prefix naming strategy
   * @returns Translation id
   */
  private buildMessagePrefix(baseFilename: string, prefixStrategy: IdPrefixStrategyType): string {
    let messageId;
    switch (prefixStrategy) {
      case IdPrefixStrategyType.asIs:
        messageId = baseFilename;
        break;
      case IdPrefixStrategyType.dotCase:
        messageId = changeCase.dotCase(baseFilename);
        break;
      default:
        messageId = changeCase.camelCase(baseFilename);
    }

    return messageId;
  }

  /**
   * Gets the array containing the partial translation objects of a specific language.
   *
   * @param languageToPartialTranslationObjectsMap Map containing the partial translation objects grouped by language
   * @param partialTranslationFilePath Path of the translation file, used to extract the language
   */
  private getLanguagePartialTranslationObjects(
    languageToPartialTranslationObjectsMap: Map<string, any[]>,
    partialTranslationFilePath: string
  ): any[] {
    const languageCode = this.getLanguageCodeFromFilePath(partialTranslationFilePath);

    let partialTranslationObjectsPerLanguage: any[];
    if (languageToPartialTranslationObjectsMap.has(languageCode)) {
      partialTranslationObjectsPerLanguage =
        languageToPartialTranslationObjectsMap.get(languageCode)!;
    } else {
      partialTranslationObjectsPerLanguage = [];
      languageToPartialTranslationObjectsMap.set(
        languageCode,
        partialTranslationObjectsPerLanguage
      );
    }
    return partialTranslationObjectsPerLanguage;
  }

  /**
   * Merges the partial translation objects from a map containing the objects grouped by language.
   *
   * @param languageToPartialTranslationObjectsMap Map containing the key as the language and the value as the merged
   * translation object
   */
  private mergePartialTranslationObjects(
    languageToPartialTranslationObjectsMap: Map<string, any[]>
  ): Map<string, any> {
    const mergedTranslationObjectsMap = new Map<string, any>();

    languageToPartialTranslationObjectsMap.forEach((partialTranslationObjects, languageCode) => {
      const mergedObjects = this.mergerInterface.mergeObjects(
        languageCode,
        partialTranslationObjects
      );
      mergedTranslationObjectsMap.set(languageCode, mergedObjects);
    });

    return mergedTranslationObjectsMap;
  }

  /**
   * Save the translation objects to files.
   *
   * @param mergedTranslationObjectsMap Merged translation objects map
   * @param outputFolder Output folder
   */
  private saveToFiles(mergedTranslationObjectsMap: Map<string, any>, outputFolder: string): void {
    fs.mkdirSync(outputFolder, { recursive: true });

    mergedTranslationObjectsMap.forEach((mergedTranslationObject, languageCode) => {
      const mergedTranslationFileContent =
        this.mergerInterface.objectToString(mergedTranslationObject);

      const mergedTranslationFilePath =
        outputFolder + `/messages.${languageCode}.${this.mergerInterface.extension}`;

      fs.writeFileSync(mergedTranslationFilePath, mergedTranslationFileContent);

      console.log(
        `Merged translation file generated at: ${path.normalize(mergedTranslationFilePath)}`
      );
    });
  }

  /**
   * Extracts the language code from the file path.
   *
   * e.g. .../some/path/component-one.messages.fr.json -> fr
   *
   * @param filename Filename
   * @returns Language code
   */
  private getLanguageCodeFromFilePath(filename: string): string {
    return new RegExp(this.translationFileLanguageCodeRegexPattern, 'i').exec(filename)![1];
  }
}
