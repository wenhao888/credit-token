import {getBalances, transfer, convert, withdraw, deposit} from "@/services/wallet";

const walletModel = {
  namespace: "wallet",
  state: {
    balances: []
  },
  effects: {
    *fetchBalances(data, {call, put}) {
      let {publicKey} = data;
      console.log("public key: " + publicKey)
      let balances = yield call(getBalances, publicKey)

      yield put({
        type: 'setBalances',
        payload: balances
      })
    },

    *transfer({payload = {}, onSubmit}, {call}) {
      yield call(transfer, payload)
      onSubmit && onSubmit();
    },

    *convert({payload = {}, onSubmit}, {call}) {
      yield call(convert, payload)
      onSubmit && onSubmit();
    },

    *withdraw({payload = {}, onSubmit}, {call}) {
      yield call(withdraw,payload)
      onSubmit && onSubmit();
    },

    *deposit({payload = {}, onSubmit}, {call}) {
      yield call(deposit, payload)
      onSubmit && onSubmit();
    }
  },


  reducers: {
    setBalances(state, action) {
      let {payload = []} = action
      return {...state, balances: payload}
    },
    clearBalances(state, action) {

    }
  }
}

export default walletModel
