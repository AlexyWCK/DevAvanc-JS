"use client";
import {
  MatchForm,
  MatchResult,
  PlayerData,
  PlayerForm,
  RankingLadder,
} from "@realtime-elo-ranker/libs/ui";
import { Poppins } from "next/font/google";
import { useCallback, useEffect, useRef, useState } from "react";
import fetchRanking from "../services/ranking/fetch-ranking";
import subscribeRankingEvents from "../services/ranking/subscribe-ranking-events";
import {
  RankingEvent,
  RankingEventType,
} from "../services/ranking/models/ranking-event";
import { motion } from "motion/react";
import postMatchResult from "../services/match/post-match-result";
import postPlayer from "../services/player/post-player";

const poppinsBold = Poppins({
  weight: "600",
  style: "normal",
  variable: "--poppins-bold",
});

const poppinsSemiBold = Poppins({
  weight: "500",
  style: "normal",
  variable: "--poppins-semi-bold",
});

const AUTO_MATCH_INTERVAL_MS = 3000;

/**
 * Sorts the players by rank in descending order
 *
 * @param arr - The array of players to sort
 * @returns The sorted array of players
 */
function quickSortPlayers(arr: PlayerData[]): PlayerData[] {
  if (arr.length <= 1) {
    // Already sorted
    return arr;
  }
  const p = arr.pop();
  const left = [];
  const right = [];
  for (const el of arr) {
    if (el.rank >= p!.rank) {
      left.push(el);
    } else {
      right.push(el);
    }
  }
  return [...quickSortPlayers(left), p!, ...quickSortPlayers(right)];
}

/**
 * The home page
 * 
 * @returns The home page component
 */
export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }

  const [ladderData, setLadderData] = useState<PlayerData[]>([]);
  const [autoMatchRunning, setAutoMatchRunning] = useState(false);
  const [showMissingPlayerModal, setShowMissingPlayerModal] = useState(false);
  const autoMatchTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ladderDataRef = useRef<PlayerData[]>([]);

  const updateLadderData = useCallback((player: PlayerData) => {
    setLadderData((prevData) => {
      return quickSortPlayers(
        prevData.filter((p) => p.id !== player.id).concat(player)
      );
    });
  }, []);

  useEffect(() => {
    ladderDataRef.current = ladderData;
  }, [ladderData]);

  const runAutoMatch = useCallback(async () => {
    const safePlayers = ladderDataRef.current;
    if (safePlayers.length < 2) {
      return;
    }
    const pick = () =>
      safePlayers[Math.floor(Math.random() * safePlayers.length)];
    let playerA = pick();
    let playerB = pick();
    while (playerB.id === playerA.id) {
      playerB = pick();
    }
    const possibleResults = [
      MatchResult.LEFT_WIN,
      MatchResult.RIGHT_WIN,
      MatchResult.DRAW,
    ];
    const result =
      possibleResults[Math.floor(Math.random() * possibleResults.length)];
    try {
      await postMatchResult(API_BASE_URL, playerA.id, playerB.id, result);
    } catch (error) {
      console.error("Erreur lors du match automatique", error);
    }
  }, [API_BASE_URL]);

  const startAutoMatch = () => {
    if (autoMatchTimerRef.current) {
      return;
    }
    runAutoMatch();
    autoMatchTimerRef.current = setInterval(
      () => runAutoMatch(),
      AUTO_MATCH_INTERVAL_MS
    );
    setAutoMatchRunning(true);
  };

  const stopAutoMatch = () => {
    if (autoMatchTimerRef.current) {
      clearInterval(autoMatchTimerRef.current);
      autoMatchTimerRef.current = null;
    }
    setAutoMatchRunning(false);
  };

  useEffect(() => {
    return () => {
      if (autoMatchTimerRef.current) {
        clearInterval(autoMatchTimerRef.current);
        autoMatchTimerRef.current = null;
      }
    };
  }, []);

  const handleMatchError = (status: number) => {
    if (status === 422) {
      setShowMissingPlayerModal(true);
    }
  };

  useEffect(() => {
    try {
      fetchRanking(API_BASE_URL).then(setLadderData);
    } catch (error) {
      // TODO: toast error
      console.error(error);
    }
    const eventSource = subscribeRankingEvents(API_BASE_URL);
    eventSource.onmessage = (msg: MessageEvent) => {
      const event: RankingEvent = JSON.parse(msg.data);
      if (event.type === "Error") {
        console.error(event.message);
        return;
      }
      if (event.type === RankingEventType.RankingUpdate) {
        updateLadderData(event.player);
      }
    };
    eventSource.onerror = (err) => {
      // TODO: toast error
      console.error(err);
      eventSource.close();
    };
    return () => eventSource.close();
  }, [API_BASE_URL, updateLadderData]);

  return (
    <div className="min-h-screen w-full">
      <motion.main
        className="flex flex-col gap-8 items-center sm:items-start max-w-full px-12 pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1
          className={`${poppinsBold.className} text-4xl font-bold text-center sm:text-left h-12`}
        >
          Realtime Elo Ranker
        </h1>
        <div className="w-full h-[610px] w-[95%]">
          <h2 className={`${poppinsSemiBold.className} text-2xl`}>
            Classement des joueurs
          </h2>
          <RankingLadder data={ladderData} />
        </div>
        <div className="flex mt-10 gap-12">
          <div className="flex flex-col gap-4">
            <h2 className={`${poppinsSemiBold.className} text-2xl`}>
              Déclarer un match
            </h2>
            <MatchForm
              callback={(
                adversaryA: string,
                adversaryB: string,
                result: MatchResult
              ) =>
                postMatchResult(API_BASE_URL, adversaryA, adversaryB, result)
              }
              onError={handleMatchError}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h2 className={`${poppinsSemiBold.className} text-2xl`}>
              Déclarer un joueur
            </h2>
            <PlayerForm
              callback={(playerName: string) =>
                postPlayer(API_BASE_URL, playerName)
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-6 items-center">
          <button
            type="button"
            className={`btn ${autoMatchRunning ? "btn-danger" : "btn-success"}`}
            onClick={() => {
              if (autoMatchRunning) {
                stopAutoMatch();
              } else {
                startAutoMatch();
              }
            }}
          >
            {autoMatchRunning
              ? "Arrêter match automatique"
              : "Lancer match automatique"}
          </button>
          <span className="text-muted small">
            Les matchs automatiques utilisent les joueurs du classement.
          </span>
        </div>
      </motion.main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
      {showMissingPlayerModal && (
        <div className="modal fade show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Erreur joueur</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Fermer"
                  onClick={() => setShowMissingPlayerModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Le match ne peut pas être enregistré car l’un des joueurs
                  n’existe pas encore, créez-le avant de retenter.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMissingPlayerModal(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
}
