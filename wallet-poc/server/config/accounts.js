
const accountNameDict = {
  'wenhao': {
    name: "wenhao",
    title: "Wenhao",
    addr: '6MNC6JZIQLEDRAPGGTO464O4HQ6B5KAF6YXIX52MSVODE2DC33LOI3NY7M',
    memonic: 'gentle attract element long network artist pig sick master canyon kiss pigeon salmon crucial broken debris coconut copy spider dial dad margin road absorb laundry',
  },
  'hubert': {
    name: 'hubert',
    title: "Hubert",
    addr: "TDHMQKLKY4AWVYSBY4BZ5ZD5Y7OYMT5VHYU2KPIJYZK2UHGT4UQTWOBPTQ",
    memonic:"short dilemma onion hurry fantasy senior cigar advance remove tip enhance august advice athlete relax gesture alcohol excuse play merry obscure memory blush ability alone",
  },
  'paul': {
    name: 'paul',
    title: "Paul",
    addr: "TGHBHCJHSWH55MMSX2PBZ2GJOU746645YRGZMVVQJHHQIEBZRQE6SJ3IPU",
    memonic: "ritual have choice innocent train zero reunion impose spawn loud palace insect multiply vapor frame pig close awkward rail version install swim hamster able silent"
  },
  'manufacturer': {
    name: 'manufacturer',
    title: "Manufacturer",
  },
  'brand': {
    name: 'brand',
    title: "Brand",
  },
  'shipper': {
    name: 'shipper',
    title: "Shipper",
  },

  'retailer': {
    name: 'retailer',
    title: "Retailer",
  },

  'company': {
    name: 'company',
    title: "Company",
  },

  'supplier1': {
    name: 'supplier1',
    title: "Supplier1",
  },
  'supplier2': {
    name: 'supplier2',
    title: "Supplier2",
  },
  'supplier3': {
    name: 'supplier3',
    title: "Supplier3",
  },
}


const addrAccountDict={}
for (let key in accountNameDict){
  console.log("add" + key)
  let account = accountNameDict[key]
  addrAccountDict[account['addr']] = account;
}

addrAccountDict['address_of_e'] = {
  'name': "Escrow",
  "title": 'Escrow'
}

function getLoginUsers() {
  return Object.keys(accountNameDict);
}

function getAccountByAddr(addr) {
  return addrAccountDict[addr] ||{}
}

module.exports = {
  accountNameDict,
  addrAccountDict,
  getLoginUsers,
  getAccountByAddr
}
