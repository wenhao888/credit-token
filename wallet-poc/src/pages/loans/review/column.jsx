import React from "react";
import {Link} from "umi";

const columns= [
  {
    title:'Id',
    dataIndex:'id',
    width:100,
    ellipsis:true,
  },
  {
    title:'title',
    dataIndex:'title',
    width:100,
    ellipsis:true,
  },
  {
    title:'Created by',
    dataIndex:'createdBy',
    width:50
  },
  {
    title:'Amount',
    dataIndex:'amount',
    width:50
  },
  {
    title:'Status',
    dataIndex:'status',
    width:50
  },
  {
    title:'Approved at',
    dataIndex:'approvedAt',
    ellipsis:true,
    width:100
  },
  {
    title:'Created at',
    dataIndex:'createdAt',
    ellipsis:true,
    width:100
  },
  {
    title:'Action',
    width:50,
    render: (text, record)=><Link to={`/simulation/loans/${record.id}`}>{record['status'] =='submitted'? 'Review': 'Detail'}</Link>
  }
]

export {
  columns
}
