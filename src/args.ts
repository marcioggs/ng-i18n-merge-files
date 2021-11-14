import yargs from 'yargs';
import * as path from 'path';
import { hideBin } from 'yargs/helpers';

const defaultFolder = '/src';

/**
 * Gets the command line arguments.
 *
 * @returns Command line arguments
 */
export function getArgs(): any {
  const srcFolder = path.normalize(process.cwd() + defaultFolder);

  const args = yargs(hideBin(process.argv))
    .options({
      in: {
        description:
          'Folder which will be searched recursively for translation files to be merged.',
        alias: 'i',
        default: srcFolder,
        type: 'string',
      },
      out: {
        description: 'Folder where the merged translation files will be saved to.',
        alias: 'o',
        default: path.normalize(srcFolder + '/locale'),
        type: 'string',
      },
      format: {
        description: 'Format of the translation file. Currently only json is supported.',
        alias: 'f',
        choices: ['json'],
        demandOption: true,
      },
      'id-prefix': {
        description:
          'Adds a prefix to the translation identifier based on the translation filename (see --id-prefix-strategy)',
        alias: 'ip',
        default: false,
        type: 'boolean',
      },
      'id-prefix-strategy': {
        description:
          'Naming strategy applied to the translation filename to generate the identifier prefix',
        alias: 'ips',
        default: 'camel-case',
        choices: ['camel-case', 'as-is', 'dot-case'],
      },
    })
    .help()
    .alias('help', 'h')
    .parseSync();

  args.in = getAbsolutePath(args.in);
  args.out = getAbsolutePath(args.out);

  return args;
}

/**
 * Gets the given path as an absolute path.
 *
 * If the path is relative, it will be resolved against the current working directory.
 *
 * @param givenPath Given path
 * @returns Absolute path
 */
function getAbsolutePath(givenPath: string): string {
  if (path.isAbsolute(givenPath)) {
    return givenPath;
  } else {
    return path.resolve(process.cwd(), givenPath);
  }
}
