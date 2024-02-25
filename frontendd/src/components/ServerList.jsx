import React from 'react'
import { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import Cookies from 'js-cookie'; 
function ServerList() {
    
    const [servers, setServers] = useState([]);
    const newServer= false;
    const fetchServers = () => {
        const serverlist=["server1","server2","server3"];
        setServers(serverlist);
    };

    useEffect(() => {
        // axiosInstance.get('/server/getServerList')
        //     .then((response) => {
        //         const serverlist= []
        //         for(let i =0;i<response.data.length;i++){
        //             serverlist.push(response.data[i].Item.serverName);
        //         }
        //         setServers(serverlist);
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching servers:', error);
        //     });
        fetchServers();
    },[newServer]);
    if(servers.length==0){
        return (<div> Loading</div>)
    }
    return (
        <div>
            <h2>Servers</h2>
            <ul>
                {servers?.map((server) => (
                    <li key={server}>{server}</li>
                ))}
            </ul>
        </div>
    )
}

export default ServerList
