import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "../../public/fonts/PretendardVariable.woff2",
      weight: "400 700", // Adjust based on actual variable font capabilities or individual files
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

