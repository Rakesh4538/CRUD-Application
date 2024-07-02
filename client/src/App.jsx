import { useEffect, useState } from "react";
import axios from "axios";
import React from 'react';

import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({name:"",age:"",city:""});
  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setFilterUsers(res.data);
      console.log(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  

  //*******Search Function*************

  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchText) || 
      user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
  };
  
  //**********Delete Function**************

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if(isConfirmed) {
      await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
        setUsers(res.data);
        setFilterUsers(res.data);
  
      })

    }
    
  }

  const closeModal = () => {
    setIsModalOpen(false);
    getAllUsers();
  }

  //***************Add User Details***************

  const handleAddRecord = () => {
    setUserData({name:"",age:"",city:""});
    setIsModalOpen(true);
  }

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value})

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(userData.id) {
      await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then((res) => {
        console.log(res);
      });
    } else {

      await axios.post("http://localhost:8000/users",userData).then((res) => {
        console.log(res);
      })

    }
    closeModal();
    setUserData({name:"",age:"",city:""});

  }

  //Update FUnction 
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  }

  return (
    <div className='container'>
      <h3>CRUD Application</h3>
      <div className="input-search">
        <input type="search" placeholder="Search here" onChange={handleSearchChange} />
        <button className='btn green' onClick={handleAddRecord}>Add Records</button>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filterUsers && filterUsers.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.city}</td>
              <td><button onClick={()=>handleUpdateRecord(user)} className='btn green'>Edit</button></td>
              <td><button onClick ={()=> handleDelete(user.id)}className='btn red'>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>User Record</h2>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input type = "text"  value={userData.name} name ="name" id ="name" onChange={handleData} />
            </div>
            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input type = "number" value={userData.age} name ="age" id ="age" onChange={handleData}/>
            </div>
            <div className="input-group">
              <label htmlFor="name">City</label>
              <input type = "text" value={userData.city} name ="city" id ="city" onChange={handleData}/>
            </div>
            <button className="btn green" onClick={handleSubmit}>Add User</button>
          </div>
        </div>
       )}
    </div>
  );
}

export default App;
