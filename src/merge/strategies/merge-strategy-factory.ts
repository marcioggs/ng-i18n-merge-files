import { MergeStrategy } from './merge-strategy';
import { JsonMergeStrategy } from './json-merge-strategy';

/**
 * Resolves the merger strategy class for the given translation file format.
 */
export class MergeStrategyFactory {
  getStrategy(format: string): MergeStrategy<any> | undefined {
    let mergeStrategy: MergeStrategy<any> | undefined;

    switch (format) {
      case 'json':
        mergeStrategy = new JsonMergeStrategy();
        break;
      // TODO: Implement mergers for formats described at https://angular.io/guide/i18n-common-translation-files#change-the-source-language-file-format.
    }

    return mergeStrategy;
  }
}
