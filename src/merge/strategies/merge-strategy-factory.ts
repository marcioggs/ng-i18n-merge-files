import { MergeStrategy } from './merge-strategy';
import { JsonMergeStrategy } from './json-merge-strategy';
import { Xliff12MergeStrategy } from './xliff12-merge-strategy';
import { Xliff20MergeStrategy } from './xliff20-merge-strategy';
import { ArbMergeStrategy } from './arb-merge-strategy';
import { XtbMergeStrategy } from './xtb-merge-strategy';

/**
 * Resolves the merger strategy class for the given translation file format.
 */
export class MergeStrategyFactory {
  getStrategy(format: string): MergeStrategy<any> | undefined {
    let mergeStrategy: MergeStrategy<any> | undefined;

    switch (format) {
      case 'arb':
        mergeStrategy = new ArbMergeStrategy();
        break;
      case 'json':
        mergeStrategy = new JsonMergeStrategy();
        break;
      case 'xlf':
        mergeStrategy = new Xliff12MergeStrategy();
        break;
      case 'xlf2':
        mergeStrategy = new Xliff20MergeStrategy();
        break;
      case 'xtb':
        mergeStrategy = new XtbMergeStrategy();
    }

    return mergeStrategy;
  }
}
