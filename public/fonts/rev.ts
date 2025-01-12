import localFont from "next/font/local";

export const RevolutionGothicFont = localFont({
  src: [
    {
      path: "./RevolutionGothic_ExtraBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./RevolutionGothic_ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./RevolutionGothic_Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./RevolutionGothic_Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
});
