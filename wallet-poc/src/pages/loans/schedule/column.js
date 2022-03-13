import React from "react";
import {Link} from "umi";
import {Button} from "antd";

function columnFactory(payOffCallback) {
  return [
    {
      title:'#',
      dataIndex:'month',
      width:30,
      ellipsis:true,
    },
    {
      title:'Payment $',
      dataIndex:'payment',
      width:50
    },
    {
      title:'Interest $',
      dataIndex:'interest',
      width:50
    },
    {
      title:'Principle $',
      dataIndex:'principle',
      width:50
    },
    {
      title:'Outstanding $',
      dataIndex:'outstanding',
      ellipsis:true,
      width:100
    },
    {
      title:'Action',
      width:50,
      render: (text, record)=> record['status']=='done' ? <span style={{color:"green"}}> Paid </span>:<Button onClick={()=>payOffCallback(record)}>Pay</Button>
    }
  ]
}


export {
  columnFactory
};
