// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user/login',
              name: 'login',
              component: './User/login',
            },
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/SecurityLayout',
          routes:[
            {
              path: '/',
              component: '../layouts/BasicLayout',
              routes: [
                {
                  path: '/',
                  redirect: '/wallet',
                },
                {
                  path: '/wallet',
                  name:"Wallet Demo",
                  component: "wallet"
                },
                {
                  path: '/smartContracts',
                  name:"Smart Contract",
                  routes:[
                    {
                      path: '/smartContracts/:id',
                      component: "smartContract/execute"
                    },
                    {
                      path: '/smartContracts',
                      component: "smartContract/template"
                    },
                  ]
                },
                {
                  path:"/contracts",
                  name:"Contract",
                  routes:[
                    {
                      path:"/contracts",
                      redirect: "/contracts/create"
                    },
                    {
                      path: '/contracts/create',
                      exact:true,
                      name: "Create",
                      component: "contract/create"
                    },
                    {
                      path:"/contracts/success",
                      exact:true,
                      component: "contract/success"
                    },
                  ]
                },
                {
                  path: '/loans',
                  name:"My Loans",
                  exact:true,
                  component: "loans/myLoans"
                },
                {
                  path: '/loans/create',
                  exact:true,
                  component: "loans/create"
                },
                {
                  path: '/loans/:id/schedule',
                  component: "loans/schedule"
                },

                {
                  path: '/simulation',
                  name:"Simulation",
                  routes:[
                    {
                      path:"/simulation/loans",
                      name:"Review Loans",
                      component: "loans/review"
                    },
                    {
                      path:"/simulation/loans/:id",
                      component: "loans/lenderDetail"
                    }
                  ]
                },

                {
                  path: '/credit-token',
                  name:"Credit Token",
                  routes:[
                    {
                      path:"/credit-token/ganache",
                      name:"Ganache",
                      component: "credit-token/Ganache"
                    },
                    {
                      path:"/credit-token/infura",
                      component: "credit-token/Infura"
                    }
                  ]
                },

                {
                  component: '404',
                },
              ],
            }
          ]
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
});
