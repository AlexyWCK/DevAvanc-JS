import { RankingUpdate } from "./ranking-update";

export enum RankingEventType {
  RankingUpdate = "RankingUpdate"
}

export type RankingEvent = RankingUpdate | { type: "Error" } & Error;