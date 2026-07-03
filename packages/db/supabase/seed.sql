-- Within: Phase 1 seed data.
-- Counts match VP_DELIVERY_WORK_ORDER.md exactly:
--   5 guided practices, 3 silence presets, 5 inquiry categories, 20 inquiry
--   cards, 20 library quote cards, 10 quotes of the day, 4 public Common
--   Space rooms, 3 Learn series, 5 audio talks.
-- Everything here is published/free so it's actually visible through the
-- public RLS policies for local development and Phase 2 testing.
-- No common_space_presence rows are seeded -- presence/online counts must
-- only ever reflect real rows, never fabricated numbers.

-- ---------------------------------------------------------------------------
-- media_assets (placeholder storage paths -- real uploads come later)
-- ---------------------------------------------------------------------------

insert into media_assets (id, kind, storage_path, public_url, visibility, duration_seconds) values
  ('11111111-1111-1111-1111-000000000001', 'audio', 'seed/practice/morning-stillness.mp3', null, 'free', 600),
  ('11111111-1111-1111-1111-000000000002', 'audio', 'seed/practice/breath-awareness.mp3', null, 'free', 480),
  ('11111111-1111-1111-1111-000000000003', 'audio', 'seed/practice/body-scan-release.mp3', null, 'free', 900),
  ('11111111-1111-1111-1111-000000000004', 'audio', 'seed/practice/loving-kindness.mp3', null, 'free', 720),
  ('11111111-1111-1111-1111-000000000005', 'audio', 'seed/practice/evening-wind-down.mp3', null, 'free', 600),
  ('22222222-2222-2222-2222-000000000001', 'audio', 'seed/audio-talks/on-letting-go.mp3', null, 'free', 1080),
  ('22222222-2222-2222-2222-000000000002', 'audio', 'seed/audio-talks/the-nature-of-awareness.mp3', null, 'free', 1320),
  ('22222222-2222-2222-2222-000000000003', 'audio', 'seed/audio-talks/sitting-with-discomfort.mp3', null, 'free', 960),
  ('22222222-2222-2222-2222-000000000004', 'audio', 'seed/audio-talks/returning-to-the-breath.mp3', null, 'free', 840),
  ('22222222-2222-2222-2222-000000000005', 'audio', 'seed/audio-talks/silence-as-teacher.mp3', null, 'free', 1200);

-- ---------------------------------------------------------------------------
-- practice_sessions (5 guided practices)
-- ---------------------------------------------------------------------------

insert into practice_sessions (title, description, category, meaning, motive, completion_suggestion, audio_asset_id, duration_seconds, status, visibility, sort_order) values
  ('Morning Stillness', 'A gentle start to the day, settling the body before the mind.', 'breath',
    'A short settling practice that gives the day a steady starting point instead of an abrupt one.',
    'Use this when the day feels like it is starting before you have actually arrived in it.',
    'Notice one thing you can carry from this stillness into the next hour.',
    '11111111-1111-1111-1111-000000000001', 600, 'published', 'free', 1),
  ('Breath Awareness', 'A simple return to the breath, again and again.', 'breath',
    'The breath is always available as a place to return attention, no matter what else is happening.',
    'Use this when your thoughts are moving faster than you can follow.',
    'Take one more breath, slower than the rest, before you move on.',
    '11111111-1111-1111-1111-000000000002', 480, 'published', 'free', 2),
  ('Body Scan Release', 'Moving attention through the body, releasing held tension.', 'body',
    'Tension often goes unnoticed until attention is deliberately moved through the body.',
    'Use this when you feel tense but cannot point to why.',
    'Check in with your shoulders and jaw once more before you stand up.',
    '11111111-1111-1111-1111-000000000003', 900, 'published', 'free', 3),
  ('Loving Kindness', 'Extending warmth, first to yourself, then outward.', 'heart',
    'Warmth directed inward first is what makes it possible to extend outward honestly.',
    'Use this when you have been harder on yourself or others than the moment called for.',
    'Bring one person to mind and silently wish them well.',
    '11111111-1111-1111-1111-000000000004', 720, 'published', 'free', 4),
  ('Evening Wind-Down', 'Letting the day settle before rest.', 'sleep',
    'The day does not need to be resolved before rest, only set down.',
    'Use this when the day is over but your mind has not caught up to that yet.',
    'Name one thing from today that you are willing to leave as it is.',
    '11111111-1111-1111-1111-000000000005', 600, 'published', 'free', 5);

