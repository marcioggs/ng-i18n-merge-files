const path = require('path');
const yargs = require('yargs');

const defaultFolder = '/src';

/**
 * Gets the command line arguments.
 *
 * @returns Command line arguments
 */
function getArgs() {

    const srcFolder = path.normalize(process.cwd() + defaultFolder);

    const args = yargs
        .option('in', {
            description: 'Folder which will be searched recursively for translation files to be merged.',
            alias: 'i',
            default: srcFolder,
            type: 'string',
        })
        .option('out', {
            description: 'Folder where the merged translation files will be saved to.',
            alias: 'o',
            default: path.normalize(srcFolder + '/locale'),
            type: 'string',
        })
        .option('format', {
            description: 'Format of the translation file. Currently only json is supported.',
            alias: 'f',
            choices: ['json'],
            demandOption: true
        })
        .option('mergeFilename', {
            description: 'Add filename to key name',
            alias: 'm',
            default: false,
            type: 'boolean'
        })
        .option('defaultLanguage', {
            description: 'Default language of the app. Language code would be removed from filename',
            alias: 'l',
            default: 'en',
            type: 'string'
        })
        .help()
        .alias('help', 'h')
        .argv;

    const inPathname = Array.isArray(args.in) ? args.in[args.in.length - 1] : args.in
    args.in = getAbsolutePath(inPathname);
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
function getAbsolutePath(givenPath) {
    if (path.isAbsolute(givenPath)) {
        return givenPath;
    } else {
        return path.resolve(process.cwd(), givenPath);
    }
}

module.exports = {get: getArgs};