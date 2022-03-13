import {fetchContractTemplates} from "../../../../services/smartContract"

const contractTemplateModel = {
  namespace: "contractTemplates",
  state: {
    templates: [],
    currentTemplate:{}
  },
  effects: {
    *fetchTemplates(_, {call, put}) {
      let templates = yield call(fetchContractTemplates)
      yield put({
        type: 'setTemplates',
        payload: templates
      })
    },
  },


  reducers: {
    setTemplates(state, action) {
      let {payload = []} = action
      return {...state, templates: payload}
    }
  }
}

export default contractTemplateModel
