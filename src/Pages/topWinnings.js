import { useState, useEffect, useRef } from "react";
import axios from "../axios";
import Avatar from "../Components/avatar";
import Spinner from "../Components/spinner";
import { table, body } from "./top.module.scss";
export default function TopWinnings() {
    const users = useRef(), [load, setLoad] = useState(true);
    useEffect(() => {
        axios.get('/users/weeklyWinnings').then(({ data }) => {
            users.current = data;
            setLoad();
        }).catch(e => { console.log(e); alert('problem with server. please try later') });
    }, []);
    return (load ? <Spinner /> : (<div><h3>Top Weekly Winnings</h3>
        <table className={table}><tbody className={body}>
            {users.current.map((u, i) => (<tr key={i}><td><b>{i + 1}</b></td>
                <td><Avatar a={u} /></td><td>{u.username}</td><td>{u.points}&#9883;</td></tr>))}
        </tbody></table>
    </div>))
}