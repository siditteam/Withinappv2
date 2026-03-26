import { createBrowserRouter, redirect } from "react-router";

const AppShell = async () => ({ Component: (await import("../layouts/AppShell")).default });
const Root = async () => ({ Component: (await import("../pages/Root")).default });
const Explore = async () => ({ Component: (await import("../pages/Explore")).default });
const AudioTalkPlayer = async () => ({ Component: (await import("../pages/AudioTalkPlayer")).default });
const AudioSeriesPlayer = async () => ({ Component: (await import("../pages/AudioSeriesPlayer")).default });
const Profile = async () => ({ Component: (await import("../pages/Profile")).default });
const Settings = async () => ({ Component: (await import("../pages/Settings")).default });
const InquiryList = async () => ({ Component: (await import("../pages/inquiry/InquiryList")).default });
const InquiryIntro = async () => ({ Component: (await import("../pages/inquiry/InquiryIntro")).default });
const InquiryGuidance = async () => ({ Component: (await import("../pages/inquiry/InquiryGuidance")).default });
const InquirySession = async () => ({ Component: (await import("../pages/inquiry/InquirySession")).default });
const InquiryComplete = async () => ({ Component: (await import("../pages/inquiry/InquiryComplete")).default });
const InquiryTrekTransition = async () => ({ Component: (await import("../pages/inquiry/InquiryTrekTransition")).default });
const SoulPracticeList = async () => ({ Component: (await import("../pages/soul/SoulPracticeList")).default });
const SoulPracticeDetail = async () => ({ Component: (await import("../pages/soul/SoulPracticeDetail")).default });
const SoulPracticeSession = async () => ({ Component: (await import("../pages/soul/SoulPracticeSession")).default });
const SoulPracticeComplete = async () => ({ Component: (await import("../pages/soul/SoulPracticeComplete")).default });
const SilenceDetail = async () => ({ Component: (await import("../pages/silence/SilenceDetail")).default });
const SilenceSession = async () => ({ Component: (await import("../pages/silence/SilenceSession")).default });
const SilenceComplete = async () => ({ Component: (await import("../pages/silence/SilenceComplete")).default });
const Library = async () => ({ Component: (await import("../pages/library/Library")).default });
const SanghaSpace = async () => ({ Component: (await import("../pages/sangha/SanghaSpace")).default });
const SanghaSession = async () => ({ Component: (await import("../pages/sangha/SanghaSession")).default });
const Learn = async () => ({ Component: (await import("../pages/learn/Learn")).default });
const LearnSeriesDetail = async () => ({ Component: (await import("../pages/learn/LearnSeriesDetail")).default });
const LearnEpisodeReader = async () => ({ Component: (await import("../pages/learn/LearnEpisodeReader")).default });
const InnerCircle = async () => ({ Component: (await import("../pages/innercircle/InnerCircle")).default });
const FeelingSlider = async () => ({ Component: (await import("../components/feeling/FeelingSlider")).default });
const LandingFeelingGate = async () => ({ Component: (await import("../pages/feeling/LandingFeelingGate")).default });
const LoginPage = async () => ({ Component: (await import("../pages/auth/LoginPage")).default });
const AuthCallback = async () => ({ Component: (await import("../pages/auth/AuthCallback")).default });
const LogoutPage = async () => ({ Component: (await import("../pages/auth/LogoutPage")).default });
const RequireAuth = async () => ({ Component: (await import("../components/auth/RequireAuth")).default });

export const router = createBrowserRouter([
  {
    path: "/login",
    lazy: LoginPage,
  },
  {
    path: "/auth/callback",
    lazy: AuthCallback,
  },
  {
    path: "/logout",
    lazy: LogoutPage,
  },
  {
    path: "/",
    lazy: RequireAuth,
    children: [
      {
        lazy: AppShell,
        children: [
          {
            lazy: Root,
            children: [
              { index: true, lazy: LandingFeelingGate },
              { path: "explore", lazy: Explore },
              { path: "explore/audio-talk/:id", lazy: AudioTalkPlayer },
              { path: "explore/audio-series/:id", lazy: AudioSeriesPlayer },
              { path: "explore/:id", loader: () => redirect("/explore") },
              { path: "profile", lazy: Profile },
            ],
          },
          {
            path: "settings",
            lazy: Settings,
          },
          {
            path: "feeling-checkin",
            lazy: FeelingSlider,
          },
          {
            path: "inquiry",
            children: [
              { index: true, lazy: InquiryList },
              { path: ":id", lazy: InquiryIntro },
              { path: ":id/guidance", lazy: InquiryGuidance },
              { path: ":id/session", lazy: InquirySession },
              { path: ":id/complete", lazy: InquiryComplete },
              { path: ":id/trek-transition", lazy: InquiryTrekTransition },
            ],
          },
          {
            path: "soul",
            children: [
              { index: true, lazy: SoulPracticeList },
              { path: ":id", lazy: SoulPracticeDetail },
              { path: ":id/session", lazy: SoulPracticeSession },
              { path: ":id/complete", lazy: SoulPracticeComplete },
            ],
          },
          {
            path: "silence",
            children: [
              { index: true, lazy: SilenceDetail },
              { path: "session", lazy: SilenceSession },
              { path: "complete", lazy: SilenceComplete },
            ],
          },
          {
            path: "library",
            lazy: Library,
          },
          {
            path: "sangha",
            children: [
              { index: true, lazy: SanghaSpace },
              { path: "session", lazy: SanghaSession },
            ],
          },
          {
            path: "learn",
            children: [
              { index: true, lazy: Learn },
              { path: ":id", lazy: LearnSeriesDetail },
              { path: ":id/:episodeId", lazy: LearnEpisodeReader },
            ],
          },
          {
            path: "inner-circle",
            lazy: InnerCircle,
          },
        ],
      },
    ],
  },
]);
