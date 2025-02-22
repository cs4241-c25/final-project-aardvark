export interface User{
    username: string;
}

export interface Ranking{
    [id: string]: 1 | 2 | 3 | 4,
}

export interface ConsensusSubmission{
    user: User | null
    lat: number | null,
    lon: number | null,
    date: Date | null
    ranking: Ranking
}

export interface AllRankings{
    allRankings: ConsensusSubmission[]
}






