// 모바일 디바이스 체크
export const isMobile = () => {
  return /Mobi/i.test(window.navigator.userAgent);
};

// 모바일 수준의 레이아웃 체크
export const isMobileLayout = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth <= 620;
  }
  return false;
};