-- ---------------------------------------------------------------------------
-- silence_presets (3 silence presets)
-- ---------------------------------------------------------------------------

insert into silence_presets (title, description, duration_seconds, bell_interval_seconds, status, visibility, sort_order) values
  ('Quiet Sit -- 5 Minutes', 'A short, unguided sit.', 300, null, 'published', 'free', 1),
  ('Quiet Sit -- 10 Minutes', 'A steady, unguided sit with a midpoint bell.', 600, 300, 'published', 'free', 2),
  ('Quiet Sit -- 20 Minutes', 'A longer unguided sit for an established practice.', 1200, 600, 'published', 'free', 3);

-- ---------------------------------------------------------------------------
-- inquiry_categories (5) + inquiry_cards (20, 4 per category)
-- ---------------------------------------------------------------------------

insert into inquiry_categories (id, title, description, status, visibility, sort_order) values
  ('55555555-5555-5555-5555-000000000001', 'Who Am I', 'Looking past the roles and labels.', 'published', 'free', 1),
  ('55555555-5555-5555-5555-000000000002', 'Relationships', 'Where you meet others, and where you meet yourself.', 'published', 'free', 2),
  ('55555555-5555-5555-5555-000000000003', 'Fear', 'What fear protects, and what it costs.', 'published', 'free', 3),
  ('55555555-5555-5555-5555-000000000004', 'Purpose', 'What you are moving toward, and why.', 'published', 'free', 4),
  ('55555555-5555-5555-5555-000000000005', 'Presence', 'What is actually here, right now.', 'published', 'free', 5);

