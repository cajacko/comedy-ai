import {
  EndpointKey,
  EndpointMethod,
  EndpointResponse,
  EndpointRequest,
  Response,
  ErrorResponse,
} from "../shared/types/api";

async function api<E extends EndpointKey>(
  endpoint: E,
  method: EndpointMethod<E>,
  request: EndpointRequest<E>
): Promise<EndpointResponse<E>> {
  let url = new URL(endpoint, process.env.REACT_APP_API_URL ?? "").href;

  // NOTE: If have get endpoint, then implement
  // if (method === "get") {

  // }

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: method === "post" ? JSON.stringify(request) : undefined,
  });

  if (response.status === 200) {
    const data: Response<E> = await response.json();

    if (!data.success) {
      throw new Error(`Api responded with success=false: ${data.error}`);
    }

    return data.response;
  }

  let data: ErrorResponse;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(
      `Api responded with ${
        response.status
      } status and could not parse response: ${String(error)}`
    );
  }

  throw new Error(
    `Api responded with ${response.status} status and success=false: ${data.error}`
  );
}

export default api;
