import { RequestHandler as ERequestHandler } from "express";
import {
  EndpointKey,
  Response,
  EndpointRequest,
  EndpointMethod,
} from "../shared/types/api";

export type RequestHandler<E extends EndpointKey> =
  EndpointMethod<E> extends "get"
    ? ERequestHandler<unknown, Response<E>, unknown, EndpointRequest<E>>
    : ERequestHandler<unknown, Response<E>, EndpointRequest<E>, unknown>;
