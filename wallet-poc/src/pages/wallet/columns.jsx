import React from "react";
import { Menu, Dropdown, Button, message, Space, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';


function makeColumns(transfer, convert, withdraw, deposit) {
  return [
    {
      title:'Asset',
      dataIndex:'asset_code',
      width:100
    },
    {
      title:'Balance',
      dataIndex:'balance',
      width:100
    },
    {
      title:'Actions',
      dataIndex:'action',
      width:100,
      render:(_, record)=>{
        let asset_code = record['asset_code'];
        let withdrawDisable= asset_code == 'USDC' || asset_code == 'HAM';
        let convertDisabled = asset_code == 'HAM'

        const menu = (<Menu>
          <Menu.Item key="1" onClick={()=> transfer(record['id'])}>
            Transfer
          </Menu.Item>
          <Menu.Item key="2" onClick={()=> convert(record['id'])} disabled={convertDisabled}>
            Convert
          </Menu.Item>
          <Menu.Item key="3"  onClick={()=> withdraw(record['id'])} disabled={withdrawDisable}>
            Withdraw
          </Menu.Item>
          <Menu.Item key="4" onClick={()=> deposit(record['id'])} disabled={true}>
            Deposit
          </Menu.Item>
        </Menu>);

        return (
          <Dropdown overlay={menu}>
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        )}
    }
  ]
}


export {
  makeColumns
};
