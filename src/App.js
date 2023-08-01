import './App.css';
import TableContainer from './Components/TableContainer/TableContainer';
import Navbar from './Components/navbar/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const openToast = (msg) => {
    if(msg === "Data Uploaded successfuly."){
      toast.success(msg, {
        position: toast.POSITION.BOTTOM_RIGHT
    });
    }else{
      toast.error(msg,{
        position : toast.POSITION.BOTTOM_RIGHT
      })
    }
  }

  return (
    <>
      <Navbar openToast={openToast}/>
      <TableContainer openToast={openToast}/>
      <ToastContainer />
    </>
  );
}

export default App;
