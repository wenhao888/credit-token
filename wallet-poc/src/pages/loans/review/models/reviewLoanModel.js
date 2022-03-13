import {getLoans} from "../../../../services/loan"

const reviewLoanModel = {
  namespace: "reviewLoans",
  state: {
    loans: [],
  },
  effects: {
    * fetchLoans(_, {call, put}) {
      let loans = yield call(getLoans)
      yield put({
        type: 'setLoans',
        payload: loans
      })
    }
  },


    reducers: {
      setLoans(state, action) {
        let {payload = []} = action
        return {...state, loans: payload}
      }
    }
}

export default reviewLoanModel;
