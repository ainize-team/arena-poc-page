// 모바일 디바이스 체크
export const isMobile = () => {
  return /Mobi/i.test(window.navigator.userAgent);
};

// 다크모드 여부 체크
export const isDarkMode = () => {
  const theme = localStorage.getItem("theme");
  return theme === "dark";
};

// 모바일 수준의 레이아웃 체크
export const isMobileLayout = () => {
  if (typeof window !== "undefined") {
    console.log("isMobileLayout");
    return window.innerWidth <= 620;
  }
  return false;
};