insert into inquiry_cards (category_id, prompt, question, answer, explanation, reflection_prompt, mood_relevance, status, visibility, sort_order) values
  ('55555555-5555-5555-5555-000000000001', 'Who would you be without your job title?', 'Who would you be without your job title?',
    'Whatever is left when the title is removed -- not nothing, just unnamed.',
    'Roles are useful descriptions, not the thing being described. Removing one reveals how much identity was borrowed from it.',
    'Sit with the discomfort of not having an answer ready.', array['disconnected', 'uncertain'], 'published', 'free', 1),
  ('55555555-5555-5555-5555-000000000001', 'What part of you has stayed the same your whole life?', 'What part of you has stayed the same your whole life?',
    'Something underneath the changing opinions and roles has likely stayed recognizable to you.',
    'Change is constant on the surface. Looking for what has not changed points toward something steadier than circumstance.',
    'Notice it without needing to name it precisely.', array['uncertain', 'disconnected'], 'published', 'free', 2),
  ('55555555-5555-5555-5555-000000000001', 'Whose voice do you hear when you judge yourself?', 'Whose voice do you hear when you judge yourself?',
    'Often it is borrowed -- a parent, a teacher, an old rival -- repeated long after they stopped saying it.',
    'Self-judgment is rarely original. Noticing whose voice it is can loosen its grip.',
    'Ask whether you would say it to someone else.', array['anxious', 'sad'], 'published', 'free', 3),
  ('55555555-5555-5555-5555-000000000001', 'What are you certain you know about yourself?', 'What are you certain you know about yourself?',
    'Probably less than it feels like, and more provisionally than it sounds.',
    'Certainty about identity is often habit dressed up as fact.',
    'Pick one certainty and ask when you last actually tested it.', array['uncertain'], 'published', 'free', 4),
  ('55555555-5555-5555-5555-000000000002', 'What do you withhold to feel safe?', 'What do you withhold to feel safe?',
    'Usually something true, in exchange for not being seen too clearly.',
    'Withholding can feel protective, but it also keeps connection at a distance.',
    'Notice what you would risk saying if safety were not the priority.', array['anxious', 'lonely'], 'published', 'free', 1),
  ('55555555-5555-5555-5555-000000000002', 'Who in your life asks nothing of you?', 'Who in your life asks nothing of you?',
    'If no one comes to mind, that itself is worth noticing.',
    'Relationships without demands are rare and often the ones that restore you most.',
    'Consider reaching out to them, without needing a reason.', array['lonely', 'tired'], 'published', 'free', 2),
  ('55555555-5555-5555-5555-000000000002', 'What would change if you needed no one to agree with you?', 'What would change if you needed no one to agree with you?',
    'Probably how often you speak, and how plainly.',
    'Needing agreement quietly edits what gets said before it is said.',
    'Say the unedited version once, even just to yourself.', array['anxious', 'disconnected'], 'published', 'free', 3),
  ('55555555-5555-5555-5555-000000000002', 'Where do you perform instead of arrive?', 'Where do you perform instead of arrive?',
    'Often in the relationships where being liked matters most.',
    'Performance and presence can look similar from outside, but only one of them rests.',
    'Pick one relationship and try arriving instead of performing, just once.', array['tired', 'disconnected'], 'published', 'free', 4),
  ('55555555-5555-5555-5555-000000000003', 'What are you avoiding right now?', 'What are you avoiding right now?',
    'Something specific, even if the avoidance itself feels vague.',
    'Naming the avoided thing precisely is often more useful than analyzing the avoidance.',
    'Name it in one sentence, without softening it.', array['anxious', 'overwhelmed'], 'published', 'free', 1),
  ('55555555-5555-5555-5555-000000000003', 'What would you do if you weren''t afraid?', 'What would you do if you weren''t afraid?',
    'Likely something already on your mind, just postponed.',
    'Fear rarely invents new options; it mostly removes the ones already there.',
    'Write the answer down before you talk yourself out of it.', array['anxious', 'uncertain'], 'published', 'free', 2),
  ('55555555-5555-5555-5555-000000000003', 'What does this fear want you to protect?', 'What does this fear want you to protect?',
    'Something that matters to you, even if the fear is exaggerating the threat to it.',
    'Fear is often a distorted form of care. Finding what it is protecting can be more useful than fighting it.',
    'Thank the fear for trying, then ask if the threat is current.', array['anxious', 'restless'], 'published', 'free', 3),
  ('55555555-5555-5555-5555-000000000003', 'When did you last mistake fear for caution?', 'When did you last mistake fear for caution?',
    'Possibly more recently than feels comfortable to admit.',
    'Caution is responsive to the actual situation; fear often runs on an old script.',
    'Check whether the caution updates when the situation changes.', array['anxious', 'uncertain'], 'published', 'free', 4),
  ('55555555-5555-5555-5555-000000000004', 'What would you do if no one were watching?', 'What would you do if no one were watching?',
    'Possibly something quieter and less impressive than your public version.',
    'Audience changes behavior more than most people notice in the moment.',
    'Try doing that thing once, with no one to tell.', array['disconnected', 'restless'], 'published', 'free', 1),
  ('55555555-5555-5555-5555-000000000004', 'What did you want before you learned what was practical?', 'What did you want before you learned what was practical?',
    'Something simpler, from before the cost-benefit calculations started.',
    'Early wants are often more honest, before they got negotiated down.',
    'Ask if any part of that early want is still reachable.', array['stuck', 'tired'], 'published', 'free', 2),
  ('55555555-5555-5555-5555-000000000004', 'What feels worth doing even if it fails?', 'What feels worth doing even if it fails?',
    'Usually something tied to meaning rather than outcome.',
    'Outcome-proof motivation tends to point toward what actually matters to you.',
    'Do a small version of it today, regardless of outcome.', array['tired', 'stuck'], 'published', 'free', 3),
  ('55555555-5555-5555-5555-000000000004', 'What are you building toward, and for whom?', 'What are you building toward, and for whom?',
    'Sometimes the second half of that question changes the first.',
    'Purpose examined alone can look different once the intended audience is named honestly.',
    'Say both halves out loud and notice if they still agree.', array['uncertain', 'tired'], 'published', 'free', 4),
  ('55555555-5555-5555-5555-000000000005', 'What sound is closest to you right now?', 'What sound is closest to you right now?',
    'Whatever it is, it was there before you noticed it.',
    'Sound is a reliable anchor because it requires no effort to access, only attention.',
    'Listen to it for three full breaths before moving on.', array['restless', 'overwhelmed'], 'published', 'free', 1),
  ('55555555-5555-5555-5555-000000000005', 'What does this breath feel like, without naming it?', 'What does this breath feel like, without naming it?',
    'Likely more textured and less uniform than the word "breath" suggests.',
    'Naming an experience can substitute for actually feeling it.',
    'Describe the sensation, not the label.', array['restless', 'anxious'], 'published', 'free', 2),
  ('55555555-5555-5555-5555-000000000005', 'What changes the moment you stop describing it?', 'What changes the moment you stop describing it?',
    'Often very little -- which is itself informative.',
    'Description adds a layer between you and the experience. Removing it can reveal how thin that layer was.',
    'Try observing without narrating for one full minute.', array['overwhelmed', 'restless'], 'published', 'free', 3),
  ('55555555-5555-5555-5555-000000000005', 'What is left when you stop trying to arrive somewhere else?', 'What is left when you stop trying to arrive somewhere else?',
    'Wherever you already are, looked at directly.',
    'Most effort to "arrive" is aimed at some other moment. Stopping that reveals the one actually available.',
    'Stay with this moment for ten more seconds before reading on.', array['restless', 'tired'], 'published', 'free', 4);

