import { MergeStrategy } from './merge-strategy';

/**
 * Strategy for merging translation files of type JSON.
 */
export class JsonMergeStrategy implements MergeStrategy<Object> {
  extension = 'json';

  parseToObject(fileContent: string): Object {
    return JSON.parse(fileContent);
  }

  addPrefixToMessageIds(translationObject: Object, prefix: string, separator: string): Object {
    for (const messageId in translationObject) {
      const prefixedMessageId = prefix + separator + messageId;

      Object.defineProperty(
        translationObject,
        prefixedMessageId,
        Object.getOwnPropertyDescriptor(translationObject, messageId)!
      );
      // @ts-ignore
      delete translationObject[messageId];
    }

    return translationObject;
  }

  mergeObjects(languageCode: string, partialTranslationObjects: Object[]): Object {
    const mergedJson = {
      locale: languageCode,
      translations: {},
    };

    partialTranslationObjects.forEach((partialTranslationObject) => {
      Object.assign(mergedJson.translations, partialTranslationObject);
    });

    return mergedJson;
  }

  objectToString(mergedObject: Object): string {
    const jsonStringifySpacesPrettyPrint = 2;
    return JSON.stringify(mergedObject, null, jsonStringifySpacesPrettyPrint);
  }
}
