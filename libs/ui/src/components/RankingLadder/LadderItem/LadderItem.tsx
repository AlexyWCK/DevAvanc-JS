import React, { FC } from "react";

export type PlayerData = {
  id: string;
  rank: number;
};

/**
 * Propriétés du composant LadderItem
 */
interface LadderItemProps {
  player: PlayerData;
}

/**
 * Composant fonctionnel pour afficher un joueur dans le classement
 *
 * @param {LadderItemProps} props Les propriétés du composant
 * @param {PlayerData} props.player Les données du joueur
 *
 * @returns {JSX.Element} Le composant pour afficher un joueur dans le classement
 */
const LadderItem: FC<LadderItemProps> = (props) => (
  <div data-testid="LadderItem" className="flex justify-between mb-4 gap-4 p-2 border border-gray-300 rounded-md">
    <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">{props.player.id}</span>
    <span className="bg-pink-700 text-gray-200 px-4 rounded-full w-16">{props.player.rank}</span>
  </div>
);

export default LadderItem;
