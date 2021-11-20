import { MergeStrategy } from './merge-strategy';
import convert, { Element } from 'xml-js';

/**
 * Strategy for merging translation files of type XLIFF 1.2.
 */
export class Xliff12MergeStrategy implements MergeStrategy<Element> {
  extension = 'xlf';

  parseToObject(fileContent: string): Element {
    return convert.xml2js(fileContent) as Element;
  }

  addPrefixToMessageIds(translationObject: Element, prefix: string, separator: string): Element {
    const body = translationObject.elements?.find((element) => element.name === 'body');
    if (!body) {
      return translationObject;
    }
    const transUnits = body.elements?.filter((element) => element.name === 'trans-unit');

    if (!transUnits) {
      return translationObject;
    }

    transUnits.forEach((transUnit) => {
      if (!transUnit.attributes) {
        return;
      }
      transUnit.attributes['id'] = prefix + separator + transUnit.attributes['id'];
    });

    return translationObject;
  }

  mergeObjects(languageCode: string, partialTranslationObjects: Element[]): Element {
    const mergedObject: Element = this.getBaseMergedObject(languageCode);

    const file = mergedObject.elements![0].elements!.find((element) => element.name === 'file');
    const body = file!.elements!.find((element) => element.name === 'body')!;
    body.elements = [];

    partialTranslationObjects.forEach((partialTranslationObject) => {
      const partialBody = partialTranslationObject.elements?.find(
        (element) => element.name === 'body'
      );
      if (!partialBody) {
        return;
      }
      const transUnits = partialBody.elements?.filter((element) => element.name === 'trans-unit');
      if (!transUnits) {
        return;
      }
      body.elements?.push(...transUnits);
    });

    return mergedObject;
  }

  private getBaseMergedObject(languageCode: string): Element {
    return convert.xml2js(`<?xml version="1.0" encoding="UTF-8" ?>
        <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
          <file source-language="${languageCode}" datatype="plaintext" original="ng2.template">
            <body>
            </body>
          </file>
        </xliff>`) as Element;
  }

  objectToString(mergedObject: Element): string {
    return convert.js2xml(mergedObject, {
      spaces: 2,
    });
  }
}
