import Button from 'react-bootstrap/Button';
import { useState, useContext } from "react";
import { Context } from "../App";
import { Username } from "../Components/textFields";
import Spinner from "../Components/spinner";
import { cont } from "./changeTF.module.css";
import axios from "../axios";
export default function ChangeUsername() {
    const { render } = useContext(Context);
    const [username, setUsername] = useState(''), [unV, setUnV] = useState();
    const [load, setLoad] = useState(), [id] = useState(localStorage.getItem('id'));
    const [token] = useState(localStorage.getItem('token'));
    const submit = () => {
        if (username && !unV) {
            axios.put('/users', { id, token, username })
                .then(({ data }) => {
                    if (data[0] === 'U') {
                        localStorage.setItem('username', username);
                        render();
                    }
                    setTimeout(alert, 99, data);
                })
                .catch(e => { alert('error updating username'); console.log(e) });
        } else
            alert('invalid username');
    }
    return (<div className={cont}>
        <h3>Change Your Username</h3>
        <Username getValue={username} setValue={setUsername} getValid={unV} setValid={setUnV} setLoad={setLoad} />
        <br />{load ? <Spinner /> : <Button onClick={submit}>Update</Button>}
    </div>)
}