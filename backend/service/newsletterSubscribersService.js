const newsletterRepository = require("../repository/newsletterSubscribersRepository");

// SUBSCRIBE
const subscribe = async (email) => {
  if (!email) {
    const err = new Error("Email is required");
    err.statusCode = 400;
    throw err;
  }

  const existing = await newsletterRepository.findByEmail(email);

  if (existing) {
    if (existing.is_active) {
      return {
        message: "Already subscribed to the Newsletter.",
        data: existing,
      };
    }

    // reativar
    const updated = await newsletterRepository.reactivate(email);
    return {
      message: "Subscription reactivated",
      data: updated,
    };
  }

  const created = await newsletterRepository.subscribe(email);

  return {
    message: "Subscribed successfully to the Newsletter!",
    data: created,
  };
};

// UNSUBSCRIBE
const unsubscribe = async (email) => {
  if (!email) {
    const err = new Error("Email is required");
    err.statusCode = 400;
    throw err;
  }

  const existing = await newsletterRepository.findByEmail(email);

  if (!existing || !existing.is_active) {
    const err = new Error("Email not subscribed to the Newsletter.");
    err.statusCode = 404;
    throw err;
  }

  const updated = await newsletterRepository.unsubscribe(email);

  return {
    message: "Unsubscribed successfully from the Newsletter.",
    data: updated,
  };
};

module.exports = {
  subscribe,
  unsubscribe,
};
