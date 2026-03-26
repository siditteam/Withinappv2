/* ──────────────────────────────────────────
   Within — Wisdom Library Dataset
   ──────────────────────────────────────────
   Quotes from saints and mystics with contemplative
   reflections connected to meditation, inquiry,
   silence, and conscious living.

   To add more reflections, simply add entries to
   the `reflections` array below.
   ────────────────────────────────────────── */

export interface Reflection {
  id: number;
  quote: string;
  author: string;
  tradition: string;
  theme: string;
  reflection: string;
}

export const reflections: Reflection[] = [
  {
    id: 1,
    quote: "What you seek is seeking you.",
    author: "Rumi",
    tradition: "Sufi",
    theme: "Being",
    reflection:
      "This points to a profound reversal of the spiritual search. We spend years looking outward for peace, love, or meaning — yet the very awareness in which that search arises is itself what we long for. In silent meditation, when the seeker relaxes, what remains is a presence that was never absent. The longing itself is the call of being, drawing attention back to its own source. To live with this understanding is to stop grasping and begin recognizing what is already here.",
  },
  {
    id: 2,
    quote: "Silence is the language of God, all else is poor translation.",
    author: "Rumi",
    tradition: "Sufi",
    theme: "Silence",
    reflection:
      "Words can point toward truth, but they cannot contain it. Every description of peace, love, or the divine is a translation that falls short of the direct experience. In silence — not the absence of sound but the absence of mental commentary — something deeper communicates itself. When we sit quietly without agenda, we begin to hear what the mind's noise has been covering. This silence is not empty; it is full, alive, and intimate. It is the original language we all understand before thought intervenes.",
  },
  {
    id: 3,
    quote: "Stop acting so small. You are the universe in ecstatic motion.",
    author: "Rumi",
    tradition: "Sufi",
    theme: "Freedom",
    reflection:
      "We habitually shrink ourselves into stories of limitation — not enough, not ready, not worthy. But inquiry into these beliefs reveals they are just thoughts, not facts. Beneath the contracted self-image lies an awareness that is boundless, creative, and naturally joyful. Meditation is not about becoming something greater; it is about ceasing to pretend we are small. When the mental walls dissolve, even briefly, we taste the vastness that mystics describe — and realize it was never separate from us.",
  },
  {
    id: 4,
    quote: "Where do you search me? I am with you.",
    author: "Kabir",
    tradition: "Bhakti",
    theme: "Presence",
    reflection:
      "Kabir challenges the instinct to seek the sacred elsewhere — in temples, in books, in distant lands. The divine, he says, is not hiding. It is closer than our own breath, present in every moment of ordinary life. When we pause and simply attend to what is here — the sensation of being alive, the awareness behind our eyes — we encounter exactly what we have been searching for. The pilgrimage, it turns out, is not a journey outward but a turning inward to what has always been present.",
  },
  {
    id: 5,
    quote: "The river that flows in you also flows in me.",
    author: "Kabir",
    tradition: "Bhakti",
    theme: "Unity",
    reflection:
      "Separation is the mind's deepest assumption: I am here, you are there, and we are fundamentally apart. But in the stillness of meditation, boundaries soften. We begin to sense that the same aliveness animating this body is the same aliveness in every being. Kabir's river is consciousness itself — undivided, flowing through all forms. To rest in this recognition is to discover compassion not as an effort but as the natural response of one life seeing itself in another.",
  },
  {
    id: 6,
    quote: "The truth is not outside you.",
    author: "Kabir",
    tradition: "Bhakti",
    theme: "Truth",
    reflection:
      "We collect philosophies, read sacred texts, and gather the words of masters — yet truth remains elusive when it is only held as a concept. Kabir redirects us inward: truth is not information to be found but a reality to be experienced. In quiet self-inquiry, when attention turns toward the one who is aware, we touch something that no book can give and no argument can shake. Truth, in this sense, is not a belief. It is the undeniable fact of our own presence, recognized directly.",
  },
  {
    id: 7,
    quote: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    tradition: "Buddhist",
    theme: "Awareness",
    reflection:
      "The world offers temporary comforts but never lasting peace, because outer conditions are always changing. The Buddha points to an unchanging dimension of our experience: awareness itself, which remains still even as thoughts and emotions move through it. When we meditate, we are not creating peace; we are removing the layers of agitation that obscure the peace already present. To live from this understanding is to stop requiring the world to be different before we allow ourselves to be at ease.",
  },
  {
    id: 8,
    quote: "The quieter you become the more you can hear.",
    author: "Buddha",
    tradition: "Buddhist",
    theme: "Silence",
    reflection:
      "Most of our lives are spent in a kind of inner noise — planning, judging, remembering, anticipating. In this constant activity, subtler dimensions of experience go unnoticed. As meditation deepens and the mind settles, a different kind of listening becomes available. We begin to hear the body's quiet intelligence, the heart's gentle signals, and the vast spacious awareness underneath all experience. Silence is not a discipline we impose but a depth we discover when we stop filling every moment with thought.",
  },
  {
    id: 9,
    quote: "What you think you become.",
    author: "Buddha",
    tradition: "Buddhist",
    theme: "Mind",
    reflection:
      "This is both a warning and an invitation. If we unconsciously repeat thoughts of fear, lack, or unworthiness, our entire experience contracts around those patterns. But the same principle works in reverse: when we bring awareness to our thoughts without believing every one of them, their grip loosens. Meditation reveals that we are not our thoughts — we are the awareness in which they arise. From this vantage point, we can consciously choose which seeds to water and which to let pass like clouds.",
  },
  {
    id: 10,
    quote: "Nature does not hurry, yet everything is accomplished.",
    author: "Lao Tzu",
    tradition: "Taoist",
    theme: "Presence",
    reflection:
      "Our minds insist on urgency — faster, more, now. Yet the natural world unfolds without rush: seasons change, rivers carve canyons, seeds become forests, all without effort or anxiety. Lao Tzu invites us to align with this rhythm. In meditation, we practice this directly: we sit without trying to achieve anything, and paradoxically, that is when the deepest shifts occur. In daily life, acting from presence rather than panic reveals that things accomplished in stillness carry a quality that frantic effort cannot match.",
  },
  {
    id: 11,
    quote:
      "Knowing others is intelligence; knowing yourself is true wisdom.",
    author: "Lao Tzu",
    tradition: "Taoist",
    theme: "Self",
    reflection:
      "We invest enormous energy in understanding the external world — people, systems, strategies — and call it intelligence. But Lao Tzu distinguishes this from wisdom, which is the direct knowing of one's own nature. Self-inquiry — asking 'What am I, really?' and sitting with the question — takes us beyond the roles and stories we identify with. What we find is not a fixed personality but an open, aware presence. This knowing is not intellectual; it is intimate, wordless, and transforms how we relate to everything.",
  },
  {
    id: 12,
    quote: "Happiness is your nature.",
    author: "Ramana Maharshi",
    tradition: "Advaita",
    theme: "Being",
    reflection:
      "We chase happiness through accomplishments, relationships, and possessions, assuming it lives somewhere outside us. Ramana Maharshi says the opposite: happiness is what we are, not what we get. Every moment of joy we experience is simply a brief return to our natural state — when desire pauses and the mind rests. Meditation is the practice of resting without reason, discovering that the peace we feel is not caused by circumstances but is the natural fragrance of awareness at ease with itself.",
  },
  {
    id: 13,
    quote: "Ask yourself: Who am I?",
    author: "Ramana Maharshi",
    tradition: "Advaita",
    theme: "Self",
    reflection:
      "This is not a philosophical question but a direct investigation. When Ramana Maharshi says 'Who am I?', he invites us to trace every thought, emotion, and identity back to its source. Who is the one thinking? Who is aware of this body? As we follow the thread inward, the concepts dissolve — and what remains is pure awareness, without name or form. This inquiry is the most intimate practice possible. It does not give us an answer in words; it reveals the one who was asking, and in that recognition, the question dissolves.",
  },
  {
    id: 14,
    quote: "Truth is high, but higher still is truthful living.",
    author: "Guru Nanak",
    tradition: "Sikh",
    theme: "Truth",
    reflection:
      "It is one thing to know the truth intellectually — to read about awareness, compassion, and presence. It is another thing entirely to embody it. Guru Nanak reminds us that realization without lived expression is incomplete. Truthful living means bringing the stillness of meditation into every interaction — speaking honestly, acting with integrity, meeting each moment with an open heart. The highest practice is not what happens on the cushion but how we carry that clarity into the marketplace, the kitchen, and the places where life asks us to be real.",
  },
  {
    id: 15,
    quote: "The One Light pervades all creation.",
    author: "Guru Nanak",
    tradition: "Sikh",
    theme: "Unity",
    reflection:
      "Divisions of race, religion, and nation dominate the surface of human life, but beneath these differences, Guru Nanak sees a single light — consciousness itself — shining through every form. In deep meditation, when the mind becomes still, this unity is not a belief but a direct perception. The same awareness looking through your eyes is looking through all eyes. To live from this recognition is not to ignore diversity but to honor it as the many expressions of one indivisible reality, and to treat every being as sacred.",
  },
  {
    id: 16,
    quote: "The kingdom of God is within you.",
    author: "Jesus",
    tradition: "Christian",
    theme: "Being",
    reflection:
      "With these words, Jesus redirects the spiritual search from heaven to the present moment, from somewhere else to right here inside. The kingdom is not a future reward but a present reality — the living awareness in which all experience unfolds. When we turn attention inward and rest in the felt sense of being, we encounter a depth that organized religion often points toward but seldom stops long enough to enter. This inner kingdom requires no belief. It asks only for attention — sincere, quiet, and willing to discover what is already here.",
  },
  {
    id: 17,
    quote: "Let go or be dragged.",
    author: "Zen Saying",
    tradition: "Zen",
    theme: "Freedom",
    reflection:
      "Resistance to what is — to change, to loss, to uncertainty — creates suffering. The tighter we hold, the more painful the inevitable movement of life becomes. This Zen saying is a compassionate warning: when we refuse to release what has already passed, life does not stop. It drags us. Meditation teaches letting go not as resignation but as trust. Each exhale, each passing thought we don't chase, is a small practice of release. In that open hand, we discover a freedom that the clenched fist could never hold.",
  },
  {
    id: 18,
    quote: "When the mind is still, the whole world reflects.",
    author: "Zen Saying",
    tradition: "Zen",
    theme: "Awareness",
    reflection:
      "A turbulent lake distorts every reflection. A still lake shows the sky, the trees, and the moon with perfect clarity. Our mind works the same way. When it is agitated with thoughts, judgments, and reactions, we see the world through distortion. But when the mind becomes genuinely still — not suppressed, but naturally at rest — reality appears as it is. Colors become vivid, sounds become intimate, and the ordinary world reveals an astonishing beauty that was always present. Stillness is not withdrawal from life; it is the deepest engagement with it.",
  },
];

