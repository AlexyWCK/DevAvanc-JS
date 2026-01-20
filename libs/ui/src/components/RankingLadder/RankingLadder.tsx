import React, { FC } from "react";
import LadderItem, { PlayerData } from "./LadderItem/LadderItem";
import { AnimatePresence, motion } from "motion/react";

interface RankingLadderProps {
  data: PlayerData[];
}

/**
 * Composant fonctionnel pour afficher le classement des joueurs
 *
 * @param {RankingLadderProps} props Les propriétés du composant
 * @param {PlayerData[]} props.data Les données des joueurs
 * @param {(data: PlayerData[]) => void} props.updateData La fonction pour mettre à jour les données des joueurs
 *
 * @returns {JSX.Element} Le composant pour afficher le classement des joueurs
 */
const RankingLadder: FC<RankingLadderProps> = (props) => {
  const { data } = props;

  // return(<></>)

  return (
    <div data-testid="RankingLadder" className="h-full">
      <AnimatePresence>
        <div className="pt-4 columns-8 gap-4 overflow-x-auto max-h-full themed-scrollbar">
          {data.map((player) => (
            <motion.div
              key={player.id}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: {
                  delay: 0.3,
                  type: "spring",
                  stiffness: 260,
                  damping: 40,
                },
              }}
              layout
            >
              <LadderItem player={player} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default RankingLadder;
