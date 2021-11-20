# Sample applications

In this folder you'll find sample applications for each of the supported formats.

All the applications have the same structure, being translated to French and Portuguese, and the only difference between 
them being the translation file format.

## What to check

### package.json

Contains the script to merge the files (`i18n:merge-files`), which is bound to the scripts that requires the merged
translation files (`build` and `start:[language-code]`).

Also contains the path to the generated merged files (at `i18n.locales`).

### Partial translation files

The files that will be merged can be found in the following folders:

```
src/app/component-one
src/app/component-two
src/app/locale
```

### Merged translation files

After building or starting the application, one file will be generated for each of the translated languages on the
following path:

`src/app/locale/messages.[language-code].[format]`

e.g. `messages.pt.json`

## Running

The following commands should be run from the main project's root folder, and they automatically merge the
translation files before building or starting the application. 

Change `json-sample-app` by application name corresponding to the desired format.

```shell
npm install --workspaces                        # Installs dependencies for all apps

npm run build --workspaces                      # Merges files and builds all apps

npm run start:fr --workspace json-sample-app   # Merges files and starts the chosen app in French 
npm run start:pt --workspace json-sample-app   # Merges files and starts the chosen app in Portuguese

npm run i18n:merge-files --workspaces           # Just merge the files for all apps
```
