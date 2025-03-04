import { ObjectId } from "mongodb";

export interface Ranking {
  [id: string]: 1 | 2 | 3 | 4;
}

export interface GameDataRecord {
  // represents a user submission
  _id?: ObjectId;
  metadata: {
    date: string;
    user: string;
  };
  consensusId: ObjectId | null;
  submission: Ranking;
  location: {
    lat: number;
    lon: number;
  } | null;
}

export interface ConsensiRecord {
  // represents a consensus game for a given day
  _id?: ObjectId;
  metadata: {
    date: string;
    author: string | null;
  };
  category: string;
  consensusNum: number;
  options: string[];
}

export interface SuggestionRecord {
  _id?: ObjectId;
  author: string | null;
  category: string;
  consensusNum: number;
  options: string[];
  checked: string;
  date: string;
}

export interface Tile {
  // represents a tile in the game
  _id: number;
  displayName: string;
  rank: 1 | 2 | 3 | 4 | undefined;
  color: string;
}

export interface TodaysConsensus {
  numSubmissions: number;
  consensus: Record<string, number>;
}

export interface UserData {
  played: GameDataRecord | null;
  score: number | null;
  stats: {} | null;
}