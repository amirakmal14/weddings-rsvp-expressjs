import { Controller } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { SpreadSheetsService } from "../../services/SpreadSheetsServices";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { AcceptRsvpModel } from "../../models/AcceptRsvpModel";
import { WishModel } from "../../models/WishModel";

@Controller("/rsvp")
export class RsvpController {
  constructor(private readonly spreadSheetsService: SpreadSheetsService) {}
  @Get("/")
  async get() {
    return "hello";
  }

  @Post("/")
  async post(@BodyParams() payload: AcceptRsvpModel) {
    await this.spreadSheetsService.create(payload);
  }

  @Get("/:eventId/wishes")
  async getWishesByEventId(
    @PathParams("eventId") eventId: string
  ): Promise<WishModel[]> {
    const wishes = await this.spreadSheetsService.getWishesByEventId(eventId);
    return wishes;
  }
}
