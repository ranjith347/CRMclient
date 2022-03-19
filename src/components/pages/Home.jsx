import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';

import axios from "axios";
import { baseurl } from "../../config";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';



export default function Home() {
  const navigate = useNavigate();

  const [fields, setfields] = useState({companyname: '',
                                        companywebsite: '',
                                        companyphonenumber: '',
                                        companyaddress: '',
                                        companycity: '',
                                        companystate: '',
                                        companycountry: '',
                                        industrylist: 'Accounts',})

  const [rows, setrows] = useState([])
  const [open, setOpen] = React.useState(false);
  const [idForUpdating, setidForUpdating] = useState('')
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const {name, value} = e.target
    setfields(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSubmit = () => {
    const fd =  new FormData();
    fd.append('fields', JSON.stringify(fields))
    axios
      .post(baseurl+'company/', fd)
      .then((res) => {
        console.log(res);
        getCompanies()
      })
      .catch((err) => {
        console.log(err);
      })
    console.log(fields);
  }

  const getCompanies = () => {
    axios.get(baseurl + 'company/')
          .then((res) => {
            setrows(res.data.companies)
          })
          .catch((err) => {
            console.log(err);
          })
  }

  const handleUpdate = () => {
    const fd = new FormData()
    fd.append('fields', JSON.stringify(fields))
    fd.append('companyId', idForUpdating);

    axios.patch(baseurl + 'company/', fd)
        .then((res) => {
          getCompanies()
          handleClose()
        })
        .catch((err) => {
          console.log(err);
        })
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  useEffect(() => {
      getCompanies()
  }, [])
  

  const columns = [
    { field: "id", hide: true },
    { field: 'companyname', headerName: 'Company Name', width: 150 },
    { field: 'companywebsite', headerName: 'Website', width: 150 },
    { field: 'companyphonenumber', headerName: 'Phone number', width: 150 },
    { field: 'companyaddress', headerName: 'Address', width: 150 },
    { field: 'companycity', headerName: 'City', width: 150 },
    { field: 'companystate', headerName: 'State', width: 150 },
    { field: 'companycountry', headerName: 'Country', width: 150 },
    { field: 'industrylist', headerName: 'Industry list', width: 150 },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
  
          const api = params.api;
          const thisRow = {};
  
          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );

            console.log(thisRow);
  
            const fd = new FormData();
            fd.append('id',thisRow.id)


          axios.post(baseurl+'company/delete',fd).then(res=>{
            console.log(res)
            getCompanies();
          }).catch(err=>{
            console.log(err);
          })
        };
  
        return <Button style={{color: 'red'}} onClick={onClick}>Delete</Button>;
      }
    },
    {
      field: "update",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => {
        const onClick1 = (e) => {
          setOpen(true);
          e.stopPropagation(); // don't select this row after clicking
  
          const api = params.api;
          const thisRow = {};
  
          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );
            
            console.log(thisRow);
          setidForUpdating(thisRow.id)
          
        };
  
        return <Button onClick={onClick1}>Update</Button>;
      }
    },
  ];
  

  useEffect(() => {
    let token = localStorage.getItem("auth-token");
    if (token == "") {
      navigate("../", { replace: true });
    }
    return () => {};
  }, []);
  const [AllUsers, setAllUsers] = useState([]);
  const getUsers = () => {
    axios
      .get(baseurl + "users/getusers")
      .then((r) => {
        setAllUsers(r.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const logout = () => {
    localStorage.setItem("auth-token", "");
    window.location.reload();
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg  navbar-dark bg-dark">
        <a style={{ color: "white" }} className="navbar-brand">
          CRM
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={logout}
                style={{ cursor: "pointer" }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="row m-1">
      <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <form style={{padding: 0}}>
              <h4>Update details</h4>
              <input type="text" class="form-control-sm" id="exampleInputEmail1" name="companyname" onChange={handleChange} placeholder="Company Name..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companywebsite" onChange={handleChange} placeholder="Website..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companyphonenumber" onChange={handleChange} placeholder="Phone no..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companyaddress" onChange={handleChange} placeholder="Address..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companycity" onChange={handleChange} placeholder="City..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companystate" onChange={handleChange} placeholder="State..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companycountry" onChange={handleChange} placeholder="Country..." />
              <select id="inputState" name="industrylist" class="form-control" value={fields.industrylist} onChange={handleChange}>
                <option selected>Accounts</option>
                <option>IT</option>
                <option>Sales</option>
                <option>Health Care</option>
              </select>
              <br></br>
            <button type="button"  class="btn btn-primary" onClick={handleUpdate} >Update</button>
          </form>
        </Box>
      </Modal>
    </div>
        <div className="col-md-2">
          <form style={{padding: 0}}>
              <h4>New details</h4>
              <input type="text" class="form-control-sm" id="exampleInputEmail1" name="companyname" onChange={handleChange} placeholder="Company Name..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companywebsite" onChange={handleChange} placeholder="Website..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companyphonenumber" onChange={handleChange} placeholder="Phone no..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companyaddress" onChange={handleChange} placeholder="Address..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companycity" onChange={handleChange} placeholder="City..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companystate" onChange={handleChange} placeholder="State..." />
              <input type="text" class="form-control-sm" id="exampleInputtext1" name="companycountry" onChange={handleChange} placeholder="Country..." />
              <select id="inputState" name="industrylist" class="form-control" value={fields.industrylist} onChange={handleChange}>
                <option selected>Accounts</option>
                <option>IT</option>
                <option>Sales</option>
                <option>Health Care</option>
              </select>
              <br></br>
            <button type="button"  class="btn btn-primary" onClick={handleSubmit} >Submit</button>
          </form>
        </div>
        <div className="col-md-10">
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              id="_id"
              rowsPerPageOptions={[10]}
              checkboxSelection
            />
          </div>
        </div>
      </div>
    </div>
  );
}
