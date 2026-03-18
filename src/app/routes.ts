import { createBrowserRouter, redirect } from "react-router";
import AppShell from "./components/AppShell";
import Root from "./components/Root";
import DailyPractice from "./components/DailyPractice";
import Explore from "./components/Explore";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import InquiryList from "./components/inquiry/InquiryList";
import InquiryIntro from "./components/inquiry/InquiryIntro";
import InquiryGuidance from "./components/inquiry/InquiryGuidance";
import InquirySession from "./components/inquiry/InquirySession";
import InquiryComplete from "./components/inquiry/InquiryComplete";
import InquiryTrekTransition from "./components/inquiry/InquiryTrekTransition";
import SoulPracticeList from "./components/soul/SoulPracticeList";
import SoulPracticeDetail from "./components/soul/SoulPracticeDetail";
import SoulPracticeSession from "./components/soul/SoulPracticeSession";
import SoulPracticeComplete from "./components/soul/SoulPracticeComplete";
import SilenceDetail from "./components/silence/SilenceDetail";
import SilenceSession from "./components/silence/SilenceSession";
import SilenceComplete from "./components/silence/SilenceComplete";
import Library from "./components/library/Library";
import SanghaSpace from "./components/sangha/SanghaSpace";
import SanghaSession from "./components/sangha/SanghaSession";
import Learn from "./components/learn/Learn";
import LearnSeriesDetail from "./components/learn/LearnSeriesDetail";
import InnerCircle from "./components/innercircle/InnerCircle";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppShell,
    children: [
      {
        Component: Root,
        children: [
          { index: true, Component: DailyPractice },
          { path: "explore", Component: Explore },
          { path: "explore/:id", loader: () => redirect("/explore") },
          { path: "profile", Component: Profile },
        ],
      },
      {
        path: "settings",
        Component: Settings,
      },
      {
        path: "inquiry",
        children: [
          { index: true, Component: InquiryList },
          { path: ":id", Component: InquiryIntro },
          { path: ":id/guidance", Component: InquiryGuidance },
          { path: ":id/session", Component: InquirySession },
          { path: ":id/complete", Component: InquiryComplete },
          { path: ":id/trek-transition", Component: InquiryTrekTransition },
        ],
      },
      {
        path: "soul",
        children: [
          { index: true, Component: SoulPracticeList },
          { path: ":id", Component: SoulPracticeDetail },
          { path: ":id/session", Component: SoulPracticeSession },
          { path: ":id/complete", Component: SoulPracticeComplete },
        ],
      },
      {
        path: "silence",
        children: [
          { index: true, Component: SilenceDetail },
          { path: "session", Component: SilenceSession },
          { path: "complete", Component: SilenceComplete },
        ],
      },
      {
        path: "library",
        Component: Library,
      },
      {
        path: "sangha",
        children: [
          { index: true, Component: SanghaSpace },
          { path: "session", Component: SanghaSession },
        ],
      },
      {
        path: "learn",
        children: [
          { index: true, Component: Learn },
          { path: ":id", Component: LearnSeriesDetail },
        ],
      },
      {
        path: "inner-circle",
        Component: InnerCircle,
      },
    ],
  },
]);
