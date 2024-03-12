import { Property } from "@tsed/schema";

export class AcceptRsvpModel {
  @Property()
  eventId: string;

  @Property()
  eventName: string;

  @Property()
  name: string;

  @Property()
  attending: boolean;

  @Property()
  attendanceCount: number;

  @Property()
  comments: string;
}