-- ---------------------------------------------------------------------------
-- library_items (20 library quote cards)
-- ---------------------------------------------------------------------------

insert into library_items (body, author, meaning, deeper_explanation, related_inquiry_card_id, status, visibility, sort_order) values
  ('Stillness is not the absence of motion, but the absence of struggle with it.', null,
    'Stillness can exist within activity once the struggle against it stops.',
    'This reframes stillness as an internal posture rather than something that requires quiet surroundings.',
    null, 'published', 'free', 1),
  ('You do not need to fix the moment. You need to meet it.', null,
    'Meeting a moment only requires attention, not a solution.',
    'The impulse to fix often adds urgency the moment did not actually have.',
    null, 'published', 'free', 2),
  ('The breath has never once asked permission to continue.', null,
    'Breathing continues on its own, making it a dependable place to return attention.',
    'Because it requires no maintenance, the breath is available as an anchor in almost any state.',
    (select id from inquiry_cards where prompt = 'What does this breath feel like, without naming it?'), 'published', 'free', 3),
  ('What you resist organizes your attention more than what you accept.', null,
    'Resisting an experience can fix attention on it more firmly than accepting it would.',
    'This is a common observation in contemplative practice -- fighting a feeling often amplifies its presence.',
    (select id from inquiry_cards where prompt = 'What are you avoiding right now?'), 'published', 'free', 4),
  ('Silence is not empty. It is full of everything you usually talk over.', null,
    'Quiet reveals what continuous noise or talking usually covers.',
    'Silence is not a void; it surfaces what was already there underneath the noise.',
    null, 'published', 'free', 5),
  ('Every return to the breath is the practice. The wandering was never the failure.', null,
    'The returning, not the staying, is the actual practice.',
    'Wandering attention is expected; the value is in the repeated act of coming back.',
    null, 'published', 'free', 6),
  ('Notice what is steady before you go looking for what is wrong.', null,
    'Looking for what is steady first changes what you notice next.',
    'Attention tends to default to problems; deliberately checking what is fine first balances that.',
    null, 'published', 'free', 7),
  ('Attention is the only thing you actually own.', null,
    'Attention is the one resource entirely within your control.',
    'Circumstances, outcomes, and other people are not yours to own -- where you place attention is.',
    null, 'published', 'free', 8),
  ('The mind narrates. The body simply is.', null,
    'The body registers experience directly, without the layer of interpretation the mind adds.',
    'Returning to bodily sensation can bypass a looping narrative.',
    null, 'published', 'free', 9),
  ('Most urgency is inherited, not actual.', null,
    'Most urgency is a habit of mind rather than a feature of the actual situation.',
    'Checking whether urgency is real or inherited can change how you respond to it.',
    null, 'published', 'free', 10),
  ('You can be uncertain and steady at the same time.', null,
    'Steadiness does not require having an answer.',
    'Uncertainty and groundedness are often treated as opposites, but they can coexist.',
    (select id from inquiry_cards where prompt = 'What are you certain you know about yourself?'), 'published', 'free', 11),
  ('Rest is not earned. It is available now.', null,
    'Rest does not need to be justified by output.',
    'Treating rest as a reward delays it indefinitely; it is available regardless.',
    null, 'published', 'free', 12),
  ('A thought passing through is not the same as a thought you must follow.', null,
    'A thought arising is not an instruction to act on it.',
    'Distinguishing noticing from following is the difference between awareness and rumination.',
    null, 'published', 'free', 13),
  ('Presence has no destination. That is what makes it presence.', null,
    'Presence is not a place you travel to; it has no further destination.',
    'Seeking presence as a future state keeps it just out of reach.',
    (select id from inquiry_cards where prompt = 'What is left when you stop trying to arrive somewhere else?'), 'published', 'free', 14),
  ('The quality of your attention shapes the quality of your day.', null,
    'How you attend to something shapes the experience of it as much as the thing itself.',
    'The same hour can feel rushed or spacious depending on the quality of attention brought to it.',
    null, 'published', 'free', 15),
  ('What softens first is usually the jaw, then the story.', null,
    'Physical tension often loosens before the underlying story does.',
    'The jaw is a common place tension collects; noticing it can be an early signal.',
    null, 'published', 'free', 16),
  ('You are allowed to begin again without explaining the gap.', null,
    'Returning to practice does not require accounting for the time away.',
    'The gap does not need a story; it only needs to end.',
    null, 'published', 'free', 17),
  ('Curiosity is gentler than judgment, and it sees more.', null,
    'Curiosity stays open to what is actually there; judgment narrows it in advance.',
    'A curious question usually reveals more than a judgmental conclusion.',
    (select id from inquiry_cards where prompt = 'Whose voice do you hear when you judge yourself?'), 'published', 'free', 18),
  ('Nothing here requires you to perform calm. Only to notice what is.', null,
    'Calm is not a performance to maintain for an audience.',
    'Performing calm and actually settling are different things, and only one of them costs energy.',
    null, 'published', 'free', 19),
  ('The next breath is always available as a place to stand.', null,
    'The next breath is always there, regardless of what came before it.',
    'It functions as a reliable restart point, available at any moment.',
    null, 'published', 'free', 20);

