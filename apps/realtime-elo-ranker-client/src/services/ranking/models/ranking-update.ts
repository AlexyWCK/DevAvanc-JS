import { RankingEventType } from "./ranking-event";

export type RankingUpdate = {
  type: RankingEventType.RankingUpdate;
  player: {
    id: string;
    rank: number
  }
}