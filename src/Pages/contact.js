import axios from "../axios";
import { useState, useCallback } from "react";
import { t } from "./contact.module.scss";
import Button from 'react-bootstrap/Button';
export default function Contact() {
    const [sub, setSub] = useState(''), [token] = useState(localStorage.getItem('token'));
    const [body, setBody] = useState(''), [id] = useState(localStorage.getItem('id'));
    const submit = () => {
        axios.post('users/contact', { id, token, sub, body })
            .then(({ data }) => alert(data))
            .catch(e => { alert('problem with server'); console.log(e) })
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
        <Button variant="success" onClick={submit} disabled={!sub || !body}>Send</Button>
    </div>)
}