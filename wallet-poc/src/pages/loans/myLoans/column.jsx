import React from "react";
import {Link} from "umi";

const columns= [
  {
    title:'Id',
    dataIndex:'id',
    width:30,
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
    render: (text, record)=><Link to={`/loans/${record.id}/schedule`}>Schedule</Link>
  }
]

export {
  columns
}
