export interface Inquiry {
  id: number;
  name: string;
  essence: string;
  instruction: string;
  description: string;
  color: string;
}

export const inquiries: Inquiry[] = [
  {
    id: 1,
    name: "Identity",
    essence: "Investigating the sense of self",
    instruction: "Ask yourself: Who am I?",
    description:
      "This inquiry invites you to look directly at the sense of self.\n\nRather than answering intellectually, simply observe what appears when the question is asked.\n\nInquiry is not about finding the correct answer.\n\nIt is about noticing what reveals itself within awareness.",
    color: "#3D5A80",
  },
  {
    id: 2,
    name: "Letting Go",
    essence: "Seeing what is not essential",
    instruction: "Ask yourself: What am I not?",
    description:
      "This inquiry asks you to observe what you are not.\n\nNotice the thoughts, sensations, and experiences that appear and disappear.\n\nIf something changes, can it be what you truly are?\n\nSimply observe without conclusion.",
    color: "#5B8A72",
  },
  {
    id: 3,
    name: "What Remains",
    essence: "Looking beyond temporary experience",
    instruction: "Ask yourself: If this ends, what remains?",
    description:
      "This inquiry points to what is unchanging.\n\nImagine everything you experience ending — thoughts, sensations, perceptions.\n\nWhat remains when all experience ceases?\n\nSimply notice what is always present.",
    color: "#7A6F9B",
  },
  {
    id: 4,
    name: "The Observer",
    essence: "Exploring the source of awareness",
    instruction: "Ask yourself: Where is the one watching from?",
    description:
      "This inquiry investigates the sense of a location of awareness.\n\nLook for the one who is watching your experience.\n\nWhere does awareness seem to be located?\n\nSimply observe what is found.",
    color: "#8B7355",
  },
  {
    id: 5,
    name: "Separation",
    essence: "Questioning the boundary between self and world",
    instruction: "Ask yourself: Am I separate?",
    description:
      "This inquiry questions the boundary between self and experience.\n\nLook for the line that divides you from your experience.\n\nIs there a separation between awareness and what appears in it?\n\nSimply notice what is revealed.",
    color: "#6B8E9E",
  },
  {
    id: 6,
    name: "The Doer",
    essence: "Observing action without a controller",
    instruction: "Ask yourself: Is there a doer?",
    description:
      "This inquiry looks for the one who acts.\n\nWhen an action happens, who is doing it?\n\nCan you find the doer separate from the doing?\n\nSimply observe without trying to answer.",
    color: "#3D5A80",
  },
  {
    id: 7,
    name: "Thought",
    essence: "Seeing thoughts as appearances",
    instruction: "Ask yourself: What is a thought?",
    description:
      "This inquiry investigates the nature of thinking.\n\nNotice a thought arising in awareness.\n\nWhat is its substance? Where does it come from?\n\nSimply observe thoughts without believing them.",
    color: "#5B8A72",
  },
  {
    id: 8,
    name: "The Constant",
    essence: "Discovering what remains stable",
    instruction: "Ask yourself: What never changes?",
    description:
      "This inquiry points to the unchanging background.\n\nNotice everything that changes — thoughts, feelings, sensations.\n\nWhat is it that never changes?\n\nSimply rest in what remains constant.",
    color: "#7A6F9B",
  },
  {
    id: 9,
    name: "Awareness",
    essence: "Questioning ownership of awareness",
    instruction: "Ask yourself: Is awareness personal?",
    description:
      "This inquiry questions the ownership of awareness.\n\nDoes awareness belong to you, or do you appear in awareness?\n\nIs there a personal quality to pure knowing?\n\nSimply observe what is noticed.",
    color: "#8B7355",
  },
  {
    id: 10,
    name: "The One Within",
    essence: "Resting in the deepest presence",
    instruction: "Ask yourself: What is the one within?",
    description:
      "This inquiry looks for the innermost presence.\n\nLook for what feels most intimately 'you'.\n\nWhat is the one that knows all experience?\n\nSimply rest in this looking.",
    color: "#6B8E9E",
  },
];

export const inquiryGuidance = [
  "There are no right or wrong answers",
  "Simply observe what appears within you",
  "Let all thoughts and feelings be welcome",
  "Inquiry is about noticing, not solving",
  "Stay relaxed and open",
  "Short sessions are enough",
];

export const durationOptions = [
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
];