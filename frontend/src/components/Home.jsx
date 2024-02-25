import React from 'react'
import axiosInstance from '../services/axios';
import ServerList from './ServerList';
import './home.css'
function Home() {
  return (
    <div className='server'>
      <div className='serverList'>
        <ServerList />
      </div>
    </div>
  )
}

export default Home
