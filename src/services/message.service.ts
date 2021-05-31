import { publisher } from "../model/redis_channel";

export default class Service {
  protected sentitiveInfo: any = ["-__v"];
  constructor() {}

  public async publish({ message, channelId }) {
    console.log(channelId, message)
    publisher.publish(`${channelId}`, message)
  }
}
