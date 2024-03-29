import { Property } from "@tsed/schema";

export class WishModel {
  constructor(name: string, comments: string) {
    this.name = name;
    this.wish = comments;
  }

  @Property()
  name: string;

  @Property()
  wish: string;
}
