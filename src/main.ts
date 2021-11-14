#!/usr/bin/env node

import { getArgs } from './args';
import * as jsonMerger from './json-merger';

const args = getArgs();

if (args.format === 'json') {
  jsonMerger.merge(args.in, args.out, args['id-prefix'], args['id-prefix-strategy']);
} else {
  // TODO: Implement mergers for formats described at https://angular.io/guide/i18n-common-translation-files#change-the-source-language-file-format.
  console.error(
    `Format '${args.format}' is not implemented. Support the community by sending a pull request.`
  );
}
