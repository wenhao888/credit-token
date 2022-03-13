const algosdk = require('algosdk');
const baseServer = 'https://testnet-algorand.api.purestake.io/ps2';
const port = '';
const token = {
  'X-API-Key': 'fCsi9wy4188x7hBrdD3WL2oJwpchJvoy7K0BtYwT'
};

const algodClient = new algosdk.Algodv2(token, baseServer, port);


module.exports ={
  algodClient
};
