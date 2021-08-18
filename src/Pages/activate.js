import { useState, useEffect } from "react";
import axios from "../axios";
import Spinner from "../Components/spinner";
const cred = window.location.href.split('?')[1].split('&');
const id = cred[0].split('=')[1], token = cred[1].split('=')[1];
export default function Activate() {
    const [msg, setMsg] = useState();
    useEffect(() => {
        axios.put('/users', { id, token, active: true })
            .then(({ data }) => {
                if (data[0] === 'U') {
                    localStorage.setItem('active', true);
                    setMsg('account activated successfully');
                } else
                    setMsg(data);
            })
            .catch(e => {
                console.log(e);
                setMsg('error with activating account');
            });
    }, []);
    return (<><h3>Account Activation</h3>{msg ? <h4>{msg}</h4> : <Spinner />}</>);
}