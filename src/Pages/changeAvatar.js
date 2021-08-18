import Button from 'react-bootstrap/Button';
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "../axios";
import Spinner from "../Components/spinner";
import Avatar from "../Components/avatar";
import { cont, av } from "./changeAvatar.module.scss";
export default function ChangeAvatar() {
    const avatars = useRef(), [avatarId, setAvatar] = useState();
    const [paid, setPaid] = useState(), [token] = useState(localStorage.getItem('token'));
    const [lock, setLock] = useState(), [id] = useState(localStorage.getItem('id'));
    const [load, setLoad] = useState(true);
    useEffect(() => {
        axios.get(`/users?id=${id}&a[0]=premAv&a[1]=avatarId`).then(({ data }) => {
            if (data?.premAv) {
                setPaid(true);
                setAvatar(data.avatarId);
            }
        });
        axios.get('/avatars/premAv').then(({ data }) => {
            avatars.current = data;
            setLoad()
        });
    }, [id]);
    const submit = () => {
        if (avatarId) {
            axios.put('/users', { id, token, avatarId })
                .then(({ data }) => alert(data))
                .catch(e => { alert('error updating avatar'); console.log(e) });
        } else
            alert('no avatar selected');
    }
    const unlock = useCallback(async () => {
        setLock(true);
        try {
            const { data } = await axios.post('/users/unlockPremAv', { id, token });
            data ? setTimeout(alert, 99, data) : setPaid(true);
        } catch (error) {
            setTimeout(alert, 99, 'error unlocking avatars'); console.log(error)
        }
        setLock();
    }, [id, token]);
    return (load ? <Spinner /> : (<div>
        <h3>Choose an Avatar</h3>
        <div className={cont}>
            {avatars.current.map(a => (<div key={a.id} className={av}>
                <h5>{a.nickname}</h5><Avatar a={a} /><br /><h5>{avatarId === a.id ? 'selected' :
                    <Button onClick={() => paid && setAvatar(a.id)} variant="success">select</Button>}</h5></div>))}
        </div>
        {!paid && <div><h4>Pay 50&#9883; to unlock</h4>
            {lock ? <Spinner /> : <Button variant="info" onClick={unlock}>unlock</Button>}</div>}
        <Button disabled={!paid} onClick={submit}>Change Avatar</Button>
    </div>))
}