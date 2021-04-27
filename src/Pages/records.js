import { useState, useEffect } from "react";
import axios from "../axios";
const id = parseInt(localStorage.getItem('id'));
export default function Records() {
    const [games, setGames] = useState([]);
    useEffect(() => {
        axios.get('/users/games?id=' + id).then(({ data }) => typeof data === 'string' ? alert(data) : setGames(data))
            .catch(e => { console.log(e); alert('problem with server. please try later') });
    }, []);
    return (<div><h3>All Your Games</h3>
        <table className='table table-hover'>
            <thead><tr>
                <th>#</th><th>Date</th><th>Duration</th><th>Won?</th><th>Cost</th><th>Prize</th>
            </tr></thead>
            <tbody>
                {games.map((g, i) => (<tr key={i}><td>{i + 1}</td><td>{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td>{g.duration}</td><td>{g.winnerId === id ? 'yes' : 'no'}</td><td>{g.pointsLost}</td><td>{g.pointsWon}</td></tr>))}
            </tbody>
        </table></div>)
}