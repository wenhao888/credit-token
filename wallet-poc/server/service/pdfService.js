const fs = require("fs");
const PDFMerger = require('pdf-merger-js');
const PDFDocument = require('pdfkit');

async function mergePdfFiles(source_files, dest_file) {
  let merger = new PDFMerger();
  for(let f of source_files) {
    merger.add(f);
  }
  await merger.save(dest_file)
}


async function createSignatureSection(signatureSectionFile, selectedRoles) {
  let doc = new PDFDocument;
  let stream = fs.createWriteStream(signatureSectionFile)
  doc.pipe(stream);

  doc.font('Courier-Bold').lineGap(15).fontSize(16)
    .text("Signatures")

  doc.font('Courier').fontSize(11);

  for(let r of selectedRoles) {
    let {email, role} = r;
    doc.fillColor('black').text(`${email} `, {
      width: 500,
      continued: true
    }).fillColor('white')
      .text(`**${role}_signature**`);
  }

  doc.end();

  return new Promise((resolve)=> {
    stream.on("finish",()=> resolve());
  })
}

module.exports ={
  createSignatureSection,
  mergePdfFiles
}
