import { useState, useEffect } from "react";
import axios from "../axios";
import Spinner from "../Components/spinner";
export default function Activate() {
    const [msg, setMsg] = useState(), [cred] = useState(window.location.href.split('?')[1]);
    useEffect(() => {
        try {
            let [id, token] = cred.split('&');
            id = id.split('=')[1];
            token = token.split('=')[1];
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
        } catch (e) {
            setMsg('error with activation url');
        }
    }, [cred]);
    return (<><h3>Account Activation</h3>{msg ? <h4>{msg}</h4> : <Spinner />}</>);
}