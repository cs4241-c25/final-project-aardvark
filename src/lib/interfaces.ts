import { ObjectId } from "mongodb";

export interface Ranking {
  [id: string]: 1 | 2 | 3 | 4;
}

const ranking: Ranking = {
  summer: 1,
  winter: 2,
  fall: 3,
  spring: 4,
};

const consensus: Ranking = {
  summer: 2,
  winter: 3,
  fall: 1,
  spring: 4,
};

export interface GameDataRecord {
  _id?: ObjectId;
  metadata: {
    // links to consensus collection for category, options, date
    date: Date;
    // could change based on fingerprintjs
    user: string;
  };
  consensusId: ObjectId;
  submission: Ranking;
  location: {
    lat: number;
    lon: number;
  } | null;
}

export interface ConsensiRecord {
  _id?: ObjectId;
  metadata: {
    date: Date;
    author: string | null;
  };
  category: string;
  consensusNum: number;
  options: { 1: string; 2: string; 3: string; 4: string };
}
