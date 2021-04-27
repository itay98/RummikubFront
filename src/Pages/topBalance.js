import { useState, useEffect } from "react";
import axios from "../axios";
import A from "../Components/avatar";
import { table,body } from "./top.module.scss";
const id = localStorage.getItem('id');
export default function TopBalance() {
    const [users, setUsers] = useState();
    useEffect(() => {
        axios.get('/users/topBalance?id=' + id).then(({ data }) => { setUsers(data) })
            .catch(e => { console.log(e); alert('problem with server. please try later') });
    }, []);
    return (<div><h3>Top Balance</h3>
        {users && <table className={table}><tbody className={body}>
            {users.leaders.map((u, i) => (<tr key={i}><td><b>{i + 1}</b></td><td><A b={u.avatar.image} /></td><td>{u.username}</td>
                <td>{u.balance}&#9883;</td></tr>))}
            {users.rank && <><tr><td><ul><li> </li><li> </li><li> </li></ul></td></tr><tr>
                <td><b>{users.rank}</b></td><td><A b={users.image} /></td><td>{users.username}</td><td>{users.balance}&#9883;</td>
            </tr></>}
        </tbody></table>}

    </div>)
}