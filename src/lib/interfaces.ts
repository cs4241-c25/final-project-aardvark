import { ObjectId } from "mongodb";

export interface Ranking {
  [id: string]: 1 | 2 | 3 | 4;
}

export interface GameDataRecord {
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
  _id?: ObjectId;
  metadata: {
    date: string;
    author: string | null;
  };
  category: string;
  consensusNum: number;
  options: string[];
}
