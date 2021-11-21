#!/usr/bin/env node

import { ArgumentsParser } from './arguments/arguments-parser';
import { MergeExecutor } from './merge/merge-executor';
import { MergeStrategyFactory } from './merge/strategies/merge-strategy-factory';

const args = new ArgumentsParser().parse(process.argv, process.cwd());

const mergeStrategy = new MergeStrategyFactory().getStrategy(args.format);

if (!mergeStrategy) {
  console.error(`Format '${args.format}' is unknown.`);
  process.exit(-1);
}

try {
  new MergeExecutor(mergeStrategy).merge(
    args.inputRootFolder,
    args.outputFolder,
    args.idPrefix,
    args.idPrefixStrategy
  );
} catch (error) {
  console.error(error);
  process.exit(-1);
}
