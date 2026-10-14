import "server-only";

// Server-only configuration. None of these may use the NEXT_PUBLIC_ prefix.
function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export const serverEnv = {
  stripeSecretKey: () => required("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: () => required("STRIPE_WEBHOOK_SECRET"),
  // Accept the project URL with or without a trailing "/rest/v1".
  supabaseUrl: () => required("SUPABASE_URL").replace(/\/+$/, "").replace(/\/rest\/v1$/, ""),
  supabaseServiceRoleKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),
  orderTokenSecret: () => required("ORDER_TOKEN_SECRET"),
  calendlyUrl: () => required("CALENDLY_SCHEDULING_URL"),
};
