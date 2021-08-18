import { useState, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../App";
import { cont } from "./login.module.scss";
import axios from "../axios";
import Button from 'react-bootstrap/Button';
import Spinner from "../Components/spinner";
import vE from "validator/es/lib/isEmail";
export default function Login() {
    const { render } = useContext(Context), history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [forgot, setForgot] = useState(), [load, setLoad] = useState();
    const submit = useCallback(async () => {
        setLoad(true);
        try {
            const { data } = await axios.post('/users/login', { username, password });
            if (typeof data !== 'string') {
                localStorage.setItem('token', data.token);
                localStorage.setItem('id', data.id);
                localStorage.setItem('username', username);
                localStorage.setItem('balance', data.balance);
                localStorage.setItem('active', data.active || '');
                setTimeout(alert, 99, 'you are logged in');
                history.replace('/');
                return render(s => !s);
            } else
                setTimeout(alert, 99, data);
        } catch (e) {
            setTimeout(alert, 99, 'error logging in'); console.log(e);
        }
        setLoad();
    }, [username, password, history, render]);
    const sendEmail = useCallback(async () => {
        if (vE(email)) {
            setLoad(true);
            try {
                const { data } = await axios.get('/users/forgot?e=' + email);
                setTimeout(alert, 99, data);
            } catch (e) {
                console.log(e); setTimeout(alert, 99, 'error with server please try later');
            }
            setLoad();
        } else
            alert('email is invalid');
    }, [email]);
    const uChange = useCallback(e => setUsername(e.target.value), []);
    const pChange = useCallback(e => setPassword(e.target.value), []);
    const eChange = useCallback(e => setEmail(e.target.value), []);
    return (<div className={cont}>
        <h3>Log-In</h3>
        <input placeholder="username" value={username} onChange={uChange} /><br />
        <input type="password" placeholder="password" value={password} onChange={pChange} /><br />
        {load ? <Spinner />
            : <Button onClick={submit} disabled={!username || !password}>LOGIN</Button>}<br />
        {forgot ? <div>
            <p>put the email you used for your account and you will get an email
                with your username and a link to reset your password</p>
            <input placeholder="email" value={email} onChange={eChange} />
            <br />{load ? <Spinner />
                : <Button variant="outline-success" onClick={sendEmail}>Send Email</Button>}
        </div> : <Button variant="outline-danger" onClick={() => setForgot(true)}>forgot password/username?</Button>}
    </div>)
}