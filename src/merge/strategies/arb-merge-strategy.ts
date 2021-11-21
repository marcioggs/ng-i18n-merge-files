import { MergeStrategy } from './merge-strategy';

/**
 * Strategy for merging translation files of type ARB (Application Resource Bundle).
 */
export class ArbMergeStrategy implements MergeStrategy<Object> {
  readonly extension = 'arb';
  private readonly metaAttributeCharacter = '@';

  parseToObject(fileContent: string): Object {
    return JSON.parse(fileContent);
  }

  addPrefixToMessageIds(translationObject: Object, prefix: string, separator: string): Object {
    for (const propertyId in translationObject) {
      const isMetaAttribute = propertyId.startsWith(this.metaAttributeCharacter);
      const messageId = isMetaAttribute ? propertyId.substring(1) : propertyId;

      const prefixedMessageId =
        (isMetaAttribute ? this.metaAttributeCharacter : '') + prefix + separator + messageId;

      Object.defineProperty(
        translationObject,
        prefixedMessageId,
        Object.getOwnPropertyDescriptor(translationObject, propertyId)!
      );
      // @ts-ignore
      delete translationObject[propertyId];
    }

    return translationObject;
  }

  mergeObjects(languageCode: string, partialTranslationObjects: Object[]): Object {
    const mergedJson = {
      '@@locale': languageCode,
    };

    partialTranslationObjects.forEach((partialTranslationObject) => {
      Object.assign(mergedJson, partialTranslationObject);
    });

    return mergedJson;
  }

  objectToString(mergedObject: Object): string {
    const jsonStringifySpacesPrettyPrint = 2;
    return JSON.stringify(mergedObject, null, jsonStringifySpacesPrettyPrint);
  }
}
