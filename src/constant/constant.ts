export const PUBLIC_ENV = {
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  MINIMUM_VOTE: process.env.NEXT_PUBLIC_MINIMUM_VOTE,
  CAPTCHA_APP_KEY: process.env.NEXT_PUBLIC_CAPTCHA_APP_KEY,
};

export const getInsightURL = () => {
  return PUBLIC_ENV.APP_ENV === "production"
    ? "https://insight.ainetwork.ai"
    : "https://testnet-insight.ainetwork.ai";
};

export const getGAId = () => {
  return PUBLIC_ENV.APP_ENV === "production" ? "G-TFVPRQGF0M" : "G-WHKH2Q8EJY";
};

export const parseUserExp = (
  userTier: number = 0,
  userExp: number = 0,
): number => {
  //   - Tier 0~5까지
  //     - 처음 시작하면 Tier 0 - 0점 (보상 X)
  //     - Tier 0에서 질문 20점 이상 → Tier 1
  //     - Tier 1에서 질문 50점 이상 → Tier 2
  //     - Tier 2에서 질문 80점 이상 → Tier 3
  //     - Tier 3에서 질문 150점 이상 → Tier 4
  //     - Tier 4에서 질문 230점 이상 → Tier 5
  // - 보상 체계
  //     - Tier 0 (보상 X)
  //     - Tier 1: 평균 보상 10원
  //     - Tier 2: 평균 보상 20원
  //     - Tier 3: 평균 보상 30원
  //     - Tier 4 : 평균 보상 40원
  //     - Tier 5 : 평균 보상 50원

  let parsedExp = 0;

  switch (userTier) {
    case 1:
      parsedExp = userExp / 50;
      break;
    case 2:
      parsedExp = userExp / 80;
      break;
    case 3:
      parsedExp = userExp / 150;
      break;
    case 4:
      parsedExp = userExp / 230;
      break;
    case 5:
      parsedExp = 1;
      break;
    default:
      parsedExp = userExp / 20;
      break;
  }

  return Math.max(parsedExp, 0);
};

export const formatAddress = (address: string = "") => {
  if (address.length <= 9) {
    return address;
  }

  const prefix = address.slice(0, 5);
  const suffix = address.slice(-4);

  return `${prefix}...${suffix}`;
};

export const processNumber = (num: number) => {
  // 1. 소수점 6자리에서 올림 처리
  let roundedToSixDecimal = Math.ceil(num * 1e6) / 1e6;
  // 2. 소수점 첫째자리에서 버림
  let truncatedToOneDecimal = Math.floor(roundedToSixDecimal * 10) / 10;
  // 3. 정수라면 정수로 반환, 그렇지 않으면 소수점 첫째자리까지 반환
  return truncatedToOneDecimal % 1 === 0
    ? Math.floor(truncatedToOneDecimal)
    : truncatedToOneDecimal;
};

export const rewardPerTier = (tier: number) => {
  switch (tier) {
    case 0:
      return "Rewards are not given at Tier 0";
    case 1:
      return "Average reward 10 credits";
    case 2:
      return "1.5x Tier 1 reward";
    case 3:
      return "2x Tier 1 reward";
    case 4:
      return "2.5x Tier 1 reward";
    case 5:
      return "3x Tier 1 reward";
    default:
      return "";
  }
};

export const isDesktopBrowser = () => {
  const userAgent = window.navigator.userAgent;

  // 모바일 및 태블릿 기기 확인 (iOS, Android, iPad, 기타 모바일 및 태블릿 기기)
  const isMobileOrTablet = /Mobi|Android|Tablet|iPad|iPhone/i.test(userAgent);

  // 브라우저 환경 확인
  const isBrowser =
    typeof window !== "undefined" && typeof window.navigator !== "undefined";

  // 데스크탑 웹 브라우저가 아닌 경우 false 반환
  if (!isBrowser || isMobileOrTablet) {
    return false;
  }

  // 데스크탑 웹 브라우저일 경우 true 반환
  return true;
};
