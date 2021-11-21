import { MergeStrategy } from './merge-strategy';
import convert, { Element } from 'xml-js';

/**
 * Strategy for merging translation files of type XTB.
 */
export class XtbMergeStrategy implements MergeStrategy<Element> {
  readonly extension = 'xtb';

  parseToObject(fileContent: string): Element {
    return convert.xml2js(fileContent) as Element;
  }

  addPrefixToMessageIds(translationObject: Element, prefix: string, separator: string): Element {
    const translationBundle = translationObject.elements?.find(
      (element) => element.name === 'translationbundle'
    );
    if (!translationBundle) {
      return translationObject;
    }
    const translations = translationBundle.elements?.filter(
      (element) => element.name === 'translation'
    );

    if (!translations) {
      return translationObject;
    }

    translations.forEach((translation) => {
      if (!translation.attributes) {
        return;
      }
      translation.attributes['id'] = prefix + separator + translation.attributes['id'];
    });

    return translationObject;
  }

  mergeObjects(languageCode: string, partialTranslationObjects: Element[]): Element {
    const mergedObject: Element = this.getBaseMergedObject(languageCode);

    const translationBundle = mergedObject.elements!.find(
      (element) => element.name === 'translationbundle'
    )!;
    translationBundle.elements = [];

    partialTranslationObjects.forEach((partialTranslationObject) => {
      const partialTranslationBundle = partialTranslationObject.elements?.find(
        (element) => element.name === 'translationbundle'
      );
      if (!partialTranslationBundle) {
        return;
      }
      const translations = partialTranslationBundle.elements?.filter(
        (element) => element.name === 'translation'
      );
      if (!translations) {
        return;
      }
      translationBundle.elements?.push(...translations);
    });

    return mergedObject;
  }

  private getBaseMergedObject(languageCode: string): Element {
    return convert.xml2js(
      `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE translationbundle [
        <!ELEMENT translationbundle (translation)*>
        <!ATTLIST translationbundle lang CDATA #REQUIRED>

        <!ELEMENT translation (#PCDATA|ph)*>
        <!ATTLIST translation id CDATA #REQUIRED>
        <!ATTLIST translation desc CDATA #IMPLIED>
        <!ATTLIST translation meaning CDATA #IMPLIED>
        <!ATTLIST translation xml:space (default|preserve) "default">

        <!ELEMENT ph (#PCDATA|ex)*>
        <!ATTLIST ph name CDATA #REQUIRED>

        <!ELEMENT ex (#PCDATA)>
        ]>
      <translationbundle lang="${languageCode}">
      </translationbundle>`
    ) as Element;
  }

  objectToString(mergedObject: Element): string {
    return convert.js2xml(mergedObject, {
      spaces: 2,
    });
  }
}
