import { Injectable } from "@tsed/di";
import Database from "sheetsql";
import { AcceptRsvpModel } from "src/models/AcceptRsvpModel";
import { AzureKeyVaultService } from "./AzureKeyVaultService";

@Injectable()
export class SpreadSheetsService {
  constructor(private readonly azureKeyVaultService: AzureKeyVaultService) {}
  private readonly calendars: any[] = [];

  private db = new Database({
    db: "1vJ7dNspOOhg9iOPuTVNDJ8i4xmMBEu_FUxjqyOH1P_w",
    table: "Sheet1", // optional, default = Sheet1
    keyFile: "src/services/wedding-rsvp-416923-b105d4bc4231.json",
    cacheTimeoutMs: 5000, // optional, default = 5000
  });

  async create(acceptRsvpModel: AcceptRsvpModel) {
    const key = await this.azureKeyVaultService.getSecrets(
      "google-spreadsheets-sa-key"
    );
    console.log("key", key);
    // await this.db.load();
    // this.calendars.push(acceptRsvpModel);
  }

  findAll(): any[] {
    return this.calendars;
  }
}
