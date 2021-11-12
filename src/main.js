#!/usr/bin/env node

const args = require('./args').get();
const jsonMerger = require('./json-merger');

if (args.format === 'json') {
    jsonMerger.merge(args.in, args.out, args.mergeFilename, args.defaultLanguage);
} else {
    // TODO: Implement mergers for formats described at https://angular.io/guide/i18n-common-translation-files#change-the-source-language-file-format.
    console.error(`Format '${args.format}' is not implemented. Support the community by sending a pull request.`);
}
