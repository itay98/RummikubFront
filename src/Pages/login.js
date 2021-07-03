import { useState, useCallback } from "react";
import { cont } from "./login.module.scss";
import axios from "../axios";
import Button from 'react-bootstrap/Button';
import Spinner from "../Components/spinner";
import vE from "validator/es/lib/isEmail";
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [forgot, setForgot] = useState(false);
    const [load, setLoad] = useState(false);
    const submit = useCallback(() => {
        axios.post('/users/login', { username, password })
            .then(({ data }) => {
                if (typeof data !== 'string') {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('id', data.id);
                    localStorage.setItem('username', username);
                    localStorage.setItem('balance', data.balance);
                    localStorage.setItem('active', data.active || '');
                    window.location.replace('/');
                    setTimeout(alert, 10, 'you are logged in');
                } else
                    alert(data);
            })
            .catch(e => { alert('error logging in'); console.log(e) });
    }, [username, password]);
    const sendEmail = useCallback(() => {
        if (vE(email)) {
            setLoad(true);
            axios.get('/users/forgot?e=' + email)
                .then(({ data }) => {
                    setLoad(false);
                    alert(data);
                })
                .catch(e => { console.log(e); alert('error with database please try later') });
        }
        else
            alert('email is invalid');
    }, [email]);
    const uChange = useCallback(e => setUsername(e.target.value), []);
    const pChange = useCallback(e => setPassword(e.target.value), []);
    const eChange = useCallback(e => setEmail(e.target.value), []);
    return (<div className={cont}>
        <h3>Log-In</h3>
        <input placeholder="username" value={username} onChange={uChange} /><br />
        <input type="password" placeholder="password" value={password} onChange={pChange} /><br />
        <Button onClick={submit} disabled={!username || !password}>LOGIN</Button><br />
        {forgot ? <div>
            <p>put the email you used for your account and you will get an email
                with your username and a link to reset your password</p>
            <input placeholder="email" value={email} onChange={eChange} />
            <br />{load ? <Spinner />
                : <Button variant="outline-success" onClick={sendEmail}>Send Email</Button>}
        </div> : <Button variant="outline-danger" onClick={() => setForgot(true)}>forgot password/username?</Button>}
    </div>)
}