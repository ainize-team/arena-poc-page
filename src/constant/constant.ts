export const PUBLIC_ENV = {
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  MINIMUM_VOTE: process.env.NEXT_PUBLIC_MINIMUM_VOTE,
  CAPTCHA_APP_KEY: process.env.NEXT_PUBLIC_CAPTCHA_APP_KEY,
};

export const getGAId = () => {
  return PUBLIC_ENV.APP_ENV === "production" ? "G-TFVPRQGF0M" : "G-WHKH2Q8EJY";
};

export const parseUserExp = (
  userTier: number = 0,
  userExp: number = 0,
): number => {
  let parsedExp = 0;

  switch (userTier) {
    case 1:
      parsedExp = userExp / 50;
    case 2:
      parsedExp = userExp / 80;
    case 3:
      parsedExp = userExp / 150;
    case 4:
      parsedExp = userExp / 230;
    case 5:
      parsedExp = 1;
    default:
      parsedExp = userExp / 20;
  }

  return parsedExp;
};
