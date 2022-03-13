import React from "react";
import {Button, Dropdown, Menu} from "antd";
import {DownOutlined} from "@ant-design/icons";

const makeColumns = (transfer) => {
  return  [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      width: 100,
      render: (_, record) => {
        const menu = (<Menu>
          <Menu.Item key="1" onClick={() => transfer(record['id'])}>
            Transfer
          </Menu.Item>
        </Menu>);

        return record['id']==0? (
          <Dropdown overlay={menu}>
            <Button>
              Actions <DownOutlined/>
            </Button>
          </Dropdown>
        ): null
      }
    }
  ]
}

export default makeColumns
