import {assetDict} from "../../../server/config/assets";


export function getConversionTargets(source_code) {
  let targets = [];
  for (let key in assetDict) {
    if (key!= source_code) {
      targets.push(assetDict[key]);
    }
  }
  return targets;

}


