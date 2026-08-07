import type { CourseSpec } from "../types";

export const consultingFoundationsCourse: CourseSpec = {
  slug: "consulting-practice-foundations",
  title: "Consulting Practice Foundations",
  subtitle: "Positioning, pricing and delivery for an independent practice that pays properly",
  description:
    "The course for people who are good at the work and losing money on the business " +
    "around it. You will narrow your positioning until it is uncomfortable, replace " +
    "day rates with priced outcomes, write proposals that close without discounting, " +
    "and build a delivery system that does not depend on you remembering everything. " +
    "Every module ends with work applied to your own practice.",
  category: "Consulting",
  level: "BEGINNER",
  priceCents: 24900,
  estimatedHours: 9,
  featured: true,
  welcomeVideoUrl: "https://cdn.jiglobalacademy.com/welcome/consulting-foundations.mp4",
  welcomeVideoNote:
    "Four minutes on why most independent consultants are underpaid: not because their " +
    "work is weak, but because they sell time to anyone who asks. Here is what we change.",
  outcomes: [
    "State who you are for and who you are not for, in one sentence, without hedging",
    "Price on the value of the outcome instead of the hours it takes you",
    "Write a proposal that closes without a discount conversation",
    "Run a discovery call that qualifies out the wrong clients early",
    "Deliver through a repeatable system rather than heroics",
    "Know your practice's real numbers: utilisation, effective rate and pipeline coverage",
  ],
  requirements: [
    "You are consulting already, or about to start — this is not a 'should I?' course",
    "Access to your own numbers: last 12 months of revenue and roughly where it came from",
    "Willingness to turn work down; the whole course depends on it",
  ],
  passMark: 70,

  courseResources: [
    {
      kind: "SOP",
      title: "Practice operating manual — master index",
      description:
        "The full set of SOPs from this course, indexed, so you can hand the system to someone else.",
      sections: [
        {
          heading: "Sales",
          items: [
            "Positioning statement and qualification criteria (Module 1)",
            "Discovery call script and scoring sheet (Module 1)",
            "Pricing model and the three-option proposal (Module 2)",
            "Proposal template and follow-up cadence (Module 2)",
          ],
        },
        {
          heading: "Delivery",
          items: [
            "Engagement kick-off agenda and expectations document (Module 3)",
            "Weekly client update format (Module 3)",
            "Scope-change procedure — the only thing standing between you and unpaid work (Module 3)",
            "Engagement close-out and case study capture (Module 3)",
          ],
        },
        {
          heading: "Numbers to review monthly",
          items: [
            "Effective hourly rate across all live engagements",
            "Utilisation: billable days as a share of available days",
            "Pipeline coverage: value of live opportunities against the next quarter's target",
            "Concentration: share of revenue from the largest client",
          ],
        },
      ],
    },
  ],

  modules: [
    {
      title: "Positioning and qualification",
      summary:
        "Deciding who you are for. Everything downstream — pricing, proposals, marketing — " +
        "gets easier or harder based on this one decision.",
      lessons: [
        {
          slug: "narrowing-until-it-hurts",
          title: "Narrowing until it is uncomfortable",
          summary:
            "Why generalist positioning is expensive, and how to choose a narrow position " +
            "without feeling like you are turning off the tap.",
          durationMinutes: 22,
          isPreview: true,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/cf-positioning.mp4",
          body: `
## The cost of being available for anything

When you can help anyone, three things happen, all of them expensive:

1. **You compete on price**, because there is nothing else to compare you on.
2. **Your marketing says nothing**, because it has to be true for everyone.
3. **Referrals dry up**, because nobody can describe you in a sentence they would
   repeat.

The last one is the killer. Referrals come from people being able to say "talk to
her, she does X for Y". If your answer to "what do you do?" needs a paragraph, you
are relying on your own effort for every lead you get.

## What narrow actually means

Narrow is not "small". Narrow is **specific about the buyer and the problem**:

- Too broad: "operations consulting for SMEs"
- Narrow: "I help 20–60 person logistics firms cut order-to-invoice time"

The second one is a smaller market and a much bigger business, because the buyer
recognises themselves and there is nobody else saying it.

## Choosing your position

You are looking for the overlap of three things:

- **Where you have evidence.** Work you have actually done, with results.
- **Where the pain is expensive.** The problem costs real money, quantifiably.
- **Where buyers are reachable.** You can name the association, the conference, the
  ten people worth knowing.

If a candidate position fails any of the three, it is a hobby, not a position.

## The discomfort test

A good position makes you slightly nervous, because it visibly excludes work you
could have taken. That nervousness is the signal that you have actually chosen
something. If your position feels comfortable, you have not narrowed — you have
rephrased.
          `.trim(),
          keyPoints: [
            "Generalist positioning forces price competition, empty marketing and dead referrals.",
            "Narrow means specific about buyer and problem — not simply a smaller market.",
            "A viable position needs evidence, expensive pain, and reachable buyers. Two out of three is a hobby.",
            "If the position does not make you slightly nervous, you have rephrased rather than chosen.",
            "The test of a position is whether a referrer can repeat it in one sentence.",
          ],
          steps: [
            "List every engagement from the last two years with the client type, the problem and the result.",
            "Group them and find the two or three clusters where you have genuine evidence.",
            "For each cluster, quantify what the problem costs the buyer per year — if you cannot, it is not expensive enough.",
            "For each cluster, name where those buyers gather: associations, events, publications, ten specific people.",
            "Score the clusters against evidence, expense and reachability, and pick the highest — not the most comfortable.",
            "Write the position as one sentence: 'I help [buyer] [achieve outcome] by [approach]', and say it out loud to someone.",
          ],
          checklist: [
            "My position names a specific buyer, not a size band or a sector alone.",
            "My position names a problem the buyer already knows they have.",
            "I can quantify what that problem costs the buyer annually.",
            "I can name ten specific organisations that match my position.",
            "A referrer could repeat my position in one sentence, correctly.",
            "The position excludes work I could have taken, and that makes me slightly uncomfortable.",
          ],
          worksheet: [
            "List your last ten engagements. What did the client have in common, honestly?",
            "Which cluster of work produced your best results, and which produced your best margin? Are they the same?",
            "For your strongest cluster: what does this problem cost that buyer per year, in their currency?",
            "Name ten organisations that fit your candidate position. If you cannot get to ten, what does that tell you?",
            "Write your position sentence. Now cut it to fifteen words.",
            "What work does this position exclude, and what is the annual revenue you are giving up?",
          ],
          prompts: [
            {
              name: "Find the pattern in your past work",
              prompt: `I am an independent consultant trying to narrow my positioning. Here are my last ten engagements:

[FOR EACH: CLIENT TYPE, SIZE, THE PROBLEM, WHAT I DID, THE RESULT, THE FEE]

Analyse these and tell me:
1. What clusters do you see — by buyer type, by problem, by outcome?
2. Which cluster has the strongest evidence behind it?
3. Which had the best fee relative to effort?
4. Where do those two disagree, and what does that suggest?

Be blunt. Do not tell me all of them are viable.`,
            },
            {
              name: "Pressure-test a positioning statement",
              prompt: `Here is my positioning statement: [YOUR STATEMENT]

My evidence for it: [PAST RESULTS]
Where I think these buyers gather: [ASSOCIATIONS, EVENTS, PUBLICATIONS]

Critique it against three tests:
1. Would a referrer be able to repeat this correctly in one sentence?
2. Does it name a problem the buyer already knows they have, in their own words?
3. Does it exclude anything? If it excludes nothing, say so plainly.

Then rewrite it three ways, each narrower than the last, and tell me what each version gives up.`,
            },
          ],
          practice: [
            "Say your position out loud to someone who does not know your work, then ask them to repeat it back. Note exactly where they got it wrong.",
            "Write down three types of work your new position excludes. Put a revenue number next to each. Sit with the total for a minute.",
            "Find five of your ten named target organisations on LinkedIn and identify who the actual buyer would be by job title.",
          ],
          table: {
            fileLabel: "Positioning evidence log",
            columns: [
              "Client",
              "Sector",
              "Size",
              "Problem solved",
              "Measurable result",
              "Fee",
              "Days",
              "Effective day rate",
            ],
            sampleRows: [
              ["Meridian Logistics", "Freight", "45 staff", "Order-to-invoice took 19 days", "Cut to 6 days", "18000", "22", "818"],
              ["Northbridge Foods", "FMCG", "120 staff", "No demand forecast", "Stockouts down 40%", "26000", "40", "650"],
              ["Attah & Sons", "Distribution", "30 staff", "Owner doing all quoting", "Quoting handed to ops lead", "9000", "12", "750"],
            ],
          },
        },
        {
          slug: "qualifying-and-saying-no",
          title: "Qualification: getting to 'no' faster",
          summary:
            "A discovery call is a qualification call. How to structure it so the wrong " +
            "clients disqualify themselves in twenty minutes rather than three months.",
          durationMinutes: 20,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/cf-qualification.mp4",
          body: `
## The most expensive thing in a small practice

Not marketing. Not software. **Time spent on opportunities that were never going to
close**, and worse, time spent delivering to clients who should have been declined.

A bad-fit engagement costs you twice: the margin you lose on it, and the good
engagement you could not take because you were busy.

## Discovery is qualification

Reframe the first call. You are not there to be chosen; you are there to decide
whether this is work you want. That reframe changes your questions and, noticeably,
changes how the buyer treats you.

## The four things you must establish

1. **Is the problem the one you solve?** Not adjacent to it. The one.
2. **Is it expensive enough?** If the problem costs them less than your fee, there
   is no deal and there should not be one.
3. **Are you talking to someone who can decide?** Or to someone who will need to
   sell it internally — in which case your job is to arm them.
4. **Is there a reason to act now?** No deadline, no decision. A live problem with
   no date attached is a conversation, not an opportunity.

## Disqualify out loud

When one of the four fails, say so on the call: "Based on what you've described, I
don't think I'm the right person for this — here's who I would talk to." You lose
nothing, because it was never going to close, and you gain a referrer for life.

## The scoring sheet

Score every call on the four criteria immediately afterwards, before your memory
softens it. Anything scoring below the threshold does not get a proposal. Not "gets
a shorter proposal" — does not get one.
          `.trim(),
          keyPoints: [
            "Bad-fit work costs twice: the lost margin, and the good work you could not take.",
            "Discovery is qualification — you are deciding, not auditioning.",
            "Four gates: right problem, expensive enough, real decision-maker, a reason to act now.",
            "Disqualify out loud and refer on; you lose nothing and gain a referrer.",
            "Score the call immediately, and refuse to write proposals for calls that fail.",
          ],
          steps: [
            "Open by stating what you do and who you do it for, so the buyer can self-select in the first minute.",
            "Ask what changed recently that made this a problem now — this is the compelling-event question.",
            "Quantify the cost of the problem with them, in their numbers, out loud on the call.",
            "Establish who signs, and what happens between your proposal and that signature.",
            "State clearly whether you think this is a fit, on the call, either way.",
            "Score the opportunity against the four gates within ten minutes of hanging up.",
          ],
          checklist: [
            "I stated who I work with in the first two minutes.",
            "I know what changed recently to make this urgent.",
            "We quantified the cost of the problem together, in their numbers.",
            "I know who signs and what the internal process is.",
            "I said out loud whether this is a fit.",
            "I scored the call before doing anything else.",
          ],
          worksheet: [
            "Think of the worst engagement you have taken in the last two years. Which of the four gates did it fail?",
            "What would it have cost you to decline it, and what did it actually cost you to take it?",
            "What is your minimum engagement size, as a number? Why that number?",
            "Which question do you routinely avoid asking on a first call, and what are you afraid the answer will be?",
          ],
          prompts: [
            {
              name: "Score a discovery call",
              prompt: `Here are my notes from a discovery call:

[PASTE YOUR NOTES]

My positioning: [YOUR POSITIONING STATEMENT]
My minimum engagement size: [NUMBER]

Score this opportunity out of 5 on each of these, and justify each score in one line:
1. Is the problem the one I actually solve?
2. Is the problem expensive enough to justify my fee?
3. Am I talking to someone who can decide?
4. Is there a real reason to act now?

Then tell me plainly: proposal, or decline? If decline, draft two sentences I can send.`,
            },
            {
              name: "Generate the questions I am avoiding",
              prompt: `I am a consultant working in [YOUR FIELD]. My positioning: [STATEMENT].

Here is my current discovery call structure: [YOUR QUESTIONS]

Identify the uncomfortable questions I am not asking — specifically about budget, decision authority, urgency, and whether the buyer has already decided on someone else. For each one, give me the exact wording that makes it easy to ask and hard to dodge.`,
            },
          ],
          practice: [
            "Take your last three lost opportunities and score them retrospectively against the four gates. How many should never have had a proposal?",
            "Write and rehearse your disqualification sentence until you can say it without apologising.",
          ],
        },
      ],
      quiz: {
        title: "Module 1 check: positioning and qualification",
        passMark: 70,
        maxAttempts: 3,
        questions: [
          {
            prompt: "Why does generalist positioning reduce referrals?",
            explanation:
              "Referrals depend on someone being able to describe you in a repeatable " +
              "sentence. A paragraph does not get repeated.",
            choices: [
              "*Because nobody can describe you in a single sentence they would repeat",
              "Because generalists charge less",
              "Because referrers prefer specialists on principle",
              "Because generalists have smaller networks",
            ],
          },
          {
            prompt: "Which three tests must a candidate position pass?",
            type: "MULTI",
            explanation:
              "Evidence, expensive pain and reachable buyers. Missing any one makes it " +
              "unviable rather than merely difficult.",
            choices: [
              "*You have evidence — work you have actually done, with results",
              "*The problem is expensive enough to quantify",
              "*The buyers are reachable and nameable",
              "The market is growing faster than 10% a year",
            ],
          },
          {
            prompt: "On a discovery call, what should happen when an opportunity fails one of the four gates?",
            explanation:
              "Say it on the call and refer on. The deal was not going to close, and an " +
              "honest decline earns you a referrer.",
            choices: [
              "*Say so on the call and refer them elsewhere",
              "Send a smaller proposal to test interest",
              "Follow up in three months",
              "Discount to compensate for the poor fit",
            ],
          },
          {
            prompt: "A good positioning statement should feel comfortable to say.",
            type: "TRUE_FALSE",
            explanation:
              "A real position visibly excludes work you could have taken, which is mildly " +
              "uncomfortable. Comfort usually means you rephrased instead of choosing.",
            choices: ["True", "*False"],
          },
        ],
      },
      assignment: {
        title: "Your positioning statement and qualification gates",
        briefMd: `
Produce two things you will use every week from now on.

**1. Your positioning statement.** One sentence, under twenty words, in the form
"I help [specific buyer] [achieve specific outcome]". It must exclude work you could
otherwise take — name what it excludes in a second line.

**2. Your qualification gates.** Write your four gates as concrete, checkable
criteria for your practice specifically:
- The problem you solve, stated so an opportunity either matches or does not
- Your minimum engagement size, as a number
- Who counts as a decision-maker in your market
- What counts as a compelling event

Then apply them: take your last five opportunities, score each against your gates,
and state which ones you should not have pursued.

Submissions that stay abstract get returned. Use your real numbers.
        `.trim(),
        deliverables: [
          "A positioning statement under twenty words, plus what it excludes",
          "Four written qualification gates with concrete thresholds, including a minimum engagement size",
          "Your last five opportunities scored against those gates, with a verdict on each",
        ],
        points: 100,
        dueInDays: 10,
      },
    },

    {
      title: "Pricing and proposals",
      summary: "Getting paid for the outcome rather than the hours, and writing proposals that close.",
      lessons: [
        {
          slug: "pricing-the-outcome",
          title: "Pricing the outcome, not the hours",
          summary:
            "Why the day rate caps your income and rewards you for being slow, and how to " +
            "move to outcome pricing without losing the client.",
          durationMinutes: 24,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/cf-pricing.mp4",
          body: `
## What the day rate actually does

It ties your income to a number of hours that has a hard ceiling, and it creates a
quiet conflict of interest: getting faster reduces your fee. Everyone can see this,
including the client, which is why day rates get negotiated down.

## The three numbers behind a price

Before you can price an outcome you need three numbers, and you get all three during
discovery:

1. **The cost of the problem.** What it costs them per year, in their currency.
2. **The value of the fix.** Realistically — a share of that cost, not all of it.
3. **Your cost to deliver.** Days, at a rate you would be content with.

Your price sits between (3) and a modest fraction of (2). If (2) is not comfortably
larger than (3), decline the work; there is no price that makes it good.

## Three options, always

Never send one price. Send three:

- **A narrow option** that solves the specific problem, priced below what they expect.
- **A recommended option** that solves it and prevents its recurrence. This is the
  one you want, and it is the one most clients take.
- **A comprehensive option**, priced high, that includes the things you would do if
  the constraint were removed.

Three options moves the conversation from "yes or no" to "which one" — and the
existence of the third makes the second look measured rather than expensive.

## What to do about discount requests

A discount without a change in scope teaches the client that your first number was
not real. Respond by removing something: "I can do that at that number — here's what
comes out." Usually they take the original.

## Never price on the call

You will price low. Take the numbers away, price them, and come back within 48 hours.
          `.trim(),
          keyPoints: [
            "Day rates cap your income and punish you for getting faster — clients know this and negotiate accordingly.",
            "Outcome pricing needs three numbers: cost of the problem, value of the fix, your cost to deliver.",
            "If the value of the fix is not comfortably larger than your delivery cost, decline the work.",
            "Always present three options; most clients take the middle one, and the third makes it look reasonable.",
            "Never discount without removing scope — it teaches the client your first number was fiction.",
            "Never price on the call.",
          ],
          steps: [
            "During discovery, get the annual cost of the problem in the client's own numbers.",
            "Estimate the realistic share of that cost your work recovers in the first year.",
            "Estimate your delivery cost in days and multiply by the rate you would be content with.",
            "Check the gap: if value is not several times your cost, decline rather than discount.",
            "Build three options — narrow, recommended, comprehensive — with the recommended one at the price you actually want.",
            "Send the price in writing within 48 hours, never on the call.",
          ],
          checklist: [
            "I have the annual cost of the problem, in the client's numbers, in writing.",
            "I have estimated the first-year value of the fix conservatively.",
            "I know my delivery cost in days.",
            "The value comfortably exceeds my cost — if not, I am declining.",
            "My proposal has three options, and the middle one is the price I want.",
            "I did not quote on the call.",
          ],
          worksheet: [
            "Take your three most recent engagements. What was your effective day rate on each, after all the unbilled hours?",
            "For your last engagement, what did the client's problem cost them annually? If you do not know, why did you not ask?",
            "What is the rate per day you would be genuinely content with? Where did that number come from?",
            "When were you last asked for a discount, and what did you do? What did that teach the client?",
          ],
          prompts: [
            {
              name: "Build a three-option price",
              prompt: `Help me price a consulting engagement using outcome pricing.

The client's problem: [DESCRIBE IT]
What it costs them annually, in their numbers: [AMOUNT AND HOW WE CALCULATED IT]
What I would do: [SCOPE]
My estimated delivery effort: [DAYS]
The day rate I would be content with: [RATE]

Produce three options — narrow, recommended, comprehensive. For each: what is included, what is explicitly excluded, the price, and the one-line rationale I would say out loud. Make the recommended option the one I actually want to sell. Flag if the value does not justify the fee, and say so plainly rather than making the numbers work.`,
            },
            {
              name: "Respond to a discount request",
              prompt: `A client has asked for a discount on this proposal:

[PASTE THE RELEVANT PART OF THE PROPOSAL AND THEIR REQUEST]

Draft a reply that does not discount without removing scope. It should: acknowledge the constraint, offer a reduced-scope version at their number, state clearly what comes out, and leave the original option open. Keep it under 150 words and do not apologise.`,
            },
          ],
          practice: [
            "Reprice your last completed engagement using outcome pricing. What would you have charged, and what stopped you?",
            "Write the three-option structure for the next opportunity in your pipeline, before you need it.",
          ],
          table: {
            fileLabel: "Outcome pricing worksheet",
            columns: [
              "Opportunity",
              "Annual cost of problem",
              "First-year value of fix",
              "Delivery days",
              "Target day rate",
              "Delivery cost",
              "Recommended price",
              "Value multiple",
            ],
            sampleRows: [
              ["Meridian – invoicing delay", "310000", "120000", "22", "900", "19800", "38000", "6.1x"],
              ["Northbridge – forecasting", "480000", "180000", "35", "900", "31500", "62000", "5.7x"],
              ["Attah – quoting handover", "45000", "18000", "12", "900", "10800", "16000", "1.7x"],
            ],
          },
        },
        {
          slug: "proposals-that-close",
          title: "Proposals that close without a meeting",
          summary:
            "A proposal is not a document about you. Structure, length, and the four things " +
            "that decide whether it gets signed.",
          durationMinutes: 19,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/cf-proposals.mp4",
          body: `
## Who your proposal is actually for

Often not the person you met. It gets forwarded to someone who was not on the call
and who will decide based on the document alone. Write for that person.

## The structure that works

1. **The situation, in their words.** Quote them. If they read this and think "yes,
   that is exactly it", the rest is downhill.
2. **What it is costing.** The number you established together. Their number, not yours.
3. **The proposed work**, as outcomes with dates — not as activities.
4. **Three options**, with what is in and explicitly what is out.
5. **What you need from them.** Access, decisions, people, by when.
6. **How to say yes.** One clear instruction.

## What to leave out

Your biography. Your methodology diagram. A page on your values. Anyone still
reading at page six has already decided; anyone who has not decided stopped at
page two.

**Two to four pages.** If it is longer, you are hedging.

## Outcomes, not activities

"Six workshops with the operations team" is an activity — the client is buying your
diary. "Order-to-invoice reduced to under seven days by 31 March" is an outcome.
Price the second one.

## The follow-up

Silence is not a no, and chasing is not follow-up. Send one message at day three that
adds something — a relevant example, a clarification, a risk you spotted. Then one at
day ten asking for a decision either way, and say plainly that a no is a completely
acceptable answer. It usually gets you an answer.
          `.trim(),
          keyPoints: [
            "Write for the person who was not on the call — they will decide from the document alone.",
            "Open with the client's situation in their own words, and the cost you established together.",
            "Sell outcomes with dates, not activities; activities invite scrutiny of your diary.",
            "Two to four pages. Length signals hedging, not thoroughness.",
            "Cut the biography and the methodology diagram — nobody undecided reads to page six.",
            "Follow up twice: add value at day three, ask for a decision either way at day ten.",
          ],
          steps: [
            "Write the situation section using phrases you wrote down verbatim on the call.",
            "State the cost of the problem using the client's own figure.",
            "Convert every activity in your plan into an outcome with a date attached.",
            "Lay out three options with explicit inclusions and exclusions.",
            "List what you need from the client, with names and dates.",
            "End with a single, unambiguous instruction for accepting.",
          ],
          checklist: [
            "The first paragraph uses the client's own words.",
            "The cost of the problem is the client's number, not my estimate.",
            "Every deliverable is an outcome with a date, not an activity.",
            "Exclusions are stated explicitly for each option.",
            "There is no biography section.",
            "The document is four pages or fewer.",
            "There is exactly one instruction for how to say yes.",
          ],
          worksheet: [
            "Take your last proposal. How many pages were about you rather than about them?",
            "Rewrite its first paragraph using only phrases the client actually said.",
            "List the deliverables in that proposal. How many were activities rather than outcomes?",
            "What did you leave implicit that later became an argument about scope?",
          ],
          prompts: [
            {
              name: "Turn call notes into a proposal draft",
              prompt: `Turn my discovery call notes into a consulting proposal.

Call notes, including direct quotes from the client: [PASTE]
The cost of the problem we established together: [NUMBER AND HOW]
What I propose to do: [SCOPE]
My three options and prices: [FROM THE PRICING WORKSHEET]

Structure it as: situation in their words (quote them), what it is costing, proposed outcomes with dates, three options with explicit exclusions, what I need from them, how to accept. Maximum four pages. No biography, no methodology diagram. Convert any activity I have written into an outcome with a date.`,
            },
            {
              name: "Audit a proposal before sending",
              prompt: `Review this consulting proposal before I send it:

[PASTE PROPOSAL]

Check specifically:
1. Which deliverables are activities rather than outcomes?
2. Where have I described myself instead of their situation?
3. What scope ambiguity will become an argument in week four?
4. Is it clear what the client does next to accept?

List the problems in priority order and rewrite the three worst sentences.`,
            },
          ],
          practice: [
            "Cut your last proposal to three pages without removing anything the client needs to decide. Note what went.",
            "Write your day-three and day-ten follow-up messages now, as templates, so you are not composing them under pressure.",
          ],
        },
      ],
      quiz: {
        title: "Module 2 check: pricing and proposals",
        passMark: 70,
        maxAttempts: 3,
        questions: [
          {
            prompt: "What is the structural problem with day-rate pricing?",
            explanation:
              "It caps income at available hours and means working faster reduces your fee — " +
              "a conflict the client can see, which is why day rates get negotiated.",
            choices: [
              "*It caps income at your available hours and penalises you for working faster",
              "It is illegal in most jurisdictions",
              "Clients cannot budget for it",
              "It requires detailed timesheets",
            ],
          },
          {
            prompt: "A client asks for a 20% discount with no change in scope. What is the recommended response?",
            explanation:
              "Discounting without removing scope teaches the client the first number was " +
              "not real. Offer their number with less in it and leave the original open.",
            choices: [
              "*Offer a reduced-scope option at their number and state exactly what comes out",
              "Agree, to protect the relationship",
              "Refuse and restate the original price",
              "Split the difference at 10%",
            ],
          },
          {
            prompt: "Which belong in a consulting proposal?",
            type: "MULTI",
            explanation:
              "The client's situation, their cost figure, outcomes with dates and explicit " +
              "exclusions all help someone decide. Your biography does not.",
            choices: [
              "*The client's situation in their own words",
              "*The cost of the problem, using the client's figure",
              "*Outcomes with dates, and explicit exclusions per option",
              "A page about your background and methodology",
            ],
          },
          {
            prompt: "When should you give the client a price?",
            explanation:
              "Away from the call, in writing, within 48 hours. Pricing live almost always " +
              "produces a lower number than the work is worth.",
            choices: [
              "*In writing, within 48 hours of the call",
              "On the discovery call, to maintain momentum",
              "Only after a second meeting",
              "After starting the work",
            ],
          },
        ],
      },
      assignment: {
        title: "Price and propose a live opportunity",
        briefMd: `
Take a **real** opportunity — live in your pipeline, or the most recent one you lost —
and do the full pricing and proposal work on it.

Submit:

1. **The pricing worksheet**, filled in: annual cost of the problem, first-year value
   of the fix, your delivery days, your target rate, and the resulting value multiple.
   If the multiple is below 3x, say so and explain whether you would still take it.
2. **Three options**, with prices, inclusions and explicit exclusions.
3. **A proposal of four pages or fewer**, following the structure from the lesson.
4. **One paragraph** on what you would have charged before this module, and why the
   two numbers differ.

If you use a hypothetical client, this exercise is worth nothing. Use a real one.
        `.trim(),
        deliverables: [
          "A completed pricing worksheet with a stated value multiple",
          "Three priced options with explicit inclusions and exclusions",
          "A proposal of four pages or fewer using the lesson structure",
          "A short reflection comparing your old price with your new one",
        ],
        points: 150,
        dueInDays: 14,
      },
    },

    {
      title: "Delivery and the numbers",
      summary:
        "Running engagements through a system rather than memory, and knowing the four " +
        "numbers that tell you whether the practice is healthy.",
      lessons: [
        {
          slug: "engagement-operating-system",
          title: "An engagement operating system",
          summary:
            "Kick-off, weekly rhythm, scope control and close-out — the four mechanisms " +
            "that keep delivery predictable when you are busy.",
          durationMinutes: 21,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/cf-delivery.mp4",
          body: `
## Why good consultants deliver badly

Not through incompetence. Through **load**. When three engagements are live and one
of them is on fire, the quiet client stops hearing from you, scope drifts unnoticed,
and the case study never gets written because you moved straight to the next thing.

The fix is not to work harder. It is four small mechanisms that run whether you are
on form that week or not.

## 1. Kick-off

One meeting, one document. It states the outcomes with dates, who does what, what is
explicitly out of scope, how decisions get made, and what happens when something
changes. Half an hour of discomfort here saves an argument in week six.

## 2. The weekly update

Same format, same day, every week, sent whether or not there is news:

- What moved this week
- What is next
- What I need from you, with names and dates
- Anything at risk

Three hundred words. The client who gets a boring weekly update never asks "where
are we?" — and never gets nervous enough to start managing you.

## 3. Scope control

Every change request gets the same response: acknowledged in writing, with its
impact on time and fee, before any work happens. Not a confrontation — a sentence.
"Happy to — that adds about three days, so it would be an extra £2,700, or we can
swap it for the reporting piece. Which would you prefer?"

Unpaid scope creep is almost always the consultant's fault, not the client's.

## 4. Close-out

A short session with the client at the end: what changed, what the numbers are now,
what to watch. Capture the result **while they still remember it**, in their words,
with their permission to use it. That is where your next positioning evidence and
your next referral come from.
          `.trim(),
          keyPoints: [
            "Delivery fails through load, not incompetence — build mechanisms that run on bad weeks.",
            "Kick-off document: outcomes with dates, roles, explicit exclusions, decision and change process.",
            "Send the same three-hundred-word weekly update every week, news or not.",
            "Price every change request in writing before doing the work — creep is the consultant's fault.",
            "Close out formally and capture the result in the client's words while they remember it.",
          ],
          steps: [
            "Run a kick-off meeting in week one and issue the kick-off document within 24 hours.",
            "Fix a day for the weekly update and send it every week regardless of progress.",
            "When a change is requested, reply in writing with time and fee impact before starting.",
            "Track outcomes against the dates in the kick-off document, not against your task list.",
            "Hold a close-out session and write the result up in the client's own words.",
            "Ask for the referral at close-out, while the result is fresh — not three months later.",
          ],
          checklist: [
            "The kick-off document is issued and acknowledged in writing.",
            "Out-of-scope items are listed explicitly, not implied.",
            "The weekly update has gone out every week of this engagement.",
            "Every change request has a written time and fee impact.",
            "A close-out session is booked before the final deliverable.",
            "The result is captured in the client's words, with permission to use it.",
          ],
          worksheet: [
            "In your last engagement, how much unpaid work did you do? Estimate it in days, then in money.",
            "Which client stopped hearing from you when things got busy, and what did that cost?",
            "How many of your last five engagements produced a written, usable case study?",
            "What is the one sentence you would use to ask for a referral at close-out?",
          ],
          prompts: [
            {
              name: "Draft a kick-off document",
              prompt: `Draft an engagement kick-off document from this proposal:

[PASTE THE ACCEPTED PROPOSAL]

It must contain: outcomes with dates, who is responsible for what (named), what is explicitly out of scope, how decisions get made and by whom, the change-request process including that changes are priced before work starts, and the weekly update cadence. Keep it to two pages and write it so the client's colleagues who were not in the sales conversation can follow it.`,
            },
            {
              name: "Price a scope change",
              prompt: `A client has asked for something outside the agreed scope.

Original scope: [PASTE]
What they have asked for: [PASTE]
My day rate: [RATE]

Estimate the additional effort, then draft a short reply that: says yes in principle, states the time and fee impact, offers a swap against existing scope as an alternative, and asks them to choose. Under 120 words. Friendly, not defensive, and no apologising.`,
            },
          ],
          practice: [
            "Write your weekly update template now and send this week's update for every live engagement, even the quiet ones.",
            "Take your last engagement and list everything that was delivered but not in the original scope. Total it in days.",
          ],
        },
        {
          slug: "the-four-numbers",
          title: "The four numbers that tell you the truth",
          summary:
            "Effective rate, utilisation, pipeline coverage and client concentration — what " +
            "to measure monthly, and what each one tells you to do.",
          durationMinutes: 18,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/cf-numbers.mp4",
          body: `
## Revenue is not a diagnosis

A good revenue month tells you nothing about whether the practice is healthy. These
four numbers do, and between them they explain almost every problem an independent
practice has.

## 1. Effective rate

Total fees divided by **all** hours the engagement consumed — including proposals,
travel, the calls that were not billable, and the tidying up afterwards. Almost
everyone's effective rate is 40–60% of their headline rate. If yours is dropping,
either scope is creeping or you are pricing hours rather than outcomes.

## 2. Utilisation

Billable days as a share of available days. Above roughly 80% and you have no
capacity to sell, which is how consultants create their own famine. Below 50% and
either the pipeline or the positioning is broken.

## 3. Pipeline coverage

Value of live opportunities against next quarter's target. Below about 3x and you
are relying on everything closing, which it will not. This is the number that
predicts a bad quarter three months in advance — which is the only useful time to
find out.

## 4. Client concentration

Share of revenue from your largest client. Above 40% you are not running a practice,
you are employed with extra steps and no notice period. It also quietly distorts
every decision you make about that client.

## The monthly review

Thirty minutes, same day each month. Four numbers, and one decision from each:

- Effective rate falling → tighten scope control, or reprice.
- Utilisation above 80% → raise prices or subcontract.
- Coverage below 3x → sales time this month, non-negotiable.
- Concentration above 40% → the next engagement must come from elsewhere.
          `.trim(),
          keyPoints: [
            "Revenue is not a diagnosis; four ratios explain nearly every practice problem.",
            "Effective rate uses all hours consumed, not billable ones — expect 40–60% of headline.",
            "Utilisation above 80% means no capacity to sell, which manufactures the next famine.",
            "Pipeline coverage below 3x predicts a bad quarter while you can still fix it.",
            "Client concentration above 40% is employment without a notice period.",
            "Thirty minutes a month, four numbers, one decision each.",
          ],
          steps: [
            "Record every hour against an engagement for one month, including unbillable ones.",
            "Calculate effective rate as total fees over total hours consumed.",
            "Calculate utilisation as billable days over available days for the month.",
            "Total the value of live opportunities and divide by next quarter's target.",
            "Calculate the largest client's share of trailing twelve-month revenue.",
            "Book a recurring thirty-minute review and write one decision per number.",
          ],
          checklist: [
            "I know my effective rate for the last quarter, not just my headline rate.",
            "I know my utilisation percentage for last month.",
            "I know my pipeline coverage for next quarter as a multiple.",
            "I know what share of my revenue comes from my largest client.",
            "The monthly review is in my calendar as a recurring event.",
            "Each number has a written trigger and a decision attached to it.",
          ],
          worksheet: [
            "Calculate your effective rate for your last completed engagement. How far is it from your headline rate?",
            "What is your utilisation this quarter, and what does that predict about next quarter's pipeline?",
            "What is your pipeline coverage right now? If it is below 3x, what are you going to do this week?",
            "What share of your revenue comes from your largest client, and what would happen if they stopped?",
          ],
          prompts: [
            {
              name: "Diagnose the practice from four numbers",
              prompt: `Here are my practice numbers for the last quarter:

Effective rate: [NUMBER] (headline rate: [NUMBER])
Utilisation: [PERCENT]
Pipeline coverage for next quarter: [MULTIPLE]
Largest client as share of revenue: [PERCENT]

Diagnose what is actually wrong, in priority order. For each problem: what is causing it, what is the single highest-leverage action this month, and what will happen if I do nothing for another quarter. Do not reassure me.`,
            },
          ],
          practice: [
            "Calculate all four numbers for your practice today, however rough. Rough numbers you have beat precise numbers you do not.",
            "Set the recurring monthly review in your calendar now, with the four numbers listed in the invite body.",
          ],
          table: {
            fileLabel: "Monthly practice scorecard",
            columns: [
              "Month",
              "Fees invoiced",
              "Total hours consumed",
              "Effective rate",
              "Billable days",
              "Available days",
              "Utilisation %",
              "Pipeline value",
              "Next-quarter target",
              "Coverage",
              "Largest client %",
              "Decision taken",
            ],
            sampleRows: [
              ["Jan", "31000", "168", "185", "14", "20", "70", "142000", "60000", "2.4x", "38", "Sales week booked; two proposals out"],
              ["Feb", "44000", "196", "224", "17", "20", "85", "88000", "60000", "1.5x", "44", "Raised prices 15%; declined one bad-fit"],
              ["Mar", "38000", "160", "238", "13", "21", "62", "205000", "75000", "2.7x", "31", "Held rate; two new logos in pipeline"],
            ],
          },
        },
      ],
      quiz: {
        title: "Module 3 check: delivery and numbers",
        passMark: 70,
        maxAttempts: 3,
        questions: [
          {
            prompt: "What does utilisation above roughly 80% indicate?",
            explanation:
              "You have no capacity left to sell, so the pipeline empties while you are busy — " +
              "which produces the famine that follows the feast.",
            choices: [
              "*You have no capacity to sell, which creates the next famine",
              "The practice is performing optimally",
              "Your prices are too high",
              "You need to hire immediately",
            ],
          },
          {
            prompt: "A client requests work outside the agreed scope. What happens first?",
            explanation:
              "Acknowledge in writing with the time and fee impact — and offer a swap — before " +
              "any work starts. Creep is the consultant's failure, not the client's.",
            choices: [
              "*It is priced in writing, with a swap offered, before any work starts",
              "You absorb it to protect the relationship",
              "You add it to the final invoice as a surprise",
              "You decline all changes on principle",
            ],
          },
          {
            prompt: "Which numbers belong in the monthly practice review?",
            type: "MULTI",
            explanation:
              "Effective rate, utilisation, pipeline coverage and client concentration. " +
              "Between them they explain nearly every problem a small practice has.",
            choices: [
              "*Effective hourly rate across all hours consumed",
              "*Utilisation as billable days over available days",
              "*Pipeline coverage against next quarter's target",
              "*Largest client's share of revenue",
            ],
          },
          {
            prompt: "Pipeline coverage below 3x is a problem you find out about too late to fix.",
            type: "TRUE_FALSE",
            explanation:
              "The opposite: coverage is the one number that warns you about a bad quarter " +
              "roughly three months before it happens, which is when you can still act.",
            choices: ["True", "*False"],
          },
        ],
      },
      assignment: {
        title: "Your practice scorecard and delivery system",
        briefMd: `
Two deliverables, both for immediate use.

**1. Your scorecard.** Calculate all four numbers for your practice: effective rate,
utilisation, pipeline coverage and client concentration. Use last quarter's real
data. Where you do not have the data, say so and state how you will capture it from
now on — do not estimate it and present the estimate as fact.

For each number, write the decision it triggers for you this month.

**2. Your delivery system.** Produce the kick-off document and the weekly update
template you will use on your next engagement, adapted to your practice. Include your
scope-change wording, written out as you would actually send it.

Submissions using illustrative numbers instead of real ones will be returned.
        `.trim(),
        deliverables: [
          "All four practice numbers calculated from real data, with gaps declared honestly",
          "One decision written against each number",
          "A kick-off document template adapted to your practice",
          "A weekly update template and your scope-change wording",
        ],
        points: 150,
        dueInDays: 14,
      },
    },
  ],

  finalQuiz: {
    title: "Consulting Practice Foundations — final assessment",
    description:
      "Six questions across positioning, pricing, proposals, delivery and the numbers.",
    passMark: 75,
    timeLimitMinutes: 20,
    maxAttempts: 3,
    questions: [
      {
        prompt: "Which of these is a properly narrow positioning statement?",
        explanation:
          "It names a specific buyer and a specific, expensive problem the buyer already " +
          "recognises. A size band and a sector alone is still a category, not a position.",
        choices: [
          "*'I help 20–60 person logistics firms cut order-to-invoice time'",
          "'I provide operations consulting to SMEs'",
          "'I am a business strategist for growing companies'",
          "'I offer bespoke solutions across multiple sectors'",
        ],
      },
      {
        prompt: "When should you decline an engagement outright rather than adjusting the price?",
        explanation:
          "When the value of the fix is not comfortably larger than your delivery cost, " +
          "there is no price that makes it a good engagement for either side.",
        choices: [
          "*When the first-year value of the fix is not comfortably larger than your delivery cost",
          "Whenever the client asks for a discount",
          "Whenever the client is smaller than your usual size",
          "Whenever the engagement is under three months",
        ],
      },
      {
        prompt: "Which of these belong in the weekly client update?",
        type: "MULTI",
        explanation:
          "What moved, what is next, what you need from them with names and dates, and " +
          "what is at risk. Around three hundred words, every week, news or not.",
        choices: [
          "*What moved this week",
          "*What is next",
          "*What you need from them, with names and dates",
          "*Anything currently at risk",
        ],
      },
      {
        prompt: "Your effective rate is typically what share of your headline day rate?",
        explanation:
          "Most independents land between 40% and 60% once proposals, travel, unbilled " +
          "calls and clean-up are counted. Knowing the real figure is what allows repricing.",
        choices: ["*Around 40–60%", "Around 95%", "Around 80–90%", "Higher than headline"],
      },
      {
        prompt: "What is the primary risk of a client representing more than 40% of your revenue?",
        explanation:
          "It is employment without a notice period, and it distorts every decision you " +
          "make about that client — including the ones you should be pushing back on.",
        choices: [
          "*You are effectively employed without a notice period, and your judgement about that client is compromised",
          "Your tax position becomes more complex",
          "You cannot use them as a case study",
          "Your utilisation will necessarily fall",
        ],
      },
      {
        prompt: "A proposal should include a section on your background and methodology.",
        type: "TRUE_FALSE",
        explanation:
          "Anyone still reading at page six has already decided. The proposal is about " +
          "their situation, the cost, the outcomes and how to say yes.",
        choices: ["True", "*False"],
      },
    ],
  },

  capstone: {
    title: "Capstone: rebuild your practice on one page each",
    briefMd: `
Bring the whole course together into a practice operating pack. Four short documents,
each no longer than a page:

1. **Positioning and qualification.** Your statement, what it excludes, and your four
   gates with concrete thresholds.
2. **Pricing.** Your outcome-pricing model, your target rate, your minimum engagement
   size, and your standard three-option structure.
3. **Delivery.** Your kick-off outline, weekly update format and scope-change wording.
4. **The numbers.** Your current four numbers, your targets for each, and the decision
   triggers.

Then write a final half-page: **what you are stopping.** Every change in this course
requires giving something up — a type of client, a pricing habit, a delivery
shortcut. Name what goes, and what it costs you in the short term.

This pack should be something you would hand to a business partner joining your
practice tomorrow.
    `.trim(),
    deliverables: [
      "A one-page positioning and qualification document",
      "A one-page pricing model with target rate and minimum engagement size",
      "A one-page delivery system covering kick-off, weekly update and scope changes",
      "A one-page numbers dashboard with targets and decision triggers",
      "A half-page statement of what you are stopping, with the short-term cost",
    ],
    points: 200,
    dueInDays: 21,
  },
};
