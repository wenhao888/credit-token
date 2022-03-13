var fs = require('fs');
var path = require('path');

const docusign = require('docusign-esign');
const {clientId, rsaKey, userGuid, scope} = require("../config/docSignConfig");
var access_token = null;


async function signContract(contractFile, selectedRoles) {
  const dsApi = new docusign.ApiClient();

  if (!access_token) {
    dsApi.setOAuthBasePath("account-d.docusign.com"); // it have to be domain name
    const results = await dsApi.requestJWTUserToken(clientId, userGuid, scope, rsaKey, 36000);
    access_token = results["body"]["access_token"];
  }

  dsApi.addDefaultHeader('Authorization', 'Bearer ' + access_token);
  dsApi.setBasePath("https://demo.docusign.net/restapi")

  let fileBytes = fs.readFileSync(path.resolve(__dirname, `../../public/${contractFile}`));

  var envDef = new docusign.EnvelopeDefinition();
  envDef.emailSubject = 'Please sign this document sent from Node SDK';

  let doc = new docusign.Document.constructFromObject({
    documentBase64: new Buffer(fileBytes).toString('base64'),
    name: 'contract.pdf', // can be different from actual file name
    fileExtension: 'pdf',
    documentId: '1'
  });

  envDef.documents = [doc];
  let signers=[];

  let index =0;

  for (let r of selectedRoles) {
    let {role, email} = r;

    index++;

    let signer = docusign.Signer.constructFromObject({
      email: email,
      name: email.split("@")[0],
      recipientId: index,
      clientUserId: "1001",     //the exsitence of this field will determine if email will not sent we will use receipient view
      routingOrder: 1
    });

    let singHere = docusign.SignHere.constructFromObject({
      anchorString: `**${role}_signature**`,
      documentId: '1',
      anchorYOffset: '0',
      anchorUnits: 'pixels',
      anchorXOffset: '0'
    })

    let initialHere = docusign.InitialHere.constructFromObject({
      anchorString: `**${role}_initial**`,
      documentId: '1',
      anchorYOffset: '0',
      anchorUnits: 'pixels',
      anchorXOffset: '0'
    })

    let signerTabs = docusign.Tabs.constructFromObject({
      signHereTabs: [singHere],
      initialHereTabs: [initialHere]
    });

    signer.tabs = signerTabs;
    signers.push(signer);
  }

  envDef.recipients = new docusign.Recipients();
  envDef.recipients.signers = signers;
  envDef.status = 'sent';

  var envelopesApi = new docusign.EnvelopesApi(dsApi);
  let result = await envelopesApi.createEnvelope("62b9a6a5-a3d1-4ae4-aa84-a58be47fb45e", {'envelopeDefinition': envDef})

  let viewRequest = new docusign.RecipientViewRequest();
  viewRequest.returnUrl = 'http://localhost:8080';
  viewRequest.authenticationMethod = 'email';

  viewRequest.email = 'wenhao.lin@gmail.com';
  viewRequest.userName = 'wenhao.lin';
  viewRequest.recipientId = '1';
  viewRequest.clientUserId = '1001';

  let view = await envelopesApi.createRecipientView("62b9a6a5-a3d1-4ae4-aa84-a58be47fb45e", result["envelopeId"], {'recipientViewRequest': viewRequest}, );
  return view;
}



module.exports = {
  signContract
}
