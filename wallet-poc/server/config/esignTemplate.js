let template= {
  title:"Manufacturing Contract",
  content: "This is a sample contract to demo esign. It will have multiple sections (each with text tags), and a signature section at the end. This is the header section.",
  file:"contract-template-header.pdf",

  sections:[
    {
      id: 0,
      title: "Raw Material Section",
      content: "The raw material provider must deliver raw materials  by the end of “”. If you agree, please enter your initial here [         i: raw           ]",
      file:"contract-template-material.pdf",
      role:"material"
    },
    {
      id: 1,
      title:"Provider Section",
      content: "The provider of the component “” must deliver the finished component  by the end of “”. If you agree, please enter your initial here [      i: provider        ]",
      file:"contract-template-provider.pdf",
      role:"provider"
    },
    {
      id: 2,
      title :"Manufacture Section",
      content:"This is the condition for the manufacturing process. If you agree, please enter your initial here [      i: manufactor      ]",
      file:"contract-template-manufacture.pdf",
      role:"manufactor"
    },
    {
      id: 3,
      title: "Delivery Section",
      content: "The delivery company must deliver the finished product to the consumer by the end of “”. If you agree, please enter your initial here [         i: delivery          ]",
      file:"contract-template-delivery.pdf",
      role:"deliver"
    }
  ]
}

module.exports = {
  "templates": [template]
}
