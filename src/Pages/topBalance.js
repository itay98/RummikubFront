import { useState, useEffect, useRef } from "react";
import axios from "../axios";
import Avatar from "../Components/avatar";
import Spinner from "../Components/spinner";
import { table, body } from "./top.module.scss";
export default function TopBalance() {
    const users = useRef(), [load, setLoad] = useState(true);
    const [id] = useState(localStorage.getItem('id'));
    useEffect(() => {
        axios.get('/users/topBalance?id=' + id).then(({ data }) => {
            users.current = data;
            setLoad();
        }).catch(e => { console.log(e); alert('problem with server. please try later') });
    }, [id]);
    const row = (u, i) => (<tr key={i}><td><b>{i + 1}</b></td><td><Avatar a={u.avatar} />
    </td><td>{u.username}</td><td>{u.balance}&#9883;</td></tr>);
    return (load ? <Spinner /> : (<div><h3>Top Balance</h3>
        <table className={table}><tbody className={body}>
            {users.current.leaders.map(row)}
            {users.current.me && <><tr><td><ul><li> </li><li> </li><li> </li></ul></td></tr>
                {row(users.current.me, users.current.rank)}</>}
        </tbody></table>
    </div>))
}