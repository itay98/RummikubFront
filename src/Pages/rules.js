import { cont } from "./rules.module.scss";
export default function Rules() {
    return <div className={cont}><h3>How to Play</h3>
        <p><u>Settings</u> the game can be played between 2 to 4 players. Choose how many will play and the amount of points at
            stake. With the Master point amount you get no help (rules and sorting buttons and error alerts).</p>
        <p><b><u>Objective:</u></b> be the first player to empty your rack by forming sets with your tiles.</p>
        <p><u>Sets:</u> sets on the board must be placed together on the same line with no spaces between the tiles, left to right
            ordered. You may use the buttons 'Sort to Groups' and 'Sort to Runs' to help you find sets on your rack.<br />
            <i>GROUP</i>- a set of either three or four tiles of the same number in different colors.<br />
            <i>Run</i>- a set of three or more consecutive numbers all in the same color. The number 1 is always played as the
            lowest number, it cannot follow the number 13.</p>
        <p><u>Tiles:</u> a total of 106 (2 decks of tiles, in each are numbers 1-13 in four colors and a joker). At the beginning
            of the game each player has 14 tiles on their rack. The rest are put in the tile pool, faced down and in piles of 4.
            Each tile is worth the number shown on it. When the pool empties the game ends, each rack is evaluated by the sum of
            the tiles remain (joker counts as 30) and the player with the lowest sum is the winner.</p>
        <p><u>Slots:</u> tiles are placed inside board or rack slots (the lighter colored area). In order to Move tiles you select
            them and then click the starting position slot. Click each tile to select it and again to deselect. When you make an
            error you get an alert, click it to dismiss.</p>
        <p><u>The board:</u> a common place for any player to create and manipulate sets. When it isn't your turn you aren't
            allowed to change the board and you can only watch the changes others make to it. When it gets too full of tiles more
            empty slots are added and every tile appears smaller.</p>
        <p><u>Turns:</u> last up to 30 seconds. On every turn the player must use tiles from their rack to create or reorder the
            sets on the board. If they don't have a way to place any of their tiles on the board in a valid form, they must draw a
            tile from the pool to their rack. During your turn you'll see a timer and the button 'Finish Turn', click it to end
            your turn before the time limit passes. When the turn ends, you'll get one tile from the pool if you didn't get rid of
            any tile, or two tiles if you left the board in an invalid form, as a penalty. If the board is valid, all the tiles you
            placed there become board tiles- they loose their black mark and no player can ever take them to their rack.</p>
        <p><u>Initial meld:</u> must consist of sets only with tiles you own, and sum up to at least 30 (jokers count as the number
            they replace). Only after you succeed with the initial meld stage you are then allowed to manipulate the sets on the
            board. Sets can be manipulated in many ways as long as at the end of each round only legitimate sets remain and there
            are no loose tiles left over.</p>
        <p><u>Manipulation examples:</u> remove a fourth tile from a group and use it to form a new set. Split a long run by a tile
            in the middle with a number you have, then add your tile to the new run. Add a fourth tile to a set, then remove one
            from it, to make another set.</p>
        <p><u>Jokers:</u> any of the two jokers can replace any tile missing on a set. Although each tile appears twice in the game
            (with the same number and color), a joker can be used to represent the same tile a 3rd time. Two jokers cannot be used
            in a single set.</p>
        <p><u>Strategy:</u> it's a good idea to hold onto some of your tiles and let the other players lay down their sets so that
            you may have more opportunities for manipulations. It is sometimes useful to hold onto the fourth tile of a group or
            run so that in the next round you can lay a tile instead of drawing from the pool. Choose when to use your joker and
            hold onto it for a time of need, but remember you don't want to get caught out with it on your rack when the pool runs
            out of tiles.</p>
        <p><u>Quiting:</u> if a player leaves the game it carries on without them, and if only one remains the game ends with that
            player as the winner. If you close or refresh the game's window you left the game and lost.</p>
        <p>For a quick reminder of the Rummikub rules click the button 'rules'.</p><br />
    </div>
}