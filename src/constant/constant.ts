export const env = {
  APP_ENV: process.env.APP_ENV,
  SERVER_URL: process.env.SERVER_URL,
  NEXT_PUBLIC_MINIMUM_VOTE: process.env.NEXT_PUBLIC_MINIMUM_VOTE,
  CAPTCHA_SECRET_KEY: process.env.CAPCHA_SECRET_KEY,
  CAPTCHA_APP_KEY: process.env.NEXT_PUBLIC_CAPTCHA_APP_KEY
}

export const getGAId = () => {
  return process.env.APP_ENV === "production" ? "G-TFVPRQGF0M" : "G-WHKH2Q8EJY"
};