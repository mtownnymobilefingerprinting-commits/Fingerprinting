// Customer-facing terms shown before payment. Only published facts belong here.
export const policies = {
  pricingSummary: "$125 per person within 20 miles of Middletown, NY.",
  travelAndTax:
    "Addresses more than 20 miles from Middletown, NY include a travel fee. A 4% tax is added. You will see the exact total before you pay.",
  payFirstNotice:
    "Payment is required before choosing your appointment time. After successful payment, you'll be able to select your date and time.",
  // OWNER DECISION NEEDED: no cancellation/refund policy has been published.
  // Set this to the approved wording to display it before payment.
  cancellation: null as string | null,
  // OWNER DECISION NEEDED: confirm what the $125 includes (e.g. number of cards).
  inclusions: null as string[] | null,
};
