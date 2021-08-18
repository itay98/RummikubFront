import { useState, useCallback, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Context } from "../App";
import axios from "../axios";
import { cont, traits, young, old, male, female, selected, rad, colab, selectedAv } from "./register.module.scss";
import Button from 'react-bootstrap/Button';
import { Username, Password, Email } from "../Components/textFields";
import Avatar from "../Components/avatar";
import Spinner from "../Components/spinner";
export default function Register() {
    const { render } = useContext(Context), history = useHistory();
    const [username, setUsername] = useState(''), [unV, setUnV] = useState();
    const [password, setPassword] = useState(''), [pwV, setPwV] = useState();
    const [rePassword, setRePassword] = useState(''), [rPwV, setRPwV] = useState();
    const [email, setEmail] = useState(''), [emV, setEmV] = useState();
    const avatar = useRef(), [gender, setGender] = useState();
    const [age, setAge] = useState(), [color, setColor] = useState();
    const [load, setLoad] = useState();
    const submit = () => {
        let errTxt = "";
        if (!username || unV)
            errTxt += "Invalid username\n";
        if (!password || pwV)
            errTxt += "Invalid password\n";
        if (rPwV)
            errTxt += "Invalid retyped password\n";
        if (!email || emV)
            errTxt += "Invalid email address\n";
        if (!avatar.current)
            errTxt += "You must select an avatar";
        if (errTxt)
            alert(errTxt);
        else {
            setLoad(true);
            axios.post('/users', { username, password, email, avatarId: avatar.current.id })
                .then(({ data: { id, token } }) => {
                    localStorage.setItem('token', token);
                    localStorage.setItem('id', id);
                    localStorage.setItem('username', username);
                    localStorage.setItem('balance', 20);
                    localStorage.setItem('active', '');
                    history.replace('/');
                    setTimeout(alert, 99, 'you successfully registered! Go to your email to activate your account');
                    render(s => !s);
                })
                .catch(e => { console.log(e); setLoad(); setTimeout(alert, 99, 'error registering') });
        }
    };
    const getAvatar = useCallback(async () => {
        if (age && gender && color) {
            avatar.current = undefined;
            setLoad(true);
            try {
                const { data } = await axios.get('/avatars/nickname?name=' + age + gender + color);
                avatar.current = data;
            } catch (error) {
                console.log(error); setTimeout(alert, 99, 'error with avatar');
            }
            setLoad();
        }
    }, [age, gender, color]);
    return (<div className={cont}>
        <h3>Register to this game</h3>
        <section><Username getValue={username} setValue={setUsername} getValid={unV} setValid={setUnV} setLoad={setLoad} />
        </section>
        <section><Password getValue={password} setValue={setPassword} getValid={pwV} setValid={setPwV}
            getReValue={rePassword} setReValue={setRePassword} getReValid={rPwV} setReValid={setRPwV} /></section>
        <section><Email getValue={email} setValue={setEmail} getValid={emV} setValid={setEmV} setLoad={setLoad} /></section>
        <section><h4>Avatar Selection</h4>
            <div className={traits}>
                <div><b>Age:</b>
                    <b className={`${young} ${age === 'young' ? selected : ''}`} onClick={() => setAge('young')} >young</b>
                    <b className={`${old} ${age === 'old' ? selected : ''}`} onClick={() => setAge('old')} >old</b>
                </div>
                <div><b>Gender:</b>
                    <b className={`${male} ${gender === 'man' ? selected : ''}`} onClick={() => setGender('man')} >male</b>
                    <b className={`${female} ${gender === 'woman' ? selected : ''}`} onClick={() => setGender('woman')} >female</b>
                </div>
                <div><b>Skin-Tone:</b>
                    <input type="radio" id="c1" className={rad} checked={color === 1} onChange={() => setColor(1)} />
                    <label htmlFor="c1" className={colab}>*</label>
                    <input type="radio" id="c2" className={rad} checked={color === 2} onChange={() => setColor(2)} />
                    <label htmlFor="c2" className={colab}>*</label>
                    <input type="radio" id="c3" className={rad} checked={color === 3} onChange={() => setColor(3)} />
                    <label htmlFor="c3" className={colab}>*</label>
                    <input type="radio" id="c4" className={rad} checked={color === 4} onChange={() => setColor(4)} />
                    <label htmlFor="c4" className={colab}>*</label>
                    <input type="radio" id="c5" className={rad} checked={color === 5} onChange={() => setColor(5)} />
                    <label htmlFor="c5" className={colab}>*</label>
                </div>
            </div>
            <div>
                <Button variant="success" onClick={getAvatar} disabled={!age || !gender || !color || load}>Get Avatar</Button>
                <span> &#8658; </span>
                <div className={selectedAv}>{avatar.current ? <Avatar a={avatar.current} /> : 'Selected Avatar'}</div>
            </div>
        </section><br />
        {load ? <Spinner /> : <Button onClick={submit}>REGISTER</Button>}
    </div>);
}