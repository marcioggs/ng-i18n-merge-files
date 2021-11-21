import { MergeStrategy } from './merge-strategy';
import convert, { Element } from 'xml-js';

/**
 * Strategy for merging translation files of type XLIFF 2.0.
 */
export class Xliff20MergeStrategy implements MergeStrategy<Element> {
  readonly extension = 'xlf';

  parseToObject(fileContent: string): Element {
    return convert.xml2js(fileContent) as Element;
  }

  addPrefixToMessageIds(translationObject: Element, prefix: string, separator: string): Element {
    const file = translationObject.elements?.find((element) => element.name === 'file');
    if (!file) {
      return translationObject;
    }
    const units = file.elements?.filter((element) => element.name === 'unit');

    if (!units) {
      return translationObject;
    }

    units.forEach((transUnit) => {
      if (!transUnit.attributes) {
        return;
      }
      transUnit.attributes['id'] = prefix + separator + transUnit.attributes['id'];
    });

    return translationObject;
  }

  mergeObjects(languageCode: string, partialTranslationObjects: Element[]): Element {
    const mergedObject: Element = this.getBaseMergedObject(languageCode);

    const file = mergedObject.elements![0].elements!.find((element) => element.name === 'file')!;
    file.elements = [];

    partialTranslationObjects.forEach((partialTranslationObject) => {
      const partialFile = partialTranslationObject.elements?.find(
        (element) => element.name === 'file'
      );
      if (!partialFile) {
        return;
      }
      const units = partialFile.elements?.filter((element) => element.name === 'unit');
      if (!units) {
        return;
      }
      file.elements?.push(...units);
    });

    return mergedObject;
  }

  private getBaseMergedObject(languageCode: string): Element {
    return convert.xml2js(
      `<?xml version="1.0" encoding="UTF-8" ?>
      <xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="${languageCode}">
        <file id="ngi18n" original="ng.template">
        </file>
      </xliff>`
    ) as Element;
  }

  objectToString(mergedObject: Element): string {
    return convert.js2xml(mergedObject, {
      spaces: 2,
    });
  }
}
