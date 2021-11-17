export interface Arguments {
  inputRootFolder: string;
  outputFolder: string;
  format: string;
  idPrefix: boolean;
  idPrefixStrategy: IdPrefixStrategyType;
}

export enum IdPrefixStrategyType {
  camelCase = 'camel-case',
  asIs = 'as-is',
  dotCase = 'dot-case',
}

export function parseIdPrefixStrategyType(val: string): IdPrefixStrategyType {
  let type: IdPrefixStrategyType;

  switch (val) {
    case IdPrefixStrategyType.asIs:
      type = IdPrefixStrategyType.asIs;
      break;
    case IdPrefixStrategyType.dotCase:
      type = IdPrefixStrategyType.dotCase;
      break;
    default:
      type = IdPrefixStrategyType.camelCase;
  }
  return type;
}
