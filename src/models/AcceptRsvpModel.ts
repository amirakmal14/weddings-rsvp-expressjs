import { Property } from "@tsed/schema";

export class AcceptRsvpModel {
  @Property()
  eventName: string;
  name: string;
  attending: boolean;
  attendanceCount: number;
  comments: string;
}
