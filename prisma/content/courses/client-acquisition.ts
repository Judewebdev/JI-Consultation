import type { CourseSpec } from "../types";

export const clientAcquisitionCourse: CourseSpec = {
  slug: "client-acquisition-systems",
  title: "Client Acquisition Systems",
  subtitle: "A pipeline that works when you are busy, not just when you are worried",
  description:
    "Most independent practices sell in panic. Work dries up, everyone scrambles, a " +
    "project lands, selling stops, and three months later it happens again. This course " +
    "replaces that cycle with three mechanisms that run every week regardless of how " +
    "busy you are: a defined target list, an outbound rhythm you can sustain, and a " +
    "referral system that does not depend on luck.",
  category: "Sales & marketing",
  level: "INTERMEDIATE",
  priceCents: 29900,
  estimatedHours: 7,
  featured: true,
  welcomeVideoUrl: "https://cdn.jiglobalacademy.com/welcome/client-acquisition.mp4",
  welcomeVideoNote:
    "Three minutes on the feast-and-famine cycle: why it is a scheduling problem rather " +
    "than a marketing problem, and what we are going to build instead.",
  outcomes: [
    "Build a named target list of 100 organisations instead of a vague market",
    "Run a weekly outbound rhythm that survives a busy delivery week",
    "Write outbound messages that get replies without sounding like a template",
    "Turn delivered work into referrals systematically rather than hoping",
    "Track a pipeline honestly, including the deals you are pretending are alive",
    "Know your acquisition numbers well enough to predict next quarter",
  ],
  requirements: [
    "An existing practice or business with at least a few past clients to learn from",
    "Two hours a week you are willing to protect for selling, permanently",
    "A clear positioning statement — take Consulting Practice Foundations first if you do not have one",
  ],
  passMark: 70,

  courseResources: [
    {
      kind: "CHECKLIST",
      title: "The weekly sales hour — run sheet",
      description:
        "What to do in your protected sales time, in order, so the hour is never wasted deciding what to do.",
      sections: [
        {
          heading: "First 15 minutes — housekeeping",
          items: [
            "Update the pipeline: move or kill every opportunity that has not moved in 14 days.",
            "Read last week's replies and clear anything needing a response.",
            "Check pipeline coverage against next quarter's target.",
          ],
        },
        {
          heading: "Next 30 minutes — new conversations",
          items: [
            "Add five new organisations to the target list.",
            "Send five first-contact messages, each referencing something specific about that organisation.",
            "Send follow-ups to anyone at day 5 and day 14 of a sequence.",
          ],
        },
        {
          heading: "Last 15 minutes — warm network",
          items: [
            "Contact two past clients or referrers with something useful, not a request.",
            "Ask for exactly one introduction, naming the person you want to meet.",
            "Write down next week's five targets so the next session starts immediately.",
          ],
        },
      ],
    },
  ],

  modules: [
    {
      title: "The target list",
      summary: "Replacing 'my market' with a hundred named organisations and the people inside them.",
      lessons: [
        {
          slug: "building-the-hundred",
          title: "Building the list of a hundred",
          summary:
            "Why a named list beats a market definition, how to build one in two hours, " +
            "and what to record about each organisation so the list is usable.",
          durationMinutes: 20,
          isPreview: true,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/ca-list.mp4",
          body: `
## "My market" is not a list

You cannot contact a market. You can contact Meridian Logistics, and you can contact
the operations director there by name. The gap between those two things is where most
business development quietly dies.

A hundred named organisations is small enough to build in an afternoon and large
enough to sustain a practice. If your positioning is right, a hundred is plenty.

## What goes on the list

For each organisation, four fields and no more:

- **Organisation** and roughly how big
- **The buyer**, by name and job title
- **The trigger** — the specific reason you think they have the problem now
- **The route in** — cold, warm introduction, event, or existing relationship

If you cannot fill in the trigger, they do not go on the list. A list of companies
who might one day need you is a fantasy; a list of companies with an observable
reason to act is a pipeline.

## Where triggers come from

New leadership in the relevant function. Funding rounds. Expansion into a new market.
Regulatory deadlines. Public complaints about the exact thing you fix. A competitor
of theirs doing something they will have to answer.

These are all visible from outside. Finding them is most of the work, and it is the
work that makes the outreach land.

## The list is a living document

Ten new organisations a week, and remove anything you have contacted three times
with no response. A stale list is worse than a short one because it lets you feel
productive while doing nothing.
          `.trim(),
          keyPoints: [
            "You cannot contact a market — only named organisations and named people.",
            "A hundred well-chosen organisations is enough to sustain an independent practice.",
            "Four fields per row: organisation, buyer by name, trigger, route in.",
            "No observable trigger means no place on the list.",
            "Add ten a week, remove anything contacted three times with no reply.",
          ],
          steps: [
            "Write down your positioning statement at the top of the sheet and refuse to add anything that does not match it.",
            "List every organisation you already know that fits — past clients, past prospects, competitors' clients.",
            "Search for the trigger events that apply in your field and work outwards from each one.",
            "Find the buyer's name and title for each organisation; a row without a name is not finished.",
            "Record the route in, and be honest about which are genuinely warm.",
            "Book a recurring slot to add ten and prune the dead ones.",
          ],
          checklist: [
            "Every row matches my positioning statement, without stretching it.",
            "Every row has a named human being, not a department.",
            "Every row has an observable trigger written in a full sentence.",
            "Every row states the route in honestly.",
            "Dead rows have been removed rather than left to pad the count.",
            "Ten new organisations were added this week.",
          ],
          worksheet: [
            "Which past clients came to you rather than the other way round? What did they have in common?",
            "What events, publicly visible, tend to precede someone needing your help?",
            "Who are the ten organisations you would most like to work with, and what is the trigger for each?",
            "How many of your hundred have a genuinely warm route in? What does that ratio tell you?",
          ],
          prompts: [
            {
              name: "Generate trigger events for your positioning",
              prompt: `My positioning: [YOUR POSITIONING STATEMENT]
The problem I solve: [PROBLEM]
Typical client: [SIZE, SECTOR, GEOGRAPHY]

List 15 observable trigger events that suggest an organisation has this problem *right now* — things visible from outside the company, such as leadership changes, funding, expansion, regulation, public complaints, or competitor moves.

For each trigger: how I would spot it, and the first sentence of an outreach message that references it without being creepy.`,
            },
            {
              name: "Qualify a target list row",
              prompt: `Here is a row from my target list:

Organisation: [NAME, SIZE, SECTOR]
Buyer: [NAME, TITLE]
Trigger: [WHAT I OBSERVED]
Route in: [COLD / WARM / EVENT]

My positioning: [STATEMENT]

Assess: is this a real opportunity or wishful thinking? Is the trigger genuinely a trigger, or am I rationalising? Is this the right buyer, or one level too junior? What would I need to find out before contacting them?`,
            },
          ],
          practice: [
            "Build the first 25 rows of your list in one sitting. Do not stop to research deeply — get the names down, then refine.",
            "Take five rows and find the actual buyer's name and title. Note how long it took; that is your real cost per row.",
          ],
          table: {
            fileLabel: "Target list of 100",
            columns: [
              "Organisation",
              "Size",
              "Sector",
              "Buyer name",
              "Buyer title",
              "Trigger event",
              "Route in",
              "Last contacted",
              "Status",
            ],
            sampleRows: [
              ["Meridian Logistics", "45", "Freight", "A. Boateng", "Operations Director", "New ops director started in March", "Warm — intro via Kofi", "", "To contact"],
              ["Northbridge Foods", "120", "FMCG", "S. Whitfield", "Supply Chain Lead", "Announced expansion into two new regions", "Cold", "", "To contact"],
              ["Attah & Sons", "30", "Distribution", "E. Attah", "Managing Director", "Publicly complained about quoting delays at trade event", "Event — met at ILA conference", "", "In sequence"],
            ],
          },
        },
        {
          slug: "outbound-that-gets-replies",
          title: "Outbound that gets replies",
          summary:
            "The structure of a first-contact message that does not read like a template, " +
            "and the follow-up sequence that does most of the work.",
          durationMinutes: 18,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/ca-outbound.mp4",
          body: `
## Why outbound fails

Three reasons, in order of frequency: it is about you, it is not specific to them,
and it asks for too much on first contact.

A message that opens with what you do, describes your services, and asks for a
thirty-minute call is asking a stranger to spend half an hour on the basis of
nothing. The reply rate is what you would expect.

## The four-sentence message

1. **The trigger.** Something specific and true about *them*. This is the sentence
   that proves you are not sending this to four hundred people.
2. **The consequence.** What that usually creates, in their language. Not a pitch —
   an observation they can agree or disagree with.
3. **The evidence.** One line about a similar situation and what changed. A number,
   if you have one.
4. **A small ask.** Not thirty minutes. "Worth a short conversation?" or "Want me to
   send the one-page version?"

Under 120 words. Longer messages do not get read; they get archived.

## The sequence

One message is a lottery ticket. The sequence is where the results come from:

- **Day 0** — the four-sentence message
- **Day 5** — something useful with no ask attached: a relevant example, a short
  observation about their sector
- **Day 14** — a direct, easy close: "Doesn't look like this is a priority — should
  I close the file?"

That last one gets a startling number of replies, because it is easy to answer and
because it is honest.

## Then stop

Three touches and out. Put them back on the list with a date six months out. Chasing
past three touches damages the relationship you will want later.
          `.trim(),
          keyPoints: [
            "Outbound fails because it is about you, not specific, and asks for too much too soon.",
            "Four sentences: trigger, consequence, evidence, small ask. Under 120 words.",
            "The trigger sentence is what proves the message is not bulk — never skip it.",
            "The sequence is day 0, day 5 (useful, no ask), day 14 (permission to close the file).",
            "Three touches and stop; revisit in six months rather than chasing.",
          ],
          steps: [
            "Start from the trigger you recorded on the target list and write it as one specific sentence.",
            "Write the consequence in the buyer's language, as an observation they could disagree with.",
            "Add one line of evidence from comparable work, with a number if you have one.",
            "End with the smallest reasonable ask, not a meeting request.",
            "Cut the message to under 120 words, removing every sentence about you that is not the evidence line.",
            "Schedule the day-5 and day-14 follow-ups at the moment you send the first message.",
          ],
          checklist: [
            "The first sentence is specific to this organisation and verifiably true.",
            "The message is under 120 words.",
            "There is exactly one line about me, and it contains evidence.",
            "The ask is small enough to say yes to without a calendar.",
            "Follow-ups for day 5 and day 14 are already scheduled.",
            "After three touches, the contact is closed and diarised for six months.",
          ],
          worksheet: [
            "Take an outbound message you have sent. How many sentences were about you rather than them?",
            "What is the most specific true thing you could say about your top target, that they would recognise?",
            "What evidence line do you have with a real number in it? If you have none, which past client could give you one?",
            "What is your smallest reasonable ask — something a stranger could agree to in ten seconds?",
          ],
          prompts: [
            {
              name: "Write a four-sentence outbound message",
              prompt: `Write a cold outreach message using this structure, strictly four sentences and under 120 words:

1. The trigger — specific and true about them
2. The consequence — what that usually creates, in their language
3. The evidence — one comparable result, with a number
4. A small ask — not a meeting

Organisation: [NAME, SIZE, SECTOR]
Buyer: [NAME, TITLE]
Trigger I observed: [SPECIFIC AND VERIFIABLE]
My positioning: [STATEMENT]
Comparable result I can cite: [CLIENT TYPE, WHAT CHANGED, THE NUMBER]

Do not use the words "solutions", "leverage", "reach out" or "circle back". Do not open with my name or my company. Write it as one human to another.`,
            },
            {
              name: "Diagnose why a message got no reply",
              prompt: `This outbound message got no response after three touches:

[PASTE THE FULL SEQUENCE]

Target: [ORGANISATION, BUYER TITLE, TRIGGER]

Tell me honestly which of these it was: it was about me rather than them; the trigger was not specific enough; the ask was too large; the buyer was the wrong person; or the timing was simply wrong. Then rewrite the day-0 message fixing the biggest problem, and say what you changed and why.`,
            },
          ],
          practice: [
            "Write five first-contact messages for five real targets. Time yourself — if each takes more than eight minutes, your triggers are too thin.",
            "Take your best-performing past message and rewrite it to four sentences. Send both versions to different targets and compare.",
          ],
        },
      ],
      quiz: {
        title: "Module 1 check: targets and outbound",
        passMark: 70,
        maxAttempts: 3,
        questions: [
          {
            prompt: "What disqualifies an organisation from your target list?",
            explanation:
              "No observable trigger. Without one you have a company that might one day " +
              "need you, which is a fantasy rather than a pipeline entry.",
            choices: [
              "*You cannot name an observable reason they have the problem now",
              "They are smaller than your average client",
              "You do not have a warm introduction",
              "They have worked with a competitor",
            ],
          },
          {
            prompt: "What are the four sentences of a first-contact message?",
            type: "MULTI",
            explanation:
              "Trigger, consequence, evidence, small ask — under 120 words, with exactly " +
              "one line about you.",
            choices: [
              "*A specific, true trigger about them",
              "*The consequence that usually creates, in their language",
              "*One line of evidence, ideally with a number",
              "*A small ask that does not require a calendar",
            ],
          },
          {
            prompt: "What is the day-14 message in the sequence?",
            explanation:
              "An easy, honest close — 'should I close the file?' It gets replies precisely " +
              "because it is simple to answer and does not pretend.",
            choices: [
              "*A direct offer to close the file if this is not a priority",
              "A longer version of the original pitch",
              "A discount offer",
              "A phone call instead of an email",
            ],
          },
          {
            prompt: "After three touches with no reply, you should keep following up monthly.",
            type: "TRUE_FALSE",
            explanation:
              "Three touches and stop. Diarise for six months — chasing beyond that damages " +
              "a relationship you may want later.",
            choices: ["True", "*False"],
          },
        ],
      },
      assignment: {
        title: "Build your first fifty and send five",
        briefMd: `
Do the work, do not describe it.

1. **Build fifty rows** of your target list, using the template from the lesson. Every
   row needs an organisation, a named buyer with a title, an observable trigger
   written as a full sentence, and an honest route in.
2. **Write five first-contact messages** for five of those rows, following the
   four-sentence structure. Each under 120 words.
3. **Send them.** Then report what happened: how many replies, and what the replies
   said.
4. **One paragraph** on which part was hardest — finding triggers, finding names, or
   writing the messages — and what that tells you about your positioning.

Submissions without the sent messages and the actual response data will be returned.
        `.trim(),
        deliverables: [
          "Fifty completed target list rows with named buyers and written triggers",
          "Five first-contact messages, each under 120 words",
          "The actual outcome: replies received and what they said",
          "A paragraph on which part was hardest and what it reveals",
        ],
        points: 150,
        dueInDays: 14,
      },
    },

    {
      title: "Referrals and the warm network",
      summary: "Turning delivered work into the next engagement, on purpose rather than by luck.",
      lessons: [
        {
          slug: "engineering-referrals",
          title: "Engineering referrals",
          summary:
            "Why 'let me know if you hear of anyone' produces nothing, and the specific ask " +
            "that produces introductions.",
          durationMinutes: 17,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/ca-referrals.mp4",
          body: `
## The ask that fails

"If you hear of anyone who needs this, let me know." Everyone says it. It produces
almost nothing, for a simple reason: you have given the other person a search
problem. They would have to scan their entire network against a vague criterion,
and nobody does that on your behalf.

## The ask that works

Name the person. "You know Sarah at Northbridge — would you be willing to introduce
me?" Now it is a yes/no question with a ten-second answer.

This requires you to do the research first, which is exactly why most people prefer
the vague version.

## Timing

The best moment is at close-out, when the result is fresh and they are pleased. Not
three months later when the memory has faded and the reason for the call is
transparently self-interested.

Ask once, specifically, at close-out. Then leave it.

## Make the introduction easy to make

Send a **forwardable paragraph**: three or four sentences your referrer can paste
into an email without editing. Who you are, what you did for them, what you would
want from the introduction. If they have to compose something, the introduction gets
delayed and then forgotten.

## The wider warm network

Past clients are the obvious source, but the more reliable one is people who sell
something adjacent to the same buyer — the accountant, the recruiter, the systems
integrator. They talk to your buyer weekly and have no conflict with you.

Contact two of them a week with something useful and no ask attached. Over a year
that becomes the most productive channel you have, and it costs twenty minutes.
          `.trim(),
          keyPoints: [
            "'Let me know if you hear of anyone' hands over a search problem, and nobody does that work for you.",
            "Name the specific person you want to meet — it turns a search into a yes/no question.",
            "Ask at close-out, while the result is fresh, and ask once.",
            "Send a forwardable paragraph so the referrer never has to compose anything.",
            "Adjacent suppliers to the same buyer are a more reliable channel than past clients.",
            "Two useful, no-ask contacts a week compounds into your best channel within a year.",
          ],
          steps: [
            "Before close-out, research your client's network and identify one specific person you want to meet.",
            "At close-out, capture the result in the client's own words with permission to use it.",
            "Make one specific, named introduction request.",
            "Send the forwardable paragraph within the hour, while they are still in the conversation.",
            "Log the request and do not repeat it — one ask, then leave it.",
            "Each week, contact two adjacent suppliers with something useful and no ask.",
          ],
          checklist: [
            "I identified a specific named person before the close-out meeting.",
            "The result was captured in the client's words, with permission.",
            "I made exactly one specific introduction request.",
            "The forwardable paragraph was sent the same day.",
            "The request is logged and will not be repeated.",
            "Two adjacent-supplier contacts happened this week.",
          ],
          worksheet: [
            "Which of your past clients would happily introduce you, and who specifically would you want them to introduce you to?",
            "Who sells something adjacent to your buyer? List five names.",
            "How many of your last ten engagements ended with a specific referral request? What stopped you?",
            "Write your forwardable paragraph now. Would you paste it into an email unedited?",
          ],
          prompts: [
            {
              name: "Write a forwardable introduction paragraph",
              prompt: `Write a paragraph my client can forward, unedited, to introduce me to someone.

What I did for this client: [THE WORK AND THE MEASURABLE RESULT]
My positioning: [STATEMENT]
Who I want to be introduced to: [NAME, TITLE, ORGANISATION]
Why they are relevant: [THE TRIGGER]

Three or four sentences maximum, written in my client's voice, not mine. It must be something a busy person would paste without rewriting. No superlatives.`,
            },
            {
              name: "Plan the close-out referral ask",
              prompt: `I am closing out an engagement. Help me plan the referral ask.

Client: [ORGANISATION, WHO I WORKED WITH]
The result: [WHAT CHANGED, WITH NUMBERS]
People in their network I would like to meet: [NAMES AND ORGANISATIONS, IF KNOWN]

Give me: the exact wording of the ask, when in the close-out conversation to make it, and what to do if they say "let me have a think". Keep it natural — I do not want to sound like I have been on a sales course.`,
            },
          ],
          practice: [
            "Pick your best past engagement and write the specific introduction request you should have made. Send it this week — it is not too late.",
            "List five adjacent suppliers to your buyer and contact two of them with something genuinely useful and no ask.",
          ],
        },
        {
          slug: "pipeline-honesty",
          title: "Keeping the pipeline honest",
          summary:
            "Pipelines lie because we want them to. The stage definitions and the kill rule " +
            "that keep yours useful.",
          durationMinutes: 16,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/ca-pipeline.mp4",
          body: `
## The comfortable lie

Every pipeline contains deals that are dead but not yet buried. We keep them because
deleting them makes the total look worse, and the total is how we reassure ourselves.

A pipeline you have flattered is worse than no pipeline, because you act on it.

## Stage definitions that mean something

Each stage must be defined by something the **client** did, never by something you
did or feel:

- **Identified** — on the target list with a trigger. You have done nothing yet.
- **Contacted** — you have sent the sequence. Still nothing from them.
- **Engaged** — *they replied and asked something*. This is the first real stage.
- **Qualified** — a discovery call happened and it passed your four gates.
- **Proposed** — a proposal is with them and they have acknowledged it.
- **Committed** — they have said yes in writing. Not "verbally agreed".

Note that "sent a proposal" is not the same stage as "they acknowledged it". That
distinction alone will clean up most people's forecast.

## The fourteen-day kill rule

Any opportunity that has not moved stage in fourteen days gets one of two things: a
concrete next action with a date, or removal. No third option, no "keeping an eye
on it".

This feels brutal the first time and obvious by the third month.

## Coverage, not count

Twelve opportunities means nothing. What matters is the value of live opportunities
against next quarter's target — and you want at least 3x, because most of them will
not close. Below 3x, the decision is not "improve the pipeline", it is "sell this
week".
          `.trim(),
          keyPoints: [
            "Pipelines get flattered because the total is how we reassure ourselves — and then we act on it.",
            "Define every stage by something the client did, never by something you did.",
            "'Proposal sent' and 'proposal acknowledged' are different stages, and the distinction fixes most forecasts.",
            "Fourteen days without movement: concrete next action with a date, or remove it.",
            "Coverage against target matters; the number of opportunities does not.",
            "Below 3x coverage the response is selling this week, not planning to sell.",
          ],
          steps: [
            "Write your stage definitions in terms of observable client actions only.",
            "Move every current opportunity to the stage its evidence actually supports.",
            "Delete or revive everything that has not moved in fourteen days.",
            "Total the value of what remains and divide by next quarter's target.",
            "If coverage is below 3x, book sales time this week rather than next.",
            "Review the whole pipeline in the first fifteen minutes of your weekly sales hour.",
          ],
          checklist: [
            "Every stage is defined by a client action, not by my activity.",
            "Every opportunity sits at the stage its evidence supports.",
            "Nothing in the pipeline has been static for more than fourteen days.",
            "Every live opportunity has a next action with a date on it.",
            "I know my coverage multiple for next quarter.",
            "The pipeline review happened this week.",
          ],
          worksheet: [
            "Go through your pipeline now. Which opportunities are you keeping because deleting them feels bad?",
            "What is your honest coverage multiple for next quarter?",
            "How long, on average, between first contact and signature in your last five wins?",
            "Which stage do your opportunities most often die at, and what does that tell you to fix?",
          ],
          prompts: [
            {
              name: "Audit a pipeline for wishful thinking",
              prompt: `Here is my current pipeline. For each opportunity: organisation, value, stage, date of last client action, and what that action was.

[PASTE PIPELINE]

Next quarter's target: [NUMBER]

For each: is it at the right stage based on client action alone, or have I flattered it? Which should be killed under a fourteen-day rule? Then give me my real coverage multiple using only opportunities where the client has done something in the last two weeks, and tell me plainly whether next quarter is in trouble.`,
            },
          ],
          practice: [
            "Kill three opportunities from your pipeline today. Notice the resistance, then do it anyway.",
            "Recalculate coverage using only opportunities where the client acted in the last 14 days. Compare that to your comfortable number.",
          ],
          table: {
            fileLabel: "Pipeline tracker",
            columns: [
              "Organisation",
              "Value",
              "Stage",
              "Last client action",
              "Date of that action",
              "Days since",
              "Next action",
              "Next action date",
            ],
            sampleRows: [
              ["Meridian Logistics", "38000", "Proposed", "Acknowledged proposal, asked about timing", "2026-07-28", "6", "Call to confirm start date", "2026-08-06"],
              ["Northbridge Foods", "62000", "Engaged", "Replied asking for an example", "2026-07-19", "15", "KILL or set discovery call", "2026-08-05"],
              ["Attah & Sons", "16000", "Qualified", "Discovery call held", "2026-08-01", "2", "Send three-option proposal", "2026-08-07"],
            ],
          },
        },
      ],
      quiz: {
        title: "Module 2 check: referrals and pipeline",
        passMark: 70,
        maxAttempts: 3,
        questions: [
          {
            prompt: "Why does 'let me know if you hear of anyone' rarely produce referrals?",
            explanation:
              "It hands the other person a search problem across their whole network. " +
              "Naming a specific person turns it into a ten-second yes/no.",
            choices: [
              "*It asks them to search their whole network against a vague criterion",
              "It is asked too early in the relationship",
              "Clients do not like giving referrals",
              "It should be asked by email rather than in person",
            ],
          },
          {
            prompt: "Which stage definitions are correct?",
            type: "MULTI",
            explanation:
              "Stages must be defined by client actions. 'Engaged' begins when they reply; " +
              "'Committed' requires a written yes, not a verbal one.",
            choices: [
              "*Engaged — the client replied and asked something",
              "*Qualified — a discovery call happened and passed your gates",
              "*Committed — they have said yes in writing",
              "Engaged — you have sent three follow-ups",
            ],
          },
          {
            prompt: "An opportunity has not moved stage in fourteen days. What are the options?",
            explanation:
              "A concrete next action with a date, or removal. 'Keeping an eye on it' is how " +
              "pipelines fill with dead deals.",
            choices: [
              "*Give it a concrete next action with a date, or remove it",
              "Keep an eye on it and review next month",
              "Reduce its value by 50% and leave it in",
              "Move it to a nurture list indefinitely",
            ],
          },
          {
            prompt: "What is the minimum healthy pipeline coverage against next quarter's target?",
            explanation:
              "About 3x, because most opportunities will not close. Below that, the response " +
              "is selling this week rather than planning to.",
            choices: ["*Around 3x", "1x", "1.5x", "10x"],
          },
        ],
      },
      assignment: {
        title: "Rebuild your pipeline honestly and make three asks",
        briefMd: `
**1. Rebuild the pipeline.** Rewrite your stage definitions in terms of client actions
only. Re-stage every live opportunity against them. Apply the fourteen-day rule and
report how many opportunities you killed and what value that removed.

**2. Calculate real coverage** for next quarter, using only opportunities where the
client has acted in the last fourteen days. State the multiple. If it is below 3x,
state what you are doing about it this week.

**3. Make three referral asks.** Specific, named, with the forwardable paragraph sent
the same day. Report what happened — including the ones that got no response.

The honesty in part 1 is the whole point. A submission where nothing was killed will
be returned with questions.
        `.trim(),
        deliverables: [
          "Stage definitions written in terms of client actions",
          "A re-staged pipeline, with the count and value of what you killed",
          "Your real coverage multiple, and this week's action if it is under 3x",
          "Three specific referral asks made, with the forwardable paragraph and the outcomes",
        ],
        points: 150,
        dueInDays: 14,
      },
    },
  ],

  finalQuiz: {
    title: "Client Acquisition Systems — final assessment",
    description: "Five questions across targeting, outbound, referrals and pipeline discipline.",
    passMark: 75,
    timeLimitMinutes: 15,
    maxAttempts: 3,
    questions: [
      {
        prompt: "What must every row of the target list contain before it counts as finished?",
        explanation:
          "Organisation, a named buyer with a title, an observable trigger written out, and " +
          "an honest route in. A department instead of a name is not finished.",
        choices: [
          "*Organisation, named buyer with title, an observable trigger, and the route in",
          "Organisation, sector and estimated budget",
          "Organisation and a general contact email",
          "Organisation, revenue and headcount",
        ],
      },
      {
        prompt: "Which of these are reasons outbound fails?",
        type: "MULTI",
        explanation:
          "Being about you, being generic, and asking for too much on first contact — in " +
          "that order of frequency.",
        choices: [
          "*The message is about you rather than them",
          "*It is not specific to that organisation",
          "*The first ask is too large",
          "It was sent on the wrong day of the week",
        ],
      },
      {
        prompt: "When is the best moment to ask for a referral?",
        explanation:
          "At close-out, while the result is fresh and the client is pleased — and ask once, " +
          "naming the specific person.",
        choices: [
          "*At engagement close-out, once, naming a specific person",
          "Three months after the engagement ends",
          "In the proposal, as a condition",
          "At the start of the engagement",
        ],
      },
      {
        prompt: "Your pipeline shows 14 opportunities worth 400,000 against a quarterly target of 90,000. What else must you know before calling this healthy?",
        explanation:
          "Whether the client has acted recently on each. Coverage calculated on stale " +
          "opportunities is the comfortable lie the lesson is about.",
        choices: [
          "*Whether the client has taken an action on each one in the last fourteen days",
          "The average deal size",
          "How long each has been in the pipeline",
          "Which sector each is in",
        ],
      },
      {
        prompt: "A verbal 'yes, we're going ahead' from a client moves an opportunity to Committed.",
        type: "TRUE_FALSE",
        explanation:
          "Committed requires a written yes. Verbal agreement is a strong signal, not a " +
          "stage change — and treating it as one is how forecasts break.",
        choices: ["True", "*False"],
      },
    ],
  },

  capstone: {
    title: "Capstone: your acquisition system on two pages",
    briefMd: `
Produce the system you will actually run, in two pages.

**Page one — the mechanics.**
- Your target list: how many rows now, how many you add weekly, your pruning rule
- Your weekly sales hour: the exact day and time, and the run sheet for it
- Your outbound sequence: the four-sentence template and the day 0/5/14 cadence
- Your referral process: when you ask, the wording, the forwardable paragraph

**Page two — the numbers.**
- Current pipeline coverage, honestly calculated
- Your conversion rates at each stage, from real data where you have it
- How many first contacts a week you need to hit next quarter's target, worked
  backwards from those rates
- The one number you will check every Monday

Then a short closing paragraph: **what breaks this system.** Be specific about the
week where you will be too busy, and what the system does on that week.
    `.trim(),
    deliverables: [
      "A one-page acquisition mechanics document covering list, weekly hour, outbound and referrals",
      "A one-page numbers page with coverage, conversion rates and required weekly contact volume",
      "The single number you check every Monday",
      "A paragraph on what breaks the system and how it survives a busy week",
    ],
    points: 200,
    dueInDays: 21,
  },
};
