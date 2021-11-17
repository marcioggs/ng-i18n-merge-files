/**
 * Defines the interface for the behavior specific to the merge strategy of a specific translation file format.
 *
 * @template ObjectRepresentation Type of the translation file object representation
 */
export interface MergeStrategy<ObjectRepresentation> {
  /**
   * Translation file extension.
   */
  extension: string;

  /**
   * Parses the translation file content to an object representation that supports easy manipulation.
   * This method will be called once per translation file and its return will be used on other methods of this interface.
   *
   * @param fileContent Translation file content
   * @return Translation file representation
   */
  parseToObject(fileContent: string): ObjectRepresentation;

  /**
   * Adds a prefix to the translation message ids.
   * This method will be called once per translation file if the user decided to add the prefix via command line arguments.
   *
   * @param translationObject Translation file object representation
   * @param prefix Prefix to be added
   * @param separator Character that will separate the prefix from the message id
   * @return Translation file representation with the added prefixes
   */
  addPrefixToMessageIds(
    translationObject: ObjectRepresentation,
    prefix: string,
    separator: string
  ): ObjectRepresentation;

  /**
   * Merges multiple translation files of the same language.
   * This method will be called once per language found.
   *
   * @param languageCode Language code, which is expected by Angular in the final file content
   * @param partialTranslationObjects Partial translation objects
   * @return Merged translation file representation
   */
  mergeObjects(
    languageCode: string,
    partialTranslationObjects: ObjectRepresentation[]
  ): ObjectRepresentation;

  /**
   * Parses the final object representation to a string, which will be used to write the final translation file.
   * This method will be called once per language found.
   *
   * @param mergedObjects Merged objects
   */
  objectToString(mergedObjects: ObjectRepresentation): string;
}
