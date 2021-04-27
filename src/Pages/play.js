import Button from 'react-bootstrap/Button';
import { useState } from "react";
import { pointsC, pntC, plyH, slot, tile, hidden, selected, prize } from "./play.module.scss";
import axios from "../axios";
const id = localStorage.getItem('id'), token = localStorage.getItem('token');
const playerOpt = [2, 3, 4], pointOpt = [3, 10, 32, 100];
const pointObj = {
    [pointOpt[0]]: { rate: 1, color: 'black', variant: 'dark', name: 'beginner' },
    [pointOpt[1]]: { rate: 0.9, color: 'orange', variant: 'warning', name: 'small' },
    [pointOpt[2]]: { rate: 0.875, color: 'blue', variant: 'primary', name: 'large' },
    [pointOpt[3]]: { rate: 0.85, color: 'red', variant: 'danger', name: 'pro gambler' }
};
const plyN = parseInt(localStorage.getItem('plyN')), initPly = playerOpt.includes(plyN) ? plyN : playerOpt[0];
const pntN = parseInt(localStorage.getItem('pntN')), initPnt = pointOpt.includes(pntN) ? pntN : pointOpt[0];
export default function Play() {
    const [players, setPlayers] = useState(initPly);
    const [points, setPoints] = useState(initPnt);
    const submit = () => {
        localStorage.setItem('plyN', players);
        localStorage.setItem('pntN', points);
        axios.post('/users/startGame', { id, token, players, points })
            .then(({ data }) => data ? alert(data) : window.location.href = '/game')
            .catch(e => { alert('error starting game'); console.log(e) });
    }
    return (<div>
        <h3>Choose Game Settings</h3>
        <div className={pointsC}>
            {pointOpt.map(p => (<div key={p} className={pntC}><h2 className={pointObj[p].color}>{pointObj[p].name}</h2>
                <hr /><h1>{p} &#9883;</h1><h5>{points === p ? <b className="joker">selected</b> :
                    <Button variant={pointObj[p].variant} onClick={() => setPoints(p)}>select</Button>}</h5></div>))}
        </div>
        <div><b className={plyH}>Number of Players:</b>
            {playerOpt.map(p => (<div key={p} className={slot}>
                <div className={tile + ' ' + pointObj[points].color} onClick={() => setPlayers(p)}>{p}
                    <div className={players === p ? selected : hidden}>&#9883;</div></div></div>))}
        </div>
        <h4 className={prize}>winner takes {players * points * pointObj[points].rate} points</h4>
        <Button variant="success" onClick={submit}>Start Game</Button>
    </div>)
}