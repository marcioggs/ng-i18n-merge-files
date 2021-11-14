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
    "msg4": "Message 4"
  }
}
```

## Solution

Angular i18n Merge Files is a tool that generates the final messages file (like the JSON above) by merging multiple
partial message files.

**component-one.messages.fr.json**

```json
{
  "msg1": "Message 1",
  "msg2": "Message 2"
}
```

**component-two.messages.fr.json**

```json
{
  "msg3": "Message 3",
  "msg4": "Message 4"
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
    "start:fr": "npm run i18n:merge-files && ng serve --configuration development,fr"
  },
  ...
}
```

## Options

```
> npx ng-i18n-merge-files -h

Options:
      --version                    Show version number                 [boolean]
  -i, --in                         Folder which will be searched recursively for translation files to be merged.
                                   [string] [default: "{current working dir}\src"]
  -o, --out                        Folder where the merged translation files will be saved to.
                                   [string] [default: "{current working dir}\src\locale"]
  -f, --format                     Format of the translation file. Currently only json is supported.
                                   [required] [choices: "json"]
      --id-prefix, --ip            Adds a prefix to the translation identifier based on the translation filename (see
                                   --id-prefix-strategy)
                                   [boolean] [default: false]
      --id-prefix-strategy, --ips  Naming strategy applied to the translation filename to generate the identifier prefix
                                   [choices: "camel-case", "as-is", "dot-case"] [default: "camel-case"]
  -h, --help                       Show help
                                   [boolean]
```

### id-prefix

If set, a prefix will be added to the translation message id based on the translation filename.  
The same two JSON files from the previous examples would be merged into:

```json
{
  "locale": "fr",
  "translations": {
    "componentOne.msg1": "Message 1",
    "componentOne.msg2": "Message 2",
    "componentTwo.msg3": "Message 3",
    "componentTwo.msg4": "Message 4"
  }
}
```

To change the naming strategy of the prefix, see [id-prefix-strategy](#id-prefix-strategy).

### id-prefix-strategy

The naming strategy that will be applied to the translation filename to generate the message id prefix.

Example for message id `msg1` on file `component-one.messages.fr.json`:

| Strategy   | sMessage id          |
| ---------- | -------------------- |
| camel-case | `componentOne.msg1`  |
| as-is      | `component-one.msg2` |
| dot-case   | `component.one.msg1` |

## Adding the generated files to gitignore

**.gitignore**:

```.gitignore
messages.*.json
```

## Sample project

Can be found at the [sample/test-app](./sample/test-app) folder.
