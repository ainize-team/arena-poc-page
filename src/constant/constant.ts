export const PUBLIC_ENV = {
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  MINIMUM_VOTE: process.env.NEXT_PUBLIC_MINIMUM_VOTE,
  CAPTCHA_APP_KEY: process.env.NEXT_PUBLIC_CAPTCHA_APP_KEY,
}

export const ZERO_REWARD_MSG = "NO TX FOR 0 REWARD";

export const JS_PYTHON_TIMESTAMP_GAP = 1000;

export const getGAId = () => {
  return PUBLIC_ENV.APP_ENV === "production" ? "G-TFVPRQGF0M" : "G-WHKH2Q8EJY"
};