-- ---------------------------------------------------------------------------
-- quotes (10 quotes of the day)
-- ---------------------------------------------------------------------------

insert into quotes (body, author, status, visibility) values
  ('Begin where you are, not where you meant to be.', null, 'published', 'free'),
  ('One honest breath is worth more than ten distracted hours.', null, 'published', 'free'),
  ('Awareness does not need to understand something to be with it.', null, 'published', 'free'),
  ('The day will ask less of you than your thoughts about the day.', null, 'published', 'free'),
  ('Settling is not giving up. It is arriving.', null, 'published', 'free'),
  ('You are not behind. There is no schedule for stillness.', null, 'published', 'free'),
  ('Let the first response be attention, not assessment.', null, 'published', 'free'),
  ('What you practice in silence shows up in noise.', null, 'published', 'free'),
  ('A quiet mind is not a blank one. It is a spacious one.', null, 'published', 'free'),
  ('Today only asks for this breath.', null, 'published', 'free');

-- ---------------------------------------------------------------------------
-- common_space_rooms (4 public rooms -- no presence rows seeded)
-- ---------------------------------------------------------------------------

insert into common_space_rooms (title, description, room_type, is_public, duration_seconds, purpose, practice_session_id, status, visibility, sort_order) values
  ('Morning Sit', 'A shared quiet space to start the day.', 'silence', true, 600, 'daily anchor', null, 'published', 'free', 1),
  ('Evening Reflection', 'Wind down together at the end of the day.', 'guided_practice', true, 600, 'wind down',
    (select id from practice_sessions where title = 'Evening Wind-Down'), 'published', 'free', 2),
  ('New Members', 'Say hello and get oriented.', 'guided_practice', true, 480, 'onboarding',
    (select id from practice_sessions where title = 'Breath Awareness'), 'published', 'free', 3),
  ('Open Silence', 'No theme, no agenda -- just shared stillness.', 'silence', true, 1200, 'open-ended practice', null, 'published', 'free', 4);

