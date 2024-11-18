import Stripe from "stripe";

const stripe = new Stripe("sk_test_51QLXIjP5BZIXEFPC0xUCgLZruUIilcJAZ2W4LnGlGnHw9mcdWFmz0XmfOQDzxHlHbXv2MTrun4sYdrtakERq99NI00ihW9VjwD", {
  apiVersion: "2022-11-15",
});

export default stripe;
