import Button from 'react-bootstrap/Button';
import { useState } from "react";
import { Username } from "../Components/textFields";
import Spinner from "../Components/spinner";
import { cont } from "./changeTF.module.css";
import axios from "../axios";
const id = localStorage.getItem('id'), token = localStorage.getItem('token');
export default function ChangeUsername() {
    const [username, setUsername] = useState(''), [unV, setUnV] = useState("");
    const [load, setLoad] = useState(false);
    const submit = () => {
        if (username && !unV) {
            axios.put('/users/update', { id, token, username })
                .then(({ data }) => alert(data))
                .catch(e => { alert('error updating username'); console.log(e) });
        } else
            alert('invalid username');
    }

    return (<div className={cont}>
        <h3>Change Your Username</h3>
        <Username getValue={username} setValue={setUsername} getValid={unV} setValid={setUnV} setLoad={setLoad} />
        <br />{load ? <Spinner/> : <Button onClick={submit}>Update</Button>}
    </div>)
}