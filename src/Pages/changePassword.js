import { useState } from "react";
import axios from "../axios";
import Button from 'react-bootstrap/Button';
import { Password } from "../Components/textFields";
import { cont } from "./changeTF.module.css";
let cred = window.location.href.split('?')[1], id, token;
if (cred) {
    [id, token] = cred.split('&');
    id = cred[0].split('=')[1];
    token = cred[1].split('=')[1];
} else {
    id = localStorage.getItem('id');
    token = localStorage.getItem('token');
}
export default function ChangePassword() {
    const [password, setPassword] = useState(""), [pwV, setPwV] = useState("");
    const [rePassword, setRePassword] = useState(""), [rPwV, setRPwV] = useState("");
    const submit = () => {
        let errTxt = '';
        if (!password || pwV)
            errTxt += "Invalid password\n";
        if (rePassword !== password)
            errTxt += "Invalid retyped password\n";
        if (errTxt)
            alert(errTxt);
        else
            axios.put('/users/resetPass', { id, token, password })
                .then(({ data }) => alert(data))
                .catch(e => { console.log(e); alert('error with reseting password') });
    }
    return (<div className={cont}><h3>Change Password</h3>
        <Password getValue={password} setValue={setPassword} getValid={pwV} setValid={setPwV}
            getReValue={rePassword} setReValue={setRePassword} getReValid={rPwV} setReValid={setRPwV} /><br />
        <Button onClick={submit}>Update</Button></div>);
}