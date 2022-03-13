
contractTemplates = [
  {
    id: 1,
    title: 'Contract between Company and Level 1 Supplier',
    teal: 'smartContract.teal',
    total: 1,
    customer_address: '6MNC6JZIQLEDRAPGGTO464O4HQ6B5KAF6YXIX52MSVODE2DC33LOI3NY7M',
    asset: 'HAM',
    steps: [
      {
        title: "Pay Supplier 1",
        source_address: 'address_of_e',
        recipients: [
          {
            dest_address: 'TDHMQKLKY4AWVYSBY4BZ5ZD5Y7OYMT5VHYU2KPIJYZK2UHGT4UQTWOBPTQ',
            amount: 1,
            condition: 'supplies received'
          },
          {
            dest_address: '6MNC6JZIQLEDRAPGGTO464O4HQ6B5KAF6YXIX52MSVODE2DC33LOI3NY7M',
            amount: 1,
            condition: 'failure'
          }
        ]
      }
    ]
  },

  {
    id: 2,
    title: 'Split Contract',
    teal: 'split.teal',
    total: 2,
    customer_address: '6MNC6JZIQLEDRAPGGTO464O4HQ6B5KAF6YXIX52MSVODE2DC33LOI3NY7M',
    asset: 'HAM',
    steps: [
      {
        title: "Pay Supplier 1",
        source_address: 'address_of_e',
        recipients: [
          {
            dest_address: 'TDHMQKLKY4AWVYSBY4BZ5ZD5Y7OYMT5VHYU2KPIJYZK2UHGT4UQTWOBPTQ',
            amount: 1,
            condition: 'supplies received'
          },
          {
            dest_address: 'TGHBHCJHSWH55MMSX2PBZ2GJOU746645YRGZMVVQJHHQIEBZRQE6SJ3IPU',
            amount: 1,
            condition: 'supplies received'
          },
          {
            dest_address: '6MNC6JZIQLEDRAPGGTO464O4HQ6B5KAF6YXIX52MSVODE2DC33LOI3NY7M',
            amount: 2,
            condition: 'failure'
          }
        ]
      }
    ]
  },
]


contractTemplateDict= {}

for(let t of contractTemplates) {
  contractTemplateDict[t['id']]=t;
}

contractDict={}

module.exports = {
  contractTemplates,
  contractTemplateDict,
  contractDict
}
