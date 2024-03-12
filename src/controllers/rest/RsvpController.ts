import { Controller } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { SpreadSheetsService } from "../../services/SpreadSheetsServices";
import { BodyParams } from "@tsed/platform-params";
import { AcceptRsvpModel } from "../../models/AcceptRsvpModel";

@Controller("/rsvp")
export class RsvpController {
  constructor(private readonly spreadSheetsService: SpreadSheetsService) {}
  @Get("/")
  async get() {
    await this.spreadSheetsService.create(new AcceptRsvpModel());
    return "hello";
  }

  @Post("/")
  async post(@BodyParams() payload: AcceptRsvpModel) {
    //await this.spreadSheetsService.create(undefined);
  }
}
