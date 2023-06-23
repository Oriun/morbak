import { Room } from "../types/room.types.js";
import { checkWin } from "../board.js";

export function instantiate(room: Room) {
    /*
    Depart de la game =>
    check si joueurs qui joue est bon
    ajouter move dans room.current
    Check si victoire, sinon continue
    */
   
    // TODO : Reception event !
    var move: string = "12";
    room.current[parseInt(move.charAt(0))][parseInt(move.charAt(1))];
    if (checkWin(room.current,room.winLength)){
        // QUELQU'UN A WIN
    } else {
        // on continue
    }
}