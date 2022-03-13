import {stringify} from 'querystring';
import {history} from 'umi';
import {fakeAccountLogin, fakeAccountLogout} from '@/services/login';
import {setAuthority} from '@/utils/authority';
import {getPageQuery} from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    * login({payload}, {call, put}) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

      window.location.href = "/";
    },

    * logout(_, {call, put}) {
      yield call(fakeAccountLogout);
      window.location.href = "/user/login";
    },
  },
  reducers: {
    changeLoginStatus(state, {payload}) {
      setAuthority(payload.currentAuthority);
      return {...state, status: payload.status, type: payload.type};
    },
  },
};
export default Model;
