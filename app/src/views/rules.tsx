import * as React from "react";

interface IRulesProps {}

const Rules: React.FunctionComponent<IRulesProps> = (props) => {
  return (
    <div className="text-white w-full max-w-2xl">
      <h1 className="text-4xl font-bold mb-5">Morbak</h1>
      <p>
        Morbak est un jeu de stratégie et de chance. Le but est de remplir une
        ligne, une colonne ou une diagonale avec des pièces de votre avatar
        comme dans le morpion.
        <br />
        <br />
        Contrairement au morpion, le jeu se joue avec jusqu'à quatre joueurs. Il
        se joue sur un plateau de 4x4, 5x5 ou 6x6 en fonction du nombre de
        joueurs.
        <br />
        <br />
        L'autre particularité du jeu est que les pièces peuvent être mangées par
        les autres joueurs après un certain nombre de coups.
      </p>
      <h2 className="text-2xl font-bold mt-5 mb-3">Règles</h2>
      <div>
        <h4 className="text-xl font-bold mt-5 mb-3">Victoire</h4>
        <p>
          Le but est de remplir une ligne, une colonne ou une diagonale avec des
          pièces de votre avatar comme dans le morpion.
        </p>
        <h4 className="text-xl font-bold mt-5 mb-3">Tour par tour</h4>
        <p>
          Chaque joueur joue à tour de rôle. Le premier joueur est le
          propriétaire de la salle.
          <br />
          Le joueur peut placer une pièce de son avatar sur une case vide en
          cliquant dessus.
          <br />
          Si le joueur ne joue pas dans la limite de temps, il perd son tour.
        </p>
        <h4 className="text-xl font-bold mt-5 mb-3">
          Manger les pièces des autres joueurs
        </h4>
        <p>
          Après un certain nombre de coups, les pièces peuvent être mangées par
          les autres joueurs.
          <br />
          Le nombre de coups avant qu'une pièce puisse être mangée est de 5 pour
          un plateau 4x4, de 6 pour un plateau 5x5 et de 7 pour un plateau 6x6.
          Le nombre de coups avant qu'une pièce puisse être mangée est affiché
          dans le coin supérieur droit de la case.
        </p>
        <h4 className="text-xl font-bold mt-5 mb-3">
          Dernière règle
        </h4>
        <p>
          La dernière règle est qu'il n'y a pas de dernière règle. Le jeu se
          termine lorsque le premier joueur remplit une ligne, une colonne ou
          une diagonale avec des pièces de son avatar.
        </p>
      </div>
    </div>
  );
};

export default Rules;
