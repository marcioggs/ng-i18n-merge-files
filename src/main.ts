#!/usr/bin/env node

import { ArgumentsParser } from './arguments/arguments-parser';
import { MergeExecutor } from './merge/merge-executor';
import { MergeStrategyFactory } from './merge/strategies/merge-strategy-factory';

const args = new ArgumentsParser().parse(process.argv, process.cwd());

let mergeStrategy = new MergeStrategyFactory().getStrategy(args.format);

if (!mergeStrategy) {
  console.error(
    `Format '${args.format}' is not implemented. Support the community by sending a pull request.`
  );
  process.exit(-1);
}

new MergeExecutor(mergeStrategy).merge(
  args.inputRootFolder,
  args.outputFolder,
  args.idPrefix,
  args.idPrefixStrategy
);
