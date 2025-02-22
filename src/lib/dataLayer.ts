import client from "./db";

export class DataLayer {
    private dbName = "consensus";

    protected async getDb() {

        if(!client){
            throw new Error("client is missing");
        }
        await client.connect();

        return client.db(this.dbName);
    }
}

export class GameData extends DataLayer {
    private collectionName = "gameData"

    private async getCollection() {
        const db = await this.getDb();
        return db.collection("collectionName");
    }

    public async getData() {
        const collection = await this.getCollection();
        return collection.find({}).toArray();
    }

    public async getByUsername(username: string) {
        const collection = await this.getCollection();
        const submissions = await collection.find({username}).toArray();

        if (submissions.length === 0) {
            throw new Error(`No submissions found for username: ${username}`);
        }

        return submissions;
    }

    public async getTodaysRankings(date: Date){
        const collection = await this.getCollection();
        const submissions = await collection.find({date}).toArray();
        if (submissions.length === 0) {
            throw new Error(`No submissions found for date: ${date}`);
        }

        return submissions;
    }

}

export class Consensi extends DataLayer{
    private collectionName = "consensi"

    private async getCollection() {
        const db = await this.getDb();
        return db.collection("collectionName");
    }

    public async getData() {
        const collection = await this.getCollection();
        return collection.find({}).toArray();
    }

    public async getTodaysConsensi(date: Date){
        const collection = await this.getCollection();
        const submissions = await collection.find({date}).toArray();
        if (submissions.length === 0) {
            throw new Error(`No Consensi found for date: ${date}`);
        }

        return submissions;
    }


}