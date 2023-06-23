import * as React from 'react';
import { useNavigate } from 'react-router-dom';

interface ILobbyViewProps {
}

const LobbyView: React.FunctionComponent<ILobbyViewProps> = (props) => {
    const navigate = useNavigate()
  return <section>
    <h1>Morbak</h1>
    <h2>En attente d'autres joueurs</h2>
    <p>Session ID: 123456</p>
    <p>Temps: 5</p>
    <p>Grille: 4 x 4</p>
    <p>Condition de victoire: 3</p>
    <p>Nombre de joueurs: 2</p>
    <p>Joueurs:</p>
    <ul>
        <li>Player 1</li>
        <li>Player 2</li>
    </ul>
    <button onClick={()=>navigate("/game")}>Commencer</button>
  </section>
};

export default LobbyView;
