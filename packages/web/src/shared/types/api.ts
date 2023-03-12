export type NumberOfAnswers = 2 | 3 | 4 | 5;

export interface Api {
  "/functions/ask-audience": {
    method: "post";
    request: {
      question: string;
      conversationId?: string;
      numberOfAnswers?: NumberOfAnswers;
      template: string;
      openaiApiKey?: string;
    };
    response: {
      conversationId: string;
      answers: string[];
    };
  };
}

export type EndpointKey = keyof Api;
export type Endpoint<K extends EndpointKey> = Api[K];
export type EndpointMethod<K extends EndpointKey> = Endpoint<K>["method"];
export type EndpointRequest<K extends EndpointKey> = Endpoint<K>["request"];
export type EndpointResponse<K extends EndpointKey> = Endpoint<K>["response"];

// Typescript way of forcing us to have an array of each item without duplicates
const endpointMap: Record<EndpointKey, undefined> = {
  "/functions/ask-audience": undefined,
};

export const endpoints = Object.keys(endpointMap) as EndpointKey[];

export interface ErrorResponse {
  success: false;
  error: string;
}

export interface SuccessResponse<E extends EndpointKey> {
  success: true;
  response: EndpointResponse<E>;
}

export type Response<E extends EndpointKey> =
  | ErrorResponse
  | SuccessResponse<E>;
