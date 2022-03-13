import {getAllBalance, transfer} from "@/services/ganache";

const ganacheModel = {
  namespace: "ganache",
  state: {
    balances: []
  },
  effects: {
    * fetchBalances(data, {call, put}) {
      let balances = yield call(getAllBalance)
      yield put({
        type: 'setBalances',
        payload: balances
      })
    },

    * transfer({payload = {}, onSubmit}, {call}) {
      let {from, to, amount} = payload || {};
      yield call(transfer,from, to, amount);
      onSubmit && onSubmit();
    },

  },

  reducers: {
    setBalances(state, action) {
      let {payload = []} = action
      return {...state, balances: payload}
    },
  }
}

export default ganacheModel
