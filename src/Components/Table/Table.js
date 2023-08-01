import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "./table.css";
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Modal from 'react-bootstrap/Modal';
import { formatDate } from '../../Utils/formatDate';

function Table({openToast}) {

    const [data,setData] = useState([]);
    const [tempDate,setTempDate] = useState({
        date1 : "",
        date2 : ""
    })
    const [params,setParams] = useState({
        date1 : "",
        date2 : ""
    })
    const init = {
        OIChange : {
            sort : false,
            type : 1
        },
        priceChange : {
            sort : false,
            type : 1
        },
        status : {
            sort : false,
            type : 1
        },
        contract : {
            sort : false,
            type : 1
        }
    };
    const [filter,setFilter] = useState(init)

    // console.log(filter);
    const [page,setPage] = useState(1);
    const [searchTerm,setSearchTerm] = useState("");
    const [dates,setDates] = useState({
        date1 : "",
        date2 : ""
    })
    let datesTemp = "";

    // console.log(params);
    function fetchData(){
                axios.post("https://stockapi-zp65.onrender.com/api/fetch",{
                // axios.post("http://localhost:3000/api/fetch",{
                    dates:params,
                    noOfRows : 15,
                    page,
                    searchTerm,
                    filter
                })
                    .then(res => {
                        setData(res.data.paginatedData);
                        setTempDate({
                            date1 : res.data.dates.date1,
                            date2 : res.data.dates.date2
                        })
                    })
            
    }

    useEffect(() => {
            fetchData();
    },[page,params,filter])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchData();
          }, 500)
      
          return () => clearTimeout(delayDebounceFn)
    },[searchTerm])


    function decrementPage() {
        if(page === 0) return;
        setPage(page-1);
    }
    function IncrementPage (){
        const temp = page;
        setPage(temp+1);
    }
    function parseDate(dateString) {
        if(dateString){
            const [day, month, year] = dateString.split("-");
            return (`${year}-${month}-${day}`);
        }
        return "";
    };

    function validateDates(){
        axios.post("https://stockapi-zp65.onrender.com/api/validateDates",dates)
            .then((res) => {
                console.log(res.data.status);
                if(dates.date1=== "" || dates.date2 === ""){
                    openToast("Invalid input, Date is empty");
                }
                if(res.data.status === "error"){
                    openToast(res.data.msg);
                }else{
                    let {date1,date2} = dates;
                    if(date1 > date2){
                        let temp = date1;
                        date1 = date2;
                        date2 = temp;
                    }
                    setParams({date1,date2});
                }
            })
    }

    function sortHandle(field) {
        const {type,sort} = filter[field];
        if(sort){   
            if(type === 1){
                setFilter({
                    ...init,
                    [field] : {
                        sort : true,
                        type: 0
                    }
                })
                // akhsdkajs
            }else{
                setFilter({
                    ...init
                })
            }
        }else{
            setFilter({
                ...init,
                [field] : {
                    sort : true,
                    type: 1
                }
            })
        }
    }

  return (
    <>
    <div className='filter-container'>
        <div className='searchContainer'>
            <input type="text" className="form-control" id="searchTerm" placeholder="What are you looking for ?" style={{width: '25em'}} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            {/* <button className='btn btn-success'>
                <SearchOutlinedIcon/>
            </button> */}
        </div>
        <div className='searchContainer'>
            <div>
                <input type='date' style={{padding: '.3em 1em' }} value={parseDate(tempDate.date1)} onChange={(e) => setDates({...dates,date1 : formatDate(e.target.value)})}/>
            </div>
            <input type='date' style={{padding: '.3em 1em' }} value={parseDate(tempDate.date2)} onChange={(e) => setDates({...dates,date2 : formatDate(e.target.value)})}/>
            <button className='btn btn-outline-success' onClick={validateDates}>
                <FilterAltOutlinedIcon/>
            </button>
        </div>
    </div>
    <div className='main_container'>
        <table className="table table-striped table-hover">
            <thead style={{position:'sticky',top:0}}>
                <tr>
                    <th>Symbol</th>
                    <th
                        onClick={() => sortHandle("contract")}
                    >
                    <div>
                        Contracts
                        {filter.contract.sort ? <div>
                            {filter.contract.type === 1 ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>}
                        </div>: ""}
                        </div>
                    </th>
                    <th>{params.date1==="" ? tempDate.date1 : params.date1} Close</th>
                    <th>{params.date2==="" ? tempDate.date2 : params.date2} Close</th> 
                    <th
                        onClick={() => sortHandle("priceChange")}
                    >
                        <div>
                        Price Change
                        {filter.priceChange.sort ? <div>
                            {filter.priceChange.type === 1 ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>}
                        </div>: ""}
                        </div>
                        </th>
                    <th>{params.date1==="" ? tempDate.date1 : params.date1} Open</th>
                    <th>{params.date2==="" ? tempDate.date2 : params.date2} Open</th>
                    <th
                        onClick={() => sortHandle("OIChange")}
                    >
                        <div>
                        OI Change
                        {filter.OIChange.sort ? <div>
                            {filter.OIChange.type === 1 ? <ArrowDownwardIcon/> : <ArrowUpwardIcon/>}
                        </div>: ""}
                        </div>
                    </th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => {
                    const {_id,symbol,price,contract,OIChange,status,priceChange} = item;
                    const close1 = price[0].close;
                    const close2 = price[1].close;
                    const open1 = price[0].open;
                    const open2 = price[1].open;
                    // const contract = price[1].contracts;
                    // const priceChange = ((close2-close1)/close1*100).toFixed(5);
                    // const OIChange = ((open2-open1)/open1*100).toFixed(5);
                    // const statusFunction = () => {
                    //     return (OIChange > 0 && priceChange>0.5) ? "LONGBUILDUP" : (OIChange > 0 && priceChange < -0.5) ? "SHORTBUILDUP" : (OIChange < 0 && priceChange<-0.5) ? "LONGUNWINDING" : (OIChange < 0 && priceChange>0.5) ? "SHORTCOVERING" : "-";
                    // }
                    // const status= statusFunction();

                    return(
                        <tr key={_id}>
                            <td>{symbol}</td>
                            <td>{contract}</td>
                            <td>{close1}</td>
                            <td>{close2}</td>
                            <td>{priceChange}</td>
                            <td>{open1}</td>
                            <td>{open2}</td>
                            <td>{OIChange}</td>
                            <td col="status" type={status}>{status}</td>
                        </tr>
                    )
                })
                }
            </tbody>
        </table>
    </div>
        <div className='btn-container'>
            <button className='btn btn-success' onClick={decrementPage} disabled={page===1}>
                <KeyboardArrowLeftOutlinedIcon/>
            </button>
                {page}
            <button className='btn btn-success' onClick={IncrementPage} disabled={data.length<15}>
                <KeyboardArrowRightOutlinedIcon/>
            </button>
        </div>
    </>
  )
}

export default Table;
