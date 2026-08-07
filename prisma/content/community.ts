import type { ThreadCategory } from "../../src/lib/enums";

/**
 * Seed conversations. A community that opens empty stays empty, so the seed
 * plants threads that model the behaviour we want: specific questions, real
 * numbers, and answers that disagree with each other.
 *
 * `author` and `replies[].author` are indexes into the seeded people list
 * (see prisma/seed.ts). `courseSlug` scopes a thread to a course; omit it for
 * the academy-wide space.
 */

export type ThreadSeed = {
  title: string;
  category: ThreadCategory;
  body: string;
  author: number;
  courseSlug?: string;
  pinned?: boolean;
  /** Hours before "now" that the thread was opened. */
  ageHours: number;
  replies: Array<{ author: number; body: string; ageHours: number }>;
};

export const communitySeeds: ThreadSeed[] = [
  {
    title: "Start here — how this community works",
    category: "GENERAL",
    author: 0,
    pinned: true,
    ageHours: 24 * 40,
    body: `
Welcome. Three things worth knowing before you post.

**Ask specific questions.** "How do I get more clients?" cannot be answered. Use the four-line shape from the orientation course: context, what you tried, what happened, one question.

**Share work you are unsure about.** The feedback on a rough draft is worth far more than applause for a finished one. Nobody here is grading you.

**Answer more than you ask.** Explaining something to someone who has not understood it yet is the fastest way to find out whether you have.

One rule: no pitching. If someone asks for a recommendation and you happen to sell that thing, say so in the same sentence.
    `.trim(),
    replies: [
      {
        author: 3,
        ageHours: 24 * 39,
        body: "Joined last week and the four-line format genuinely works. Asked something vague in another group and got nothing for a fortnight; asked here properly and had three useful replies by the next morning.",
      },
    ],
  },

  {
    title: "Narrowed my positioning and immediately panicked",
    category: "QUESTION",
    author: 2,
    courseSlug: "consulting-practice-foundations",
    ageHours: 30,
    body: `
Context: solo consultant, six years, mostly operations work for manufacturing firms between 30 and 150 staff. Revenue last year was about £140k across nine clients.

What I tried: did the Module 1 exercise properly and landed on "I help mid-sized food manufacturers pass BRC audits without stopping production". That is genuinely where my best results are — four clients, all passed first time.

What happened: I have spent three days not publishing it. It excludes roughly 60% of what I did last year. My pipeline is not full enough to be throwing work away.

Question: did anyone else narrow while the pipeline was thin, and what actually happened to revenue in the following two quarters?
    `.trim(),
    replies: [
      {
        author: 4,
        ageHours: 27,
        body: `Did exactly this eighteen months ago, and yes, it was uncomfortable.

What actually happened: Q1 revenue dropped about 15% because I turned down two things I would previously have taken. Q2 was the best quarter I had had, because for the first time people were referring me with a sentence instead of a paragraph.

The thing nobody told me: narrowing your **positioning** does not mean refusing all other work on day one. It means what you say publicly, what you go after deliberately, and what you build evidence around. I still took two adjacent projects that year. I just stopped chasing them.`,
      },
      {
        author: 1,
        ageHours: 24,
        body: `Adding to that — the 60% you think you are excluding is not 60% of future revenue. Look at where it actually came from. In my case the "excluded" work was almost entirely one-off referrals from a network that was drying up anyway.

Worth doing before you panic: take last year's nine clients, and mark which ones came from a repeatable source versus a lucky introduction. That number is usually what tells you whether narrowing is risky or overdue.`,
      },
      {
        author: 2,
        ageHours: 6,
        body: "Did that exercise this morning. Seven of the nine were one-off introductions from two people, one of whom has retired. That is a fairly clear answer. Publishing the positioning today.",
      },
    ],
  },

  {
    title: "Killed 40% of my pipeline and I feel much better",
    category: "WIN",
    author: 4,
    courseSlug: "client-acquisition-systems",
    ageHours: 52,
    body: `
Applied the fourteen-day rule properly for the first time. Went in with 19 "live" opportunities worth about £310k. Came out with 11 worth £180k.

The interesting part: of the eight I killed, six had had no client action since **May**. I had been counting them in my coverage number for three months. My real coverage was 2.0x, not 3.4x, which explains why the last two quarters felt worse than my spreadsheet said they should.

Three of the eight I emailed with the day-14 "should I close the file?" line. Two replied within an hour. One of them is now a discovery call on Thursday. So the honest version of the pipeline also generated a live opportunity, which was not what I expected.
    `.trim(),
    replies: [
      {
        author: 3,
        ageHours: 48,
        body: "The 'no client action since May' thing is what gets me. I have just checked mine and I have four opportunities where the last actual contact was them saying 'let's pick this up after summer'. That was not a next step, it was a polite no, and I recorded it as momentum.",
      },
      {
        author: 1,
        ageHours: 44,
        body: "This is the single most useful thing in that module. The trick that made it stick for me was changing the column heading from 'last contact' to 'last client action'. I could no longer count my own follow-ups as activity, which is what I had been doing without noticing.",
      },
    ],
  },

  {
    title: "Time audit came back 80% judgement-heavy — is that a real result?",
    category: "QUESTION",
    author: 3,
    courseSlug: "ai-operations-for-small-teams",
    ageHours: 20,
    body: `
Context: eight-person agency, mostly client delivery work.

What I tried: ran the three-day audit exactly as described. Everyone logged, nobody skipped days.

What happened: about 80% of logged blocks came back marked as needing judgement. Only 12% were clearly mechanical, which is nowhere near the 30–50% the lesson suggests.

Question: is my team marking things as judgement-heavy because it feels better to say so, or do some teams genuinely not have much mechanical work?
    `.trim(),
    replies: [
      {
        author: 0,
        ageHours: 18,
        body: `Both happen, and there is a quick way to tell which one you have.

Take twenty of the blocks marked judgement-heavy and ask the person: "what was the rule you applied?" If they can answer in a sentence, it was judgement-light and they mislabelled it — usually not deliberately, it just feels like thinking at the time. If they genuinely cannot articulate a rule, it was judgement.

In practice most teams that come back at 80% land nearer 45% after that second pass. Agencies do skew higher than average though, so 60% would not surprise me for you.`,
      },
      {
        author: 4,
        ageHours: 11,
        body: "Also worth checking how you phrased it to the team. I asked mine 'did this need judgement?' the first time and got a very flattering result. Second time I asked 'could you write down the rule you used?' and the picture changed completely.",
      },
      {
        author: 3,
        ageHours: 3,
        body: "Ran the second pass on twenty blocks this morning. Fourteen of them had a rule the person could state in one sentence. So: 80% was wrong, and I now have a much more useful list. Thanks both.",
      },
    ],
  },

  {
    title: "Three-option pricing: the middle option keeps losing to the cheap one",
    category: "QUESTION",
    author: 1,
    courseSlug: "consulting-practice-foundations",
    ageHours: 96,
    body: `
Context: independent, systems and process work, engagements usually £8k–£30k.

What I tried: switched to three options on my last five proposals, as taught.

What happened: four of the five took the narrow option. The lesson says most clients take the middle one, so I assume I am doing something wrong rather than that the lesson is wrong.

Question: is this a pricing gap problem or a scoping problem?
    `.trim(),
    replies: [
      {
        author: 0,
        ageHours: 92,
        body: `Almost always a scoping problem, and usually the same one: the narrow option solves the whole problem.

If option one already gets them what they asked for, the middle option is an upsell, and people do not buy upsells from a document. The narrow option should solve the **immediate symptom** they described. The middle one solves it and stops it recurring — which is the thing they actually want but did not articulate.

Post the three options from your last proposal (redact the client) and it will probably be visible in ten seconds.`,
      },
      {
        author: 1,
        ageHours: 90,
        body: `Narrow: map the order process and deliver recommendations (£9k).
Recommended: the above, plus implement the changes with their team (£24k).
Comprehensive: the above, plus three months of support and a dashboard (£41k).`,
      },
      {
        author: 0,
        ageHours: 88,
        body: `There it is. Your narrow option is a complete deliverable — they get a report they can act on themselves, and plenty of clients will convince themselves they will.

Try: narrow = map the process and identify the three highest-cost failures, no recommendations (£6k). Recommended = the full piece with implementation (£24k). Comprehensive = as you have it.

Now option one is genuinely partial. It is honest — it is a real thing some clients want — but nobody who actually intends to fix the problem stops there.`,
      },
      {
        author: 2,
        ageHours: 40,
        body: "Watching this thread with interest because I have the same pattern. The 'narrow option should solve the symptom, not the problem' line is the bit I was missing entirely.",
      },
    ],
  },

  {
    title: "Introduce yourself here",
    category: "INTRO",
    author: 0,
    pinned: true,
    ageHours: 24 * 38,
    body: "Three sentences: who you are, what your business does, and the 90-day outcome you wrote in the orientation assignment. Resist the biography — nobody reads the long ones and the short ones get replies.",
    replies: [
      {
        author: 2,
        ageHours: 24 * 12,
        body: "Ama, operations consultant working mostly with food manufacturers in the Midlands. Six years solo, nine clients last year. In 90 days I want three live opportunities that came from a published positioning rather than a personal introduction.",
      },
      {
        author: 3,
        ageHours: 24 * 9,
        body: "Tunde, I run an eight-person agency in Lagos doing delivery work for logistics clients. We are drowning in coordination overhead. In 90 days I want ten hours a week back across the team, measured rather than assumed.",
      },
      {
        author: 4,
        ageHours: 24 * 5,
        body: "Priya, independent consultant, supply chain, mostly UK and UAE. Revenue is fine but it is 55% one client, which I have been ignoring for a year. In 90 days I want that under 35% without losing the client.",
      },
    ],
  },

  {
    title: "Forwardable intro paragraph — before and after",
    category: "RESOURCE",
    author: 4,
    courseSlug: "client-acquisition-systems",
    ageHours: 64,
    body: `
Sharing this because the difference in response rate was larger than I expected.

**Before** (what I used to send):

> Hi — would you be able to introduce me to anyone in your network who might benefit from supply chain consulting? Happy to have a chat with anyone you think is relevant.

Result over roughly a year: two introductions, both lukewarm.

**After** (the forwardable version, written in the client's voice):

> Priya worked with us for four months on our inbound process — she cut our average receipt-to-shelf time from 9 days to 3 and did it without adding headcount. She is looking to talk to one or two more distributors dealing with the same problem, and I thought of you. Worth a short call?

Result: five sent, four introductions made, three calls held, one proposal out.

The bit that mattered was writing it so the referrer does not have to compose anything. Every previous version made them do the work.
    `.trim(),
    replies: [
      {
        author: 1,
        ageHours: 60,
        body: "The number in the second one is doing a lot of work. Mine has always been qualitative and I have never questioned why the introductions were vague.",
      },
      {
        author: 3,
        ageHours: 12,
        body: "Stealing the structure. Result, then the specific ask, then an easy yes/no. Three sentences and no adjectives.",
      },
    ],
  },
];
