import axios from "../axios";
import { useState, useCallback } from "react";
import { t } from "./contact.module.scss";
import Spinner from "../Components/spinner";
import Button from 'react-bootstrap/Button';
export default function Contact() {
    const [sub, setSub] = useState(''), [token] = useState(localStorage.getItem('token'));
    const [body, setBody] = useState(''), [id] = useState(localStorage.getItem('id'));
    const [load, setLoad] = useState();
    const submit = async () => {
        setLoad(true);
        try {
            const { data } = await axios.post('users/contact', { id, token, sub, body })
            setTimeout(alert, 99, data);
        } catch (e) {
            setTimeout(alert, 99, 'problem with server'); console.log(e)
        }
        setLoad();
    }
    const sChange = useCallback(e => setSub(e.target.value), []);
    const bChange = useCallback(e => setBody(e.target.value), []);
    return (<div><h3>Contact us</h3>
        <table className={t}><tbody>
            <tr><td><b>Subject:</b></td>
                <td><input placeholder="issue type" value={sub} onChange={sChange} /></td></tr>
            <tr><td><b>Message:</b></td>
                <td><textarea placeholder="describe the issue" value={body} onChange={bChange} /></td></tr>
        </tbody></table>
        {load ? <Spinner /> : <Button variant="success" onClick={submit} disabled={!sub || !body}>Send</Button>}
    </div>)
}