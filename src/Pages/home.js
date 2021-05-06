import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { cont } from "./home.module.scss";
export default function Home() {
    return <div className={cont}><div></div>
        <i>This website is served by a free heroku app which uses dynos. Those bots go to sleep after 30 minutes of inactivity
        so when you first get a server error try again and once they're awake it should work...</i>
        <p>Rummikub is one of the most popular games in the world. It was developed by the late Mr. Ephraim Hertzano back
        in the 50’s. Nowadays Rummikub is sold in over 70 countries and translated into 28 languages.</p>
        <p>It has all the elements of making it the greatest game. It's easy to learn and fast-moving. The board changes all
        the time as players adjust the tiles on the table. It combines luck and strategy and it quickly changes so every player
        has a chance to win until the very end.</p>
        {localStorage.getItem('token') ? <p>The game started as a brilliant idea that had occurred to Mr. Hertzano – to
        substitute the traditional cards, used in a popular card game, with colorful tiles and new game play. This idea
        came up living in Romania at a time when the authorities ordered all card games to be outlawed. The word about the
            game soon spread and demand for it began to grow.</p>
            : <h3>JOIN NOW<br />Get 20 &#9883; points to play against other people!<br />
                <Button variant="success"><Link to="/register">Sign Up</Link></Button></h3>}
    </div>
}