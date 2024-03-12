import { Injectable } from "@tsed/di";
import Database from "sheetsql";
import { AcceptRsvpModel } from "src/models/AcceptRsvpModel";
import { AzureKeyVaultService } from "./AzureKeyVaultService";

@Injectable()
export class SpreadSheetsService {
  constructor(private readonly azureKeyVaultService: AzureKeyVaultService) {}
  private serviceAccountKey: string | undefined = "";
  private database: Database;

  async create(acceptRsvpModel: AcceptRsvpModel) {
    try {
      this.database = await this.getDatabase(
        acceptRsvpModel.eventId,
        "Accepted"
      );
      await this.database.load();
      await this.database.insert([
        {
          name: acceptRsvpModel.name,
          attendanceCount: acceptRsvpModel.attendanceCount,
          comments: acceptRsvpModel.comments,
        },
      ]);
    } catch (error) {
      console.error("Error creating rsvp:", error.message);
      throw error;
    }
  }

  private async getDatabase(
    spreadSheetId: string,
    sheetId: string
  ): Promise<Database> {
    if (
      this.serviceAccountKey === "" ||
      this.getServiceAccountKey === undefined
    ) {
      await this.getServiceAccountKey();
    }

    return new Database({
      db: spreadSheetId,
      table: sheetId, // optional, default = Sheet1
      keyFile: this.serviceAccountKey,
      cacheTimeoutMs: 5000, // optional, default = 5000
    });
  }

  private async getServiceAccountKey() {
    this.serviceAccountKey = await this.azureKeyVaultService.getSecrets(
      "google-spreadsheets-sa-key"
    );
  }
}
