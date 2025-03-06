import { GoogleGenerativeAI } from "@google/generative-ai";

export class Gemini {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("No API key found for Gemini");
    }
  }
  private AIModelName = { model: "gemini-1.5-flash" };
  private GenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  private Model = this.GenAI.getGenerativeModel(this.AIModelName);

  private systemMessage =
    "You are an AI assistant tasked with creating new suggestions for my webapp Consensus." +
    "You need to generate the new options for the game which allows a user to rank 4 distinct values from the same category." +
    "For example given a category Seasons the options would be: fall, spring, summer, winter " +
    "I want you to when given a category generate 10 distinct groups of 4 values for the options for that category." +
    "If you are not given a category, generate 10 distinct category's each with one group of 4 values for the options for that category." +
    "Format all responses as an array of JSON objects matching the ConsensiSuggestion interface: " +
    "{ _id: string, author: string, category: string, options: string[], date: string }." +
    "Make sure the author is Set to AI and set date to null as a string" +
    "Please do not include any other text beside the array of JSON objects";

  async prompt(userMessage: string) {
    const formattedMessage = this.formatMessage(userMessage);
    const result = await this.Model.generateContent(formattedMessage);

    return result.response.text();
  }

  private formatMessage(userMessage: string) {
    return `${this.systemMessage}\nUser: ${userMessage}`;
  }
}
