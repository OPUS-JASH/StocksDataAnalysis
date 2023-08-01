import React from 'react'
import "./tableContainer.css";
import Table from '../Table/Table';

function TableContainer({openToast}) {
  return (
    <div className='screen'>
      <Table openToast={openToast}/>
    </div>
  )
}

export default TableContainer;