-- ---------------------------------------------------------------------------
-- learn_series (3)
-- ---------------------------------------------------------------------------

insert into learn_series (title, description, status, visibility, sort_order) values
  ('Foundations of Stillness', 'The basics of sitting, breathing, and returning attention.', 'published', 'free', 1),
  ('Working with Difficult Emotions', 'Meeting fear, anger, and grief without being run by them.', 'published', 'free', 2),
  ('The Practice of Inquiry', 'Using direct questions to look past assumption.', 'published', 'free', 3);

-- ---------------------------------------------------------------------------
-- learn_episodes (3 per series -- no recordings uploaded yet, so
-- audio_asset_id stays null and the app shows an honest "not available yet")
-- ---------------------------------------------------------------------------

insert into learn_episodes (series_id, title, audio_asset_id, duration_seconds, episode_number, status, visibility) values
  ((select id from learn_series where title = 'Foundations of Stillness'), 'Taking Your Seat', null, 420, 1, 'published', 'free'),
  ((select id from learn_series where title = 'Foundations of Stillness'), 'Following the Breath', null, 480, 2, 'published', 'free'),
  ((select id from learn_series where title = 'Foundations of Stillness'), 'Beginning Again', null, 480, 3, 'published', 'free'),
  ((select id from learn_series where title = 'Working with Difficult Emotions'), 'Naming What Is Here', null, 540, 1, 'published', 'free'),
  ((select id from learn_series where title = 'Working with Difficult Emotions'), 'Making Room for Fear', null, 600, 2, 'published', 'free'),
  ((select id from learn_series where title = 'Working with Difficult Emotions'), 'Anger Without Armor', null, 540, 3, 'published', 'free'),
  ((select id from learn_series where title = 'The Practice of Inquiry'), 'Asking Without Answering', null, 480, 1, 'published', 'free'),
  ((select id from learn_series where title = 'The Practice of Inquiry'), 'Looking Past the Label', null, 540, 2, 'published', 'free'),
  ((select id from learn_series where title = 'The Practice of Inquiry'), 'Living with a Question', null, 600, 3, 'published', 'free');

-- ---------------------------------------------------------------------------
-- audio_talks (5)
-- ---------------------------------------------------------------------------

insert into audio_talks (title, description, speaker, audio_asset_id, duration_seconds, status, visibility, sort_order) values
  ('On Letting Go', 'What it actually means to release something.', 'Within Teachers', '22222222-2222-2222-2222-000000000001', 1080, 'published', 'free', 1),
  ('The Nature of Awareness', 'Looking at the one who is looking.', 'Within Teachers', '22222222-2222-2222-2222-000000000002', 1320, 'published', 'free', 2),
  ('Sitting with Discomfort', 'Why avoidance costs more than the discomfort itself.', 'Within Teachers', '22222222-2222-2222-2222-000000000003', 960, 'published', 'free', 3),
  ('Returning to the Breath', 'The simplest practice, and why it is enough.', 'Within Teachers', '22222222-2222-2222-2222-000000000004', 840, 'published', 'free', 4),
  ('Silence as Teacher', 'What silence reveals that conversation cannot.', 'Within Teachers', '22222222-2222-2222-2222-000000000005', 1200, 'published', 'free', 5);
