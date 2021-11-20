import yargs from 'yargs';
import * as path from 'path';
import { hideBin } from 'yargs/helpers';
import { Arguments, IdPrefixStrategyType, parseIdPrefixStrategyType } from './arguments';

export class ArgumentsParser {
  private readonly srcFolderRelativePath = '/src';

  parse(rawArgs: string[], currentPath: string): Arguments {
    const srcFolderPath = path.normalize(currentPath + this.srcFolderRelativePath);

    const yargsArgs = yargs(hideBin(rawArgs))
      .options({
        in: {
          description:
            'Folder which will be searched recursively for translation files to be merged.',
          alias: 'i',
          default: srcFolderPath,
          type: 'string',
        },
        out: {
          description: 'Folder where the merged translation files will be saved to.',
          alias: 'o',
          default: path.normalize(srcFolderPath + '/locale'),
          type: 'string',
        },
        format: {
          description: 'Format of the translation file.',
          alias: 'f',
          choices: ['arb', 'json', 'xlf', 'xlf2'],
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
          default: IdPrefixStrategyType.camelCase,
          choices: Object.values(IdPrefixStrategyType),
        },
      })
      .help()
      .alias('help', 'h')
      .parseSync();

    return {
      inputRootFolder: this.getAbsolutePath(currentPath, yargsArgs.in),
      outputFolder: this.getAbsolutePath(currentPath, yargsArgs.out),
      format: yargsArgs.format,
      idPrefix: yargsArgs['id-prefix'],
      idPrefixStrategy: parseIdPrefixStrategyType(yargsArgs['id-prefix-strategy']),
    };
  }

  /**
   * Gets the given path as an absolute path.
   *
   * If the given path is relative, it will be resolved against the current path.
   *
   * @param currentPath Current path
   * @param givenPath Given path
   * @returns Absolute path
   */
  private getAbsolutePath(currentPath: string, givenPath: string): string {
    if (path.isAbsolute(givenPath)) {
      return givenPath;
    } else {
      return path.resolve(currentPath, givenPath);
    }
  }
}
