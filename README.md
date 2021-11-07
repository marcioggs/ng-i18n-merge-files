# Angular i18n Merge Files

[![NPM version][npm-version-image]][npm-url]

[npm-url]: https://npmjs.org/package/ng-i18n-merge-files
[npm-version-image]: https://img.shields.io/npm/v/ng-i18n-merge-files.svg?style=flat

## Problem

Angular expects all the translated messages for a specific language to be on a single file, which can result in a large
file that can be difficult to maintain and can promote merge conflicts.

**messages.fr.json**

```json
{
  "locale": "fr",
  "translations": {
    "msg1": "Message 1",
    "msg2": "Message 2",
    "msg3": "Message 3",
    "msg4": "Message 4",
    ...
  }
}
```

## Solution

Angular i18n Merge Files is a tool that generates the final messages file (like the JSON above) by merging multiple
partial message files.

**component-a.messages.fr.json**

```json
{
  "msg1": "Message 1",
  "msg2": "Message 2"
  ...
}
```

**component-b.messages.fr.json**

```json
{
  "msg3": "Message 3",
  "msg4": "Message 4"
  ...
}
```

The name of files to be merged must have the suffix `.messages.[language-code].json` and this tool will automatically
merge it in the final translation file.

## Generating the merged messages file

Install the NPM package for this tool:

```
npm install --save-dev ng-i18n-merge-files
```

And run the following command, which will generate the merged files under `src/locale/messages.[language-code].json`:

```
npx ng-i18n-merge-files -f json
```

### Binding it to existing scripts

This tool can be bind to automatically run before the scripts on package.json that requires the translation files:

**packages.json**

```json
{
  "scripts": {
    "i18n:merge-files": "npx ng-i18n-merge-files -f json",
    "build": "npm run i18n:merge-files && ng build",
    "start:en": "npm run i18n:merge-files && ng serve"
  },
  ...
}
```

## Options

```
> npx ng-i18n-merge-files -h
Options:
      --version  Shows the version number
                 [boolean]
  -i, --in       Folder which will be searched recursively for translation files to be merged.                   
                 [sting] [default: "{current working dir}\src"]
  -o, --out      Folder where the merged translation files will be saved to.
                 [string] [default: "{current working dir}\src\locale"]
  -f, --format   Format of the translation file. Currently only json is supported.
                 [required] [options: "json"]
  -h, --help     Shows help
                 [boolean]
```

## Adding the generated files to gitignore
**.gitignore**:
```.gitignore
messages.*.json
```

## Sample project

Can be found at the [sample/test-app](./sample/test-app) folder.