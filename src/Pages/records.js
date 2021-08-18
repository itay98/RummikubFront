import { useState, useEffect } from "react";
import axios from "../axios";
import Spinner from "../Components/spinner";
export default function Records() {
    const [games, setGames] = useState(), [id] = useState(+localStorage.getItem('id'));
    const [token] = useState(localStorage.getItem('token'));
    useEffect(() => {
        axios.get(`/users/games?id=${id}&token=${token}`)
            .then(({ data }) => data ? setGames(data) : alert('problem with credentials'))
            .catch(e => { console.log(e); alert('problem with server. please try later') });
    }, [id, token]);
    return (<div><h3>All Your Games</h3>
        {games ? (<table className='table table-hover'>
            <thead><tr>
                <th>#</th><th>Date</th><th>Duration</th><th>Won?</th><th>Cost</th><th>Prize</th>
            </tr></thead>
            <tbody>{games.map((g, i) => (<tr key={i}>
                <td>{i + 1}</td><td>{new Date(g.createdAt).toLocaleDateString()}</td><td>{g.duration}</td>
                <td>{g.winnerId === id ? 'yes' : 'no'}</td><td>{g.pointsLost}</td><td>{g.pointsWon}</td>
            </tr>))}</tbody>
        </table>) : <Spinner />}</div>)
}