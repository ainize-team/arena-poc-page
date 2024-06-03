export const ZERO_REWARD_MSG = "NO TX FOR 0 REWARD";

export const getGAId = () => {
  return process.env.NODE_ENV === "production" ? "G-TFVPRQGF0M" : "G-WHKH2Q8EJY"
};