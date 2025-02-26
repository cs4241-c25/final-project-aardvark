import { getDateString } from "@/utils/dateFormat";
import client from "./db";
import { ConsensiRecord, GameDataRecord } from "./interfaces";

export class DataLayer {
  private dbName = "consensus";

  protected async getDb() {
    if (!client) {
      throw new Error("client is missing");
    }
    await client.connect();

    return client.db(this.dbName);
  }
}

export class GameData extends DataLayer {
  private collectionName = "gameData";

  private async getCollection() {
    const db = await this.getDb();
    return db.collection(this.collectionName);
  }

  public async getAllRankings() {
    const collection = await this.getCollection();
    return collection.find({}).toArray();
  }

  public async getByUsername(username: string) {
    const collection = await this.getCollection();
    const submissions = await collection.find({ username }).toArray();

    if (submissions.length === 0) {
      throw new Error(`No submissions found for username: ${username}`);
    }

    return submissions;
  }

  public async getTodaysRankings() {
    const today = getDateString(new Date());
    const collection = await this.getCollection();
    const submissions = await collection
      .find({ "metadata.date": today })
      .toArray();
    if (submissions.length === 0) {
      throw new Error(`No submissions found for date: ${today}`);
    }

    return submissions;
  }

  public async addNewSubmission(gameData: GameDataRecord) {
    const collection = await this.getCollection();
    const result = await collection.insertOne(gameData);
    return result;
  }
}

export class Consensi extends DataLayer {
  private collectionName = "consensi";

  private async getCollection() {
    const db = await this.getDb();
    return db.collection(this.collectionName);
  }

  public async getData() {
    const collection = await this.getCollection();
    return collection.find({}).toArray();
  }

  public async getTodaysConsensiByDate(date: Date) {
    const collection = await this.getCollection();
    const submissions = await collection.find({ date }).toArray();
    if (submissions.length === 0) {
      throw new Error(`No Consensi found for date: ${date}`);
    }

    return submissions;
  }

  public async getTodaysConsensiByNum(consensusNum: number) {
    const collection = await this.getCollection();
    const submissions = await collection
      .find({ consensusNum: Number(consensusNum) })
      .toArray();
    if (submissions.length === 0) {
      throw new Error(`No Consensi found for consensusNum: ${consensusNum}`);
    }

    return submissions;
  }

  public async saveConsensus(consensusData: ConsensiRecord) {
    const collection = await this.getCollection();
    const result = await collection.insertOne(consensusData);
    if (!result){
      throw new Error('Could not add consensi')
    }
    return result;
  }
  
  public async getHighestConsensusNum() {
    const collection = await this.getCollection();
    const highestConsensus = await collection
      .find({})
      .sort({ consensusNum: -1 }) // Sort in descending order
      .limit(1) // Get only the highest one
      .toArray();
  
    if (highestConsensus.length === 0) {
      throw new Error("No Consensi records found");
    }
  
    return highestConsensus[0].consensusNum;
  }
}