export const authors = [
  "Rumi",
  "Kabir",
  "Buddha",
  "Lao Tzu",
  "Ramana Maharshi",
  "Guru Nanak",
  "Jesus",
  "Zen Saying",
] as const;

export type AuthorName = (typeof authors)[number];

export const traditions = [
  "Sufi",
  "Bhakti",
  "Buddhist",
  "Taoist",
  "Advaita",
  "Sikh",
  "Christian",
  "Zen",
] as const;

export type TraditionName = (typeof traditions)[number];

export const themes = [
  "Being",
  "Silence",
  "Freedom",
  "Presence",
  "Unity",
  "Truth",
  "Awareness",
  "Mind",
  "Self",
] as const;

export type ThemeName = (typeof themes)[number];

/** Get unique authors */
export function getAuthors(): string[] {
  return [...authors];
}

/** Get unique traditions */
export function getTraditions(): string[] {
  return [...traditions];
}

/** Get unique themes */
export function getThemes(): string[] {
  return [...themes];
}

/** Filter reflections by author, tradition, and/or theme */
export function filterReflections(
  author: string | null,
  tradition: string | null,
  theme: string | null,
): Reflection[] {
  return reflections.filter((r) => {
    if (author && r.author !== author) return false;
    if (tradition && r.tradition !== tradition) return false;
    if (theme && r.theme !== theme) return false;
    return true;
  });
}
