import "server-only";
import Stripe from "stripe";
import { serverEnv } from "./env";

let client: Stripe | null = null;

export function stripe() {
  client ??= new Stripe(serverEnv.stripeSecretKey(), { apiVersion: "2026-07-29.dahlia" });
  return client;
}
