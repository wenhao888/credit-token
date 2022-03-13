const express = require('express');
const path = require('path');
const uuid = require('uuid');
const router = express.Router();
const {templates} = require("../config/esignTemplate")
const {mergePdfFiles, createSignatureSection} = require("../service/pdfService");
const {signContract} = require("../service/docSignService")

router.post("/", async (req, res, next) => {
  try {
    let contactId = uuid.v1();
    let {selectedSections = [], selectedRoles = []} = req.body || {};
    let selectionDict = createSelectionDict(selectedSections || [])

    // generate the signature section which to be append at the contact end
    let signatureSectionFile = path.resolve(__dirname, "../../public/", `signature-${contactId}.pdf`)
    await createSignatureSection(signatureSectionFile, selectedRoles)

    //we only have one template
    let template = templates[0];
    let pdfFiles = [];
    pdfFiles.push(resolvePdfFileLocation(template.file));

    for (let i = 0; i < template['sections'].length; i++) {
      if (selectionDict[i]) {
        let section = template['sections'][i];
        pdfFiles.push(resolvePdfFileLocation(section.file));
      }
    }
    pdfFiles.push(signatureSectionFile)


    let contractFile = `contract-${contactId}.pdf`;
    let dest = path.resolve(__dirname, "../../public/", contractFile)
    await mergePdfFiles(pdfFiles, dest)

    let view = await signContract(contractFile, selectedRoles);
    res.json(view );

  } catch (error) {
    console.log(error);
    next(error)
  }
})


router.post("/sign", async (req, res, next) => {
  try {
    await signContract();
    res.json({"message": "success"})
  } catch (error) {
    console.log(error)
    next(error);
  }
});


function resolvePdfFileLocation(file_name) {
  let resolved = path.resolve(__dirname, "../config/", file_name)
  return resolved;
}

function createSelectionDict(selected) {
  let selectedDict = {}
  for (let s of selected) {
    selectedDict[s] = true
  }
  return selectedDict;
}

module.exports = router;
