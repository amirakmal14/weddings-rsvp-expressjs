import { Injectable } from "@tsed/di";
import Database from "sheetsql";
import { AcceptRsvpModel } from "../models/AcceptRsvpModel";
import { AzureKeyVaultService } from "./AzureKeyVaultService";
import path from "path";
import fs from "fs";
import { WishModel } from "../models/WishModel";

@Injectable()
export class SpreadSheetsService {
  constructor(private readonly azureKeyVaultService: AzureKeyVaultService) {}
  private tempFilePath: string = "";
  private database: Database;

  async getWishesByEventId(eventId: string): Promise<WishModel[]> {
    try {
      this.database = await this.getDatabase(eventId, "Accepted");
      await this.database.load();
      const result = await this.database.find();

      const wishes: WishModel[] = result
        .filter((item: any) => item.comments && item.comments.trim() !== "") // Filter out items where comments are null or whitespace
        .map((item: any) => {
          return new WishModel(item.name, item.comments);
        });

      return wishes;
    } catch (error) {
      console.error("Error fetching wishes by event ID:", error.message);
      throw error;
    }
  }

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
          createdAt: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kuala_Lumpur",
          }),
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
    if (this.tempFilePath === "") {
      await this.getServiceAccountKey();
    }

    return new Database({
      db: spreadSheetId,
      table: sheetId, // optional, default = Sheet1
      keyFile: this.tempFilePath,
      cacheTimeoutMs: 5000, // optional, default = 5000
    });
  }

  private async getServiceAccountKey() {
    const jsonKeyFileContent = await this.azureKeyVaultService.getSecrets(
      "google-spreadsheets-sa-key"
    );

    const tempDir = path.join(__dirname, "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    this.tempFilePath = path.join(tempDir, "google-serviceaccount.json");
    fs.writeFileSync(this.tempFilePath, jsonKeyFileContent as string);
  }
}
