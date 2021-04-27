import { useState, useEffect } from "react";
import axios from "../axios";
import A from "../Components/avatar";
import { table, body } from "./top.module.scss";
export default function TopWinnings() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axios.get('/users/weeklyWinnings').then(({ data }) => { setUsers(data) })
            .catch(e => { console.log(e); alert('problem with server. please try later') });
    }, []);
    return (<div><h3>Top Weekly Winnings</h3>
        <table className={table}><tbody className={body}>
            {users.map((u, i) => (<tr key={i}><td><b>{i + 1}</b></td><td><A b={u.avatar} /></td>
                <td>{u.username}</td><td>{u.points}&#9883;</td></tr>))}
        </tbody></table>
    </div>)
}