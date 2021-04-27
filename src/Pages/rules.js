import { cont } from "./rules.module.css";
export default function Rules() {
    return <div className={cont}><h3>How to Play</h3>
        <p>Objective: be the first player to empty your rack by forming sets with your tiles.</p>
        <p>Sets: you may use the buttons 'Sort to Groups' and 'Sort to Runs' to help sort your rack.<br /><b>Group</b>- a set of
        either three or four tiles of the same number in different colors.<br /><b>Run</b>- a set of three or more consecutive
        numbers all in the same color. The number 1 is always played as the lowest number, it cannot follow the number 13.</p>
        <p>The board is a common place for every set any player created, and the sets can be manipulated there. When it gets to
        full of tiles it gets more empty slots and every tile will appear smaller.</p>
        <p>Drag and drop tiles onto empty slots (lighter background) in your rack or the board. If you want to add tiles to a set
        on the board and there's another set tight to it you must drag the tiles on the set one by one to a free spot, maybe a
        new line. When it's not your turn you can only reorder the tiles on your rack. If you do an invalid drag it wouldn't work
        and an error sound would be played</p>
        <p>There are 106 tiles (8 sets of tiles 1-13 in four colors, and 2 jokers). At the beginning of the game each player has
        14 tiles on their rack. The rest are put in the tile pool, faced down and in piles of 4. Each tile is worth the number
        shown on it. When the pool empties the game ends, each rack is evaluated by the sum of the tiles remain (joker counts as
        30) and the player with the lowest sum is the winner.</p>
        <p>Each turn has a time limit of 30 seconds. On every turn the player must use tiles from their rack to create or reorder
        the sets on the board. If they don't have a way to place any of their tiles on the board in a valid form, they must draw
        a tile from the pool to their rack. During your turn you'll see a timer and the button 'Finish Turn', click it to end
        your turn before the time limit passed. When the turn ends, you'll get one tile from the pool if you didn't get rid of
        any tile, or two tiles if you left the board in an invalid form, as a penalty. If the board is valid, all the tiles you
        placed there become board tiles- they loose their black mark and no player can ever take them to their rack.</p>
        <p>Each player's initial meld must consist of sets from their own rack, and with a sum of at least 30. A joker counts as
        the number it replaces. Only after you succeed with the initial meld stage you are then allowed to manipulate the sets on
        the board. Sets can be manipulated in many ways as long as at the end of each round only legitimate sets remain and no
        loose tiles are left over.</p>
        <p>Manipulation examples: Remove a fourth tile from a group and use it to form a new set. Split a long run by a tile in
        the middle with a number you have, then add your tile to the new run. Add a fourth tile to a set, then remove one from it,
        to make another set.</p>
        <p>Jokers: any of the two jokers can replace any tile missing on a set. Although each tile appears twice in the game (with
        the same number and color), a joker can be used to represent the same tile a 3rd time. Two jokers cannot be used in a
        single set.</p>
        <p>Strategy: It's a good idea to hold onto some of your tiles and let the other players lay down their sets so that you may
        have more opportunities for manipulations. It is sometimes useful to hold onto the fourth tile of a group or run so that in
        the next round you can lay a tile instead of drawing from the pool. Choose when to use your joker and hold onto it for a
        time of need, but remember you don't want to get caught out with it on your rack when the pool runs out of tiles.</p>
        <p>If a player leaves the game it carries on without them, and if only one player remains the game ends with them as the
        winner. If you close or refresh the game's window you left the game and lost.</p>
        <p>For a quick reminder of the Rummikub rules click the button 'rules'.</p><br />
    </div>
}