
import { createPayload } from "./schemas/message.schemas";
import Service from "../services/message.service";
import BaseRouteSimple from "xhelpers-api/lib/base-route-simple";

const httpResourcePath = "messages";
const httpResourceName = "Messages"

class Routes extends BaseRouteSimple {
  private service: Service;
  constructor() {
    super([httpResourcePath]);
    this.service = new Service();

    this.route("POST", `/api/${httpResourcePath}`, {
        description: `Create new '${httpResourceName}'`,
      },
      false
    )
      .validate({ payload: createPayload })
      .handler(async (r, h, u) => {
        const response = await this.service.publish(r.payload);
        return h
          .response(response)
        .code(200);
      })
      .build();
  }
}

module.exports = [...new Routes().buildRoutes()];
