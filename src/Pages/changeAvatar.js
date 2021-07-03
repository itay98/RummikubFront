import Button from 'react-bootstrap/Button';
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "../axios";
import Spinner from "../Components/spinner";
import A from "../Components/avatar";
import { cont, av } from "./changeAvatar.module.scss";
const id = localStorage.getItem('id'), token = localStorage.getItem('token');
export default function ChangeAvatar() {
    const [avatars, setAvatars] = useState([]);
    const [paid, setPaid] = useState(false);
    const [load, setLoad] = useState(true);
    const lock = useRef(false);
    const [avatarId, setAvatar] = useState(0);
    useEffect(() => {
        axios.get(`/users?id=${id}&a[0]=premAv&a[1]=avatarId`).then(({ data }) => {
            if (!data) {
                localStorage.removeItem('token');
                window.location.replace('/');
                setTimeout(alert, 10, 'problem with credentials');
            } else if (data.premAv) {
                setPaid(true);
                setAvatar(data.avatarId);
            }
        });
        axios.get('/avatars/premAv').then(({ data }) => setLoad(setAvatars(data)));
    }, []);
    const submit = () => {
        if (avatarId) {
            axios.put('/users', { id, token, avatarId })
                .then(({ data }) => alert(data))
                .catch(e => { alert('error updating avatar'); console.log(e) });
        } else
            alert('no avatar selected');
    }
    const unlock = useCallback(async () => {
        if (!lock.current) {
            lock.current = true;
            try {
                const { data } = await axios.post('/users/unlockPremAv', { id, token });
                data ? alert(data) : setPaid(true);
            } catch (error) {
                alert('error unlocking avatars'); console.log(error)
            }
            lock.current = false;
        }
    }, []);
    return (load ? <Spinner /> : (<div>
        <h3>Choose an Avatar</h3>
        <div className={cont}>
            {avatars.map(a => (<div key={a.id} className={av}><h5>{a.nickname}</h5><A b={a.image} /><br /><h5>{avatarId === a.id
                ? 'selected' : <Button onClick={() => paid && setAvatar(a.id)} variant="success">select</Button>}</h5></div>))}
        </div>
        {!paid && <div><h4>Pay 50&#9883; to unlock</h4>
            <Button variant="info" onClick={unlock}>unlock</Button></div>}
        <Button disabled={!paid} onClick={submit}>Change Avatar</Button>
    </div>))
}