import Po from 'react-bootstrap/Popover';
import OlT from 'react-bootstrap/OverlayTrigger';
import { text, rules } from "./popover.module.scss";
export function TFPOT({ title, content, ...props }) {
    return (<OlT transition={false} placement="right" trigger="focus" overlay={<Po className={text}>
        <Po.Title as="h6">{title}</Po.Title><Po.Content>{content}</Po.Content></Po>}>{op => <input {...props} {...op} />}</OlT>)
}
export function GRPOT(props) {
    return (<OlT transition={false} placement="top" trigger="click" overlay={<Po className={rules}>
        <Po.Title as="h6">Game Rules in short</Po.Title><Po.Content>
            Be the first to empty your rack by dragging your tiles next to others, forming sets.<br />
        Group- a set of either 3 or 4 tiles of the same number in different colors.<br />
        Run- a set of at least 3 consecutive numbers (1 CANNOT follow 13) all in the same color.<br />
        Two jokers CANNOT be used in a single set.<br />
        Initial meld stage: every player must place sets with a total sum (each tile is worth it's number and a joker is worth
        the one it replaces) of at least 30. In those sets you CANNOT use tiles from the board. Once you did that you reach the
        manipulations stage with neither limitaions.<br />
        Each turn has a time limit of 30 seconds. When the turn ends, you'll get one tile from the pool if you didn't get rid
        of any tile, or two tiles as a penalty if you left an invalid board. All tiles successfully placed on the board must remain
        there.<br />
        End: once a player managed to use all their tiles the game ends with them as the winner. However, if no player managed
        to do so when the tile pool had emptied, the game ends and the winner is determined by the tiles left on each player's
        rack. The tiles are summed up (joker is worth 30) and the player with lowest sum wins.
        </Po.Content></Po>}>{op => <div {...props} {...op}>Rules</div>}</OlT>)
}