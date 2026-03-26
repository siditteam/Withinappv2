export interface SoulPractice {
  id: number;
  title: string;
  essence: string;
  instruction: string;
  description: string;
  color: string;
}

export const soulPractices: SoulPractice[] = [
  {
    id: 1,
    title: "Witness",
    essence: "Life happens. Awareness remains.",
    instruction: "Witness all that is happening.",
    description:
      "This practice invites you to step back into the seat of awareness.\n\nYou are not trying to change anything. You are not trying to feel differently.\n\nSimply notice everything that appears — sounds, sensations, thoughts, feelings — without following any of it.\n\nThe witness does not participate. It simply sees.",
    color: "#3D5A80",
  },
  {
    id: 2,
    title: "Breathing",
    essence: "Life breathes without effort.",
    instruction: "Notice the breath breathing itself.",
    description:
      "This practice draws attention to the breath — not to control it, but to observe it.\n\nBreathing happens on its own. It has never needed your supervision.\n\nNotice the inhale arriving. Notice the exhale leaving.\n\nLet the breath breathe you.",
    color: "#5B8A72",
  },
  {
    id: 3,
    title: "Boredom",
    essence: "When nothing is avoided, something opens.",
    instruction: "Stay with boredom without moving away.",
    description:
      "This practice uses boredom as a doorway.\n\nWhen the mind has nothing to hold onto, it may resist. It may look for stimulation or escape.\n\nInstead of following that impulse, stay. Remain with the emptiness.\n\nWhat opens when nothing is avoided?",
    color: "#7A6F9B",
  },
  {
    id: 4,
    title: "Flame",
    essence: "What is felt deeply begins to shape you.",
    instruction: "Feel what is present without naming it.",
    description:
      "This practice asks you to feel — not think, not analyze.\n\nThere is always something present beneath the surface of thought. A quality of aliveness, a subtle energy.\n\nBring attention to that felt sense. Let it exist without a label.\n\nWhat is deeply felt begins to transform on its own.",
    color: "#8B7355",
  },
  {
    id: 5,
    title: "Origin of Thought",
    essence: "Thought has a source before language.",
    instruction: "Notice the moment before a thought forms.",
    description:
      "This practice investigates the birth of thought.\n\nBefore a thought becomes words, there is a subtle movement — a stirring in consciousness.\n\nWatch carefully for that moment. The gap between silence and the first syllable.\n\nWhat exists before thought arrives?",
    color: "#6B8E9E",
  },
  {
    id: 6,
    title: "Watching the Watcher",
    essence: "Awareness can notice itself.",
    instruction: "Turn attention toward attention itself.",
    description:
      "This practice turns awareness back on itself.\n\nYou are always aware of something. But can awareness notice itself?\n\nInstead of looking at thoughts, sensations, or objects — look at the one who is looking.\n\nWhat happens when attention meets itself?",
    color: "#3D5A80",
  },
  {
    id: 7,
    title: "Blood Flow Watch",
    essence: "Life moves without instruction.",
    instruction: "Feel the movement of life within the body.",
    description:
      "This practice connects you to the body's silent intelligence.\n\nRight now, blood is flowing. Cells are regenerating. The heart is beating.\n\nNone of this requires your thought or effort.\n\nBring attention to this living movement. Feel life sustaining itself within you.",
    color: "#5B8A72",
  },
  {
    id: 8,
    title: "Fixing the Truth Within",
    essence: "Some truths are realized, not answered.",
    instruction: "Let what you already know settle deeper.",
    description:
      "This practice is about allowing truth to anchor.\n\nSome things you already know — not intellectually, but deeply. Truths that have been glimpsed but not yet absorbed.\n\nSit with what you already sense to be true. Let it settle into the body.\n\nTruth does not need to be argued. It needs to be lived.",
    color: "#7A6F9B",
  },
  {
    id: 9,
    title: "Distance Between A and B",
    essence: "Freedom lives in the gap.",
    instruction: "Rest in the space between two moments.",
    description:
      "This practice brings attention to the gap.\n\nBetween one thought and the next, there is space. Between one breath and the next, there is stillness.\n\nThat gap is not empty — it is alive, open, and free.\n\nRest in the space between. Stay in the distance that separates one moment from another.",
    color: "#8B7355",
  },
  {
    id: 10,
    title: "Nothing",
    essence: "When nothing is held, everything settles.",
    instruction: "Hold nothing. Allow everything.",
    description:
      "This practice is the simplest and the most profound.\n\nDo nothing. Hold nothing. Seek nothing.\n\nLet everything that appears — thoughts, feelings, sensations — come and go on its own.\n\nWhen nothing is held, the mind settles naturally into its own depth.",
    color: "#6B8E9E",
  },
];

export const universalGuidance = [
  "Get comfortable in any position",
  "Breathe normally — no special technique",
  "Thoughts are normal and expected",
  "There is no goal to achieve",
  "You can pause anytime",
  "Short sessions are enough",
];

export const durationOptions = [
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
];
