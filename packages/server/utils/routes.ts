import askAudience from "../functions/askAudience";
import { endpoints, EndpointKey, EndpointMethod } from "../shared/types/api";
import { RequestHandler } from "../types/RequestHandler";

interface Route<E extends EndpointKey> {
  method: "get" | "post";
  route: EndpointKey;
  callback: RequestHandler<E>;
}

const endpointMap: {
  [K in EndpointKey]: {
    method: EndpointMethod<K>;
    callback: RequestHandler<K>;
  };
} = {
  "/functions/ask-audience": {
    method: "post",
    callback: askAudience,
  },
};

const routes: Route<EndpointKey>[] = endpoints.map((endpoint) => ({
  route: endpoint,
  ...endpointMap[endpoint],
}));

export default routes;
