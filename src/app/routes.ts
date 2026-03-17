import { createBrowserRouter } from "react-router";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: DailyPractice },
      { path: "explore", Component: Explore },
      { path: "profile", Component: Profile },
    ],
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/inquiry",
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
    path: "/soul",
    children: [
      { index: true, Component: SoulPracticeList },
      { path: ":id", Component: SoulPracticeDetail },
      { path: ":id/session", Component: SoulPracticeSession },
      { path: ":id/complete", Component: SoulPracticeComplete },
    ],
  },
  {
    path: "/silence",
    children: [
      { index: true, Component: SilenceDetail },
      { path: "session", Component: SilenceSession },
      { path: "complete", Component: SilenceComplete },
    ],
  },
  {
    path: "/library",
    Component: Library,
  },
]);