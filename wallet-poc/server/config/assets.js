const ALGO_CODE="algo";

let assetDict={
  'algo' : {
    asset_id: -1,
    asset_code: "algo"
  },
  'HAM' : {
    asset_code:"HAM",
    asset_id: 21698184,
  }
}


function getAssetByCode(asset_code) {
  return assetDict[asset_code];
}

function getAssetById(id) {
  for(let code in assetDict) {
    let asset= assetDict[code];
    if (asset['asset_id'] == id) {
      return asset;
    }
  }
  return {}
}

module.exports = {
  ALGO_CODE,
  assetDict,
  getAssetById,
  getAssetByCode
}
