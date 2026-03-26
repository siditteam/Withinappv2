import { useState } from "react";
import { useNavigate } from "react-router";
import DailyPractice from "../DailyPractice";
import FeelingSlider from "./FeelingSlider";

export default function LandingFeelingGate() {
  const navigate = useNavigate();
  const [showSlider, setShowSlider] = useState(true);

  if (!showSlider) {
    return <DailyPractice />;
  }

  return (
    <FeelingSlider
      showBackButton={false}
      cancelLabel="Skip for now"
      onCancel={() => setShowSlider(false)}
      onComplete={(zone) => {
        navigate(zone.routePath, {
          state: {
            feeling: zone.label,
            category: zone.routeCategory,
          },
        });
      }}
    />
  );
}
