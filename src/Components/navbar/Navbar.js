import React, { useState } from "react";
import "./navbar.css";
import axios from "axios";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import { formatDate } from "../../Utils/formatDate";

function Navbar({openToast}) {
  const [date,setDate] = useState(formatDate());
  const [file, setFile] = useState("");
  const [loading,setLoading] = useState(false);

  function handleChange(event) {
    setFile(event.target.files[0])
  }

  function handleSubmit(event) {
    event.preventDefault()
    setLoading(true);
    const url = 'http://localhost:3000/api/filterDataFromCSV/file';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    axios.post(url, formData, config).then((res) => {
      const msg = res.data.msg;
      openToast(msg);
      // console.log(res.data);
    }).finally(() => {
      document.getElementById("formFile").value = "";
      setFile("");
      setLoading(false);
    })
  }

  function handleLinkUpload() {
    setLoading(true);
    axios.post("http://localhost:3000/api/filterDataFromCSV/link",{date})
      .then(res => {
        const msg = res.data.msg;
        openToast(msg);
        // console.log(res);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <nav className="nav_container">
      <div className="site_name">
        <h1>Stocks Data</h1>
      </div>
      <div className="btn_container">
        <div className="linkBtnContainer">
          <input type="date" style={{padding: '.3em 1em'}} onChange={(e) => setDate(formatDate(e.target.value))}/>
          <button type="button" className="button btn btn-success" onClick={handleLinkUpload}>
            {!loading ?
            <>
              <InsertLinkOutlinedIcon/>
              Get File From Link 
              </>
              : 
              "Uploading ....."
            }
          </button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <input className="form-control" type="file" id="formFile" onChange={handleChange} />
          {file && <button type="submit" className="btn btn-primary">
              <FileUploadOutlinedIcon/>
          </button>}
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
