import Button from 'react-bootstrap/Button';
import { useState } from "react";
import { Email } from "../Components/textFields";
import Spinner from "../Components/spinner";
import { cont } from "./changeTF.module.css";
import axios from "../axios";
const id = localStorage.getItem('id'), token = localStorage.getItem('token');
export default function ChangeEmail() {
    const [email, setEmail] = useState(''), [emV, setEmV] = useState("");
    const [load, setLoad] = useState(false);
    const submit = () => {
        if (email && !emV) {
            axios.put('/users', { id, token, email })
                .then(({ data }) => alert(data))
                .catch(e => { alert('error updating email'); console.log(e) });
        } else
            alert('invalid email');
    }

    return (<div className={cont}>
        <h3>Change Your Email</h3>
        <Email getValue={email} setValue={setEmail} getValid={emV} setValid={setEmV} setLoad={setLoad} />
        <br />{load ? <Spinner /> : <Button onClick={submit}>Update</Button>}
    </div>)
}