import type { CourseSpec } from "../types";

export const aiOperationsCourse: CourseSpec = {
  slug: "ai-operations-for-small-teams",
  title: "AI-Powered Operations for Small Teams",
  subtitle: "Put AI where the work actually is, without breaking anything that matters",
  description:
    "A practical course for teams of two to fifty who keep hearing they should be using " +
    "AI and are not sure where to start. You will map where your team's time actually " +
    "goes, pick the two or three tasks worth automating first, write prompts that produce " +
    "consistent output rather than impressive demos, and put review steps in the places " +
    "where a wrong answer would cost you a client. No hype, no coding required.",
  category: "Operations",
  level: "INTERMEDIATE",
  priceCents: 19900,
  estimatedHours: 6,
  welcomeVideoUrl: "https://cdn.jiglobalacademy.com/welcome/ai-operations.mp4",
  welcomeVideoNote:
    "Three minutes on the two mistakes small teams make with AI: automating the wrong " +
    "task, and trusting output nobody checked. Everything in this course exists to " +
    "prevent one or the other.",
  outcomes: [
    "Map where your team's hours actually go, with evidence rather than impressions",
    "Choose automation candidates on frequency, judgement and cost of error",
    "Write prompts that produce consistent output across different people using them",
    "Build a review step sized to the real consequence of a wrong answer",
    "Write an AI usage policy your team will actually follow",
    "Measure whether a change saved time, instead of assuming it did",
  ],
  requirements: [
    "A team, or a set of recurring processes you are responsible for",
    "Access to any mainstream AI assistant",
    "No coding experience needed",
  ],
  passMark: 70,

  courseResources: [
    {
      kind: "SOP",
      title: "AI adoption — the ten-day plan",
      description: "A day-by-day sequence for getting the first automation into production safely.",
      sections: [
        {
          heading: "Days 1–3: find the work",
          items: [
            "Run the time audit with the whole team, in fifteen-minute blocks, for three days.",
            "Group tasks by frequency and by how much judgement each requires.",
            "Pick the top five candidates: high frequency, low judgement, low cost of error.",
          ],
        },
        {
          heading: "Days 4–6: build and test",
          items: [
            "Write the prompt with an explicit role, inputs, constraints and output format.",
            "Test it on ten real past examples where you already know the right answer.",
            "Record where it fails and add the constraint that would have prevented each failure.",
          ],
        },
        {
          heading: "Days 7–8: add the safety net",
          items: [
            "Decide the cost of a wrong answer reaching a client, in money and in trust.",
            "Size the review step to that cost — spot check, full review, or two-person sign-off.",
            "Write down who reviews, what they check, and what they do when it is wrong.",
          ],
        },
        {
          heading: "Days 9–10: roll out and measure",
          items: [
            "Have someone else run the process using only the written instructions.",
            "Record time taken before and after, on the same task type.",
            "Book a two-week review with a pre-agreed decision to keep, fix or drop it.",
          ],
        },
      ],
    },
  ],

  modules: [
    {
      title: "Finding the work worth automating",
      summary: "Evidence about where the time goes, and a way to choose that is not driven by novelty.",
      lessons: [
        {
          slug: "the-time-audit",
          title: "The time audit",
          summary:
            "Three days of fifteen-minute blocks that will surprise you, and how to read " +
            "the result without flattering anyone.",
          durationMinutes: 18,
          isPreview: true,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/ai-time-audit.mp4",
          body: `
## You do not know where the time goes

Everyone thinks they do. Almost nobody is right. The gap is not laziness — it is that
the small repeated tasks are invisible precisely because they are small. Twenty
minutes of reformatting, four times a day, is a day a week that nobody notices.

## The method

Three days. Everyone on the team. Fifteen-minute blocks. One line per block: what you
were doing, and whether it needed judgement.

Three days is short enough that people will actually do it and long enough to catch
the weekly rhythm. Do not do a week; you will get two good days and five days of
fiction.

## The one rule

**Record what happened, not what should have happened.** The audit is worthless if
people tidy it up. Say this out loud at the start, and make it clear the audit is
about the process, not about the person.

## Reading the result

Group everything into three buckets:

- **Mechanical** — no judgement. Reformatting, copying between systems, chasing.
- **Judgement-light** — a decision, but against a rule you could write down.
- **Judgement-heavy** — genuinely requires context, relationship or experience.

The mechanical bucket is usually 30–50% of the week in a small team, and it is where
you start. The judgement-heavy bucket is not an automation target; trying to make it
one is the most common expensive mistake.

## What you will find

Two things, reliably: a task nobody realised was consuming a day a week, and a task
that exists only because of a decision somebody made three years ago and nobody has
revisited. The second one does not need AI. It needs deleting.
          `.trim(),
          keyPoints: [
            "Small repeated tasks are invisible because they are small — twenty minutes, four times a day, is a day a week.",
            "Three days, whole team, fifteen-minute blocks. A week produces fiction.",
            "Record what happened, not what should have happened, and say so out loud at the start.",
            "Sort into mechanical, judgement-light and judgement-heavy.",
            "Mechanical work is usually 30–50% of a small team's week, and that is where you start.",
            "Some of what you find should be deleted, not automated.",
          ],
          steps: [
            "Explain the audit to the team, including explicitly that it is about the process and not about them.",
            "Log every fifteen-minute block for three working days: what you did, and whether it required judgement.",
            "Group all logged tasks into mechanical, judgement-light and judgement-heavy.",
            "Total the hours per group and per task type across the team.",
            "Identify anything that exists only out of habit and remove it before considering automation.",
            "Rank the remaining mechanical and judgement-light tasks by total hours consumed.",
          ],
          checklist: [
            "Everyone on the team logged three full days.",
            "The team was told the audit is about the process, not about individuals.",
            "Every logged block records what actually happened.",
            "Tasks are grouped into mechanical, judgement-light and judgement-heavy.",
            "Total hours are calculated per task, across the team.",
            "Tasks that should simply be deleted have been identified and removed.",
          ],
          worksheet: [
            "Before running the audit: what do you believe is the biggest consumer of your team's time?",
            "After the audit: what actually was? How wrong were you?",
            "Which task exists only because of a decision nobody has revisited? What would happen if it stopped?",
            "What proportion of your team's logged time was mechanical? What is that worth annually in salary?",
          ],
          prompts: [
            {
              name: "Analyse a time audit",
              prompt: `Here is a time audit from my team, in fifteen-minute blocks across three days:

[PASTE THE LOG: PERSON, BLOCK, TASK, JUDGEMENT REQUIRED Y/N]

Team size: [NUMBER]. Roughly what we do: [DESCRIPTION].

Analyse it:
1. Group the tasks and total the hours per group across the team.
2. Classify each group as mechanical, judgement-light or judgement-heavy, and say why.
3. Identify anything that looks like it exists out of habit and should be deleted rather than automated.
4. Rank the top five automation candidates by hours consumed, and flag any where the cost of a wrong answer would make automation a bad idea.

Be direct about which of my assumptions the data contradicts.`,
            },
          ],
          practice: [
            "Log your own next three hours in fifteen-minute blocks. Compare it to what you would have guessed before starting.",
            "Pick one recurring task and time it accurately five times. Multiply by its annual frequency. Sit with the number.",
          ],
          table: {
            fileLabel: "Time audit log",
            columns: ["Date", "Person", "Block (15 min)", "Task", "Judgement needed?", "Category", "Notes"],
            sampleRows: [
              ["2026-08-03", "A. Boateng", "09:00", "Reformatting supplier quotes into our template", "No", "Mechanical", "Happens ~6x/day"],
              ["2026-08-03", "A. Boateng", "09:15", "Same", "No", "Mechanical", ""],
              ["2026-08-03", "S. Whitfield", "09:00", "Deciding which late orders to escalate", "Yes — but against a rule", "Judgement-light", "Rule is in someone's head"],
              ["2026-08-03", "S. Whitfield", "11:30", "Client call about a delayed shipment", "Yes", "Judgement-heavy", "Relationship-dependent"],
            ],
          },
        },
        {
          slug: "choosing-what-to-automate",
          title: "Choosing what to automate first",
          summary:
            "Three axes — frequency, judgement and cost of error — and why the exciting " +
            "candidate is usually the wrong one.",
          durationMinutes: 16,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/ai-choosing.mp4",
          body: `
## The wrong instinct

The task everyone wants to automate first is usually the most interesting one — the
one requiring judgement, the one that feels impressive. It is the wrong choice
almost every time, because judgement-heavy work is where errors are expensive and
hardest to detect.

## Score on three axes

**Frequency.** How many times a week does this happen across the team? Below about
five, the payback is not worth the setup, however annoying the task is.

**Judgement.** Can you write down the rule? If you can write it down, an assistant
can follow it. If the rule lives in someone's experience and changes by context, it
is not a first candidate.

**Cost of error.** What happens if the output is wrong and nobody catches it? An
internal summary being wrong is an annoyance. A client-facing quote being wrong is a
credibility event, and a compliance document being wrong may be a legal one.

## The first automation you want

High frequency, low judgement, low cost of error. It is boring. That is the point —
you are building the team's confidence and your own review habits on something where
mistakes are cheap.

## What to leave alone, for now

- Anything client-facing without a review step in place
- Anything where the rule genuinely lives in someone's head and has never been
  written down — write it down first, then reconsider
- Anything touching regulated or legally binding output
- Anything happening fewer than five times a week

## The honest payback calculation

Time saved per run × runs per week × 48, minus the time to build it, minus the review
time you are adding. Review time is real and permanent — people leave it out of the
sum, and that is why the projected savings never arrive.
          `.trim(),
          keyPoints: [
            "The most interesting candidate is usually the wrong one — judgement-heavy errors are expensive and hard to spot.",
            "Score on frequency, judgement and cost of error.",
            "Below about five times a week, the payback rarely justifies the setup.",
            "If you cannot write the rule down, it is not a first candidate — write it down first.",
            "Start boring: high frequency, low judgement, cheap mistakes.",
            "Include permanent review time in the payback sum, or the savings will not appear.",
          ],
          steps: [
            "Take the ranked list from the time audit and score each task 1–5 on frequency.",
            "Score each on judgement, where 1 is a writable rule and 5 lives in someone's experience.",
            "Score each on cost of error, where 1 is an internal annoyance and 5 is a client or legal consequence.",
            "Shortlist tasks with high frequency and low scores on the other two.",
            "Calculate honest payback including the review time you are adding permanently.",
            "Pick exactly one to start with, and write down what success looks like before building anything.",
          ],
          checklist: [
            "Every candidate is scored on all three axes.",
            "The rule for the chosen task is written down, not held in someone's head.",
            "The cost of a wrong answer has been stated explicitly, in money or in trust.",
            "Payback includes the ongoing review time.",
            "Exactly one task has been chosen to start with.",
            "Success is defined in a measurable way before any building starts.",
          ],
          worksheet: [
            "Which task did you instinctively want to automate first? Score it honestly on the three axes.",
            "For your top candidate: what happens if the output is wrong and reaches a client?",
            "Can you write the decision rule for that task in under ten lines? Try it now.",
            "What is the honest annual payback, after subtracting build time and permanent review time?",
          ],
          prompts: [
            {
              name: "Score automation candidates",
              prompt: `Score these tasks as AI automation candidates for a small team.

For each task: [NAME, HOW OFTEN IT HAPPENS PER WEEK, WHO DOES IT, WHAT THE OUTPUT IS, WHO SEES THE OUTPUT]

Score each 1–5 on:
- Frequency (5 = many times daily)
- Judgement required (1 = a rule I can write down, 5 = lives in experience)
- Cost of error (1 = internal annoyance, 5 = client or legal consequence)

Recommend exactly one to start with and explain why the others are worse first choices. If any candidate is a bad idea regardless of ordering, say so plainly. Then estimate honest annual payback including permanent review time.`,
            },
            {
              name: "Extract a written rule from a task",
              prompt: `I want to write down the decision rule for a task that currently lives in someone's head.

The task: [DESCRIBE IT]
Who does it and how they describe their approach: [PASTE WHAT THEY SAID]
Examples of the decision being made: [3-5 REAL EXAMPLES WITH THE OUTCOME]

Draft the rule as an explicit decision procedure someone new could follow. Then list the edge cases the examples do not cover, and the questions I need to ask before the rule is safe to rely on.`,
            },
          ],
          practice: [
            "Score your top five candidates on all three axes. Notice whether your instinctive favourite survives.",
            "Write the decision rule for your chosen task in under ten lines, then hand it to a colleague and see if they can apply it.",
          ],
        },
      ],
      quiz: {
        title: "Module 1 check: finding the work",
        passMark: 70,
        maxAttempts: 3,
        questions: [
          {
            prompt: "Why is the time audit run over three days rather than a week?",
            explanation:
              "Three days is short enough that people log honestly. Over a week you get two " +
              "good days and five days of reconstruction.",
            choices: [
              "*Three days gets honest logging; over a week people reconstruct rather than record",
              "Three days is the statistical minimum for significance",
              "A week would be too expensive",
              "Weekly patterns are irrelevant to automation",
            ],
          },
          {
            prompt: "Which three axes are used to score automation candidates?",
            type: "MULTI",
            explanation:
              "Frequency, judgement required, and cost of error. The first automation should " +
              "be high on the first and low on the other two.",
            choices: [
              "*How frequently the task occurs",
              "*How much judgement it requires",
              "*What a wrong answer would cost",
              "How interesting the task is to the team",
            ],
          },
          {
            prompt: "A task requires judgement that lives in an experienced person's head and has never been written down. What should happen first?",
            explanation:
              "Write the rule down. Until it exists in writing, there is nothing for an " +
              "assistant to follow and no way to tell whether output is right.",
            choices: [
              "*Write the rule down, then reconsider whether it is a candidate",
              "Automate it and let the assistant infer the rule",
              "Remove the task",
              "Assign it to a junior team member",
            ],
          },
          {
            prompt: "Review time should be excluded from the payback calculation because it is temporary.",
            type: "TRUE_FALSE",
            explanation:
              "Review time is permanent and it is precisely why projected savings often fail " +
              "to appear. It belongs in the sum.",
            choices: ["True", "*False"],
          },
        ],
      },
      assignment: {
        title: "Run the audit, pick the task",
        briefMd: `
Do this with your actual team, on actual work.

1. **Run the three-day time audit.** Everyone, fifteen-minute blocks. Submit the
   summary: total hours by category (mechanical / judgement-light / judgement-heavy)
   and the top ten tasks by hours consumed.
2. **Identify one task to delete.** Something that exists out of habit. Say what it
   is and what you are doing about it.
3. **Score your top five candidates** on frequency, judgement and cost of error.
4. **Choose one**, and write: the decision rule in under ten lines, what a wrong
   answer would cost, and the honest annual payback including permanent review time.

If your audit shows the team's time is 90% judgement-heavy, that is a finding worth
submitting — say so and explain what you think is really going on.
        `.trim(),
        deliverables: [
          "A three-day time audit summary with hours by category and the top ten tasks",
          "One task identified for deletion, with what you are doing about it",
          "Five candidates scored on all three axes",
          "One chosen task with its written decision rule, cost of error, and honest payback",
        ],
        points: 150,
        dueInDays: 14,
      },
    },

    {
      title: "Building it safely",
      summary: "Prompts that behave consistently, and review steps sized to the actual consequence.",
      lessons: [
        {
          slug: "prompts-that-behave",
          title: "Prompts that behave the same way twice",
          summary:
            "The difference between a prompt that produces a good demo and one that produces " +
            "consistent output when four different people use it.",
          durationMinutes: 20,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/ai-prompts.mp4",
          body: `
## The demo problem

A prompt that works beautifully once is not a process. The question is whether it
works on the twentieth input, run by someone who was not there when you wrote it,
on a Friday afternoon.

Consistency comes from constraint, not from cleverness.

## The four parts

**Role and context.** Who the assistant is acting as and what the situation is. One
or two sentences — enough to set the register, not a personality.

**Inputs, explicitly marked.** State exactly what is being provided and delimit it,
so instructions and data cannot be confused with each other. This also stops content
inside the input from being read as new instructions.

**Constraints.** The rules. What must be included, what must never be, what to do
when information is missing. This is where consistency actually comes from — most
weak prompts have almost nothing here.

**Output format.** Exact structure. Field names, section order, length limits. If the
output feeds another step, specify it precisely enough that the next step never has
to guess.

## The instruction people forget

**Say what to do when the input is inadequate.** Without it, an assistant will
produce a confident, plausible answer built on nothing — and that is the failure mode
most likely to reach a client. "If the input does not contain X, output exactly
NEEDS REVIEW and stop" is worth more than any amount of clever phrasing.

## Test on ten real examples

Not invented ones. Ten real past cases where you already know the right answer. Count
the failures, and for each one add the constraint that would have prevented it. Two
or three rounds of that and the prompt is genuinely stable.

## Version it

Keep the prompt in a shared document with a version number and a change log. Prompts
edited privately in someone's chat window are the reason output drifts and nobody can
explain why.
          `.trim(),
          keyPoints: [
            "A prompt that works once is a demo; a process works on the twentieth input, run by someone else.",
            "Four parts: role and context, delimited inputs, constraints, exact output format.",
            "Constraints are where consistency comes from — most weak prompts have almost none.",
            "Always specify what to do when the input is inadequate, or you get confident nonsense.",
            "Test on ten real cases where you know the answer, and add a constraint per failure.",
            "Version prompts in a shared document; private edits are why output drifts.",
          ],
          steps: [
            "Write the role and context in no more than two sentences.",
            "Mark the inputs explicitly and delimit them so data cannot be read as instructions.",
            "Write the constraints, including what must never appear in the output.",
            "Specify the output format exactly, including field names and length limits.",
            "Add the inadequate-input instruction with a specific token the next step can detect.",
            "Test against ten real past examples, and add one constraint per observed failure.",
            "Store the prompt with a version number and a change log.",
          ],
          checklist: [
            "The role and context are two sentences or fewer.",
            "Inputs are explicitly delimited.",
            "Constraints state what must never appear, not only what should.",
            "The output format is specified precisely enough for the next step.",
            "There is an explicit instruction for inadequate input, with a detectable token.",
            "It has been tested on ten real examples and the failures produced new constraints.",
            "The prompt is versioned in a shared location.",
          ],
          worksheet: [
            "Take a prompt your team uses. Which of the four parts is missing or thin?",
            "What does it currently do when the input is missing something important? Test it and find out.",
            "Run it on five real past cases. How many outputs would you have been happy to send?",
            "Where is that prompt stored, and who else can edit it without telling you?",
          ],
          prompts: [
            {
              name: "Rebuild a prompt with the four parts",
              prompt: `Rewrite this prompt so it produces consistent output when different people use it on different inputs.

Current prompt: [PASTE]
What the task actually is: [DESCRIBE]
Who uses it and how often: [DESCRIBE]
What a wrong output would cost: [DESCRIBE]

Rebuild it with four clearly separated parts: role and context (max two sentences), explicitly delimited inputs, constraints including what must never appear, and an exact output format. Add an explicit instruction for what to do when the input is inadequate, using a detectable token. Then list the five most likely ways this prompt still fails.`,
            },
            {
              name: "Generate a test set for a prompt",
              prompt: `I need to test a prompt before putting it into production.

The prompt: [PASTE]
The real inputs it will receive: [DESCRIBE, WITH 2-3 EXAMPLES]

Design a test set of ten cases covering: three typical inputs, three incomplete inputs, two inputs containing something that looks like an instruction, one input in an unexpected format, and one that should trigger the inadequate-input path. For each, state what correct behaviour looks like so I can score the results objectively.`,
            },
          ],
          practice: [
            "Take your chosen task's prompt and run it on ten real past cases. Score each output pass or fail, then add one constraint per failure.",
            "Give your prompt to a colleague with no explanation and watch them use it. Every question they ask is a missing constraint.",
          ],
        },
        {
          slug: "review-steps-and-policy",
          title: "Review steps and a policy people follow",
          summary:
            "Sizing the check to the cost of being wrong, and writing a one-page AI policy " +
            "that is short enough to be read.",
          durationMinutes: 19,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/ai-review-policy.mp4",
          body: `
## Review is not optional, but it is not uniform

Reviewing everything at the same depth is how teams abandon automation — the review
costs more than the task saved. Size the check to the consequence.

- **Low cost of error** (internal notes, first drafts): spot check one in ten.
- **Medium** (client-facing but revisable — a draft email, a summary): a named person
  reads every output before it goes.
- **High** (quotes, contracts, compliance, anything with a number a client will act
  on): two-person sign-off, and the reviewer must be able to check the source, not
  just judge whether it reads well.

## The rule that matters most

**Nobody approves output they cannot verify.** If the reviewer cannot check the
underlying facts, they are not reviewing — they are rubber-stamping, and the process
has a hole in it exactly where you thought the safety was.

## Watch for the drift

Reviews get lighter over time as confidence grows. That is natural and it is also how
the eventual failure happens. Put a fixed re-check in the calendar: monthly, take ten
recent outputs and review them properly, whatever the current review level is.

## The one-page policy

If it runs to five pages nobody reads it and it protects nothing. One page:

1. **What we use AI for**, listed as specific tasks. Not "productivity".
2. **What never goes into an AI tool**: client personal data, anything under NDA,
   credentials, unpublished financials. Be specific to your business.
3. **Who reviews what**, by role, with the depth for each category.
4. **Attribution**: whether AI-assisted work is disclosed to clients, and when.
5. **Who to tell when it goes wrong**, and that reporting it carries no blame.

That last point is the difference between a policy that works and one that produces
quiet workarounds. If people are punished for reporting a bad output, they will stop
reporting them — and you will find out from a client instead.

## Measure it honestly

Two weeks after rollout, compare time taken on the same task type before and after —
including review time. Then take the pre-agreed decision: keep, fix, or drop. Having
agreed the decision criteria in advance is what stops sunk cost from making it for
you.
          `.trim(),
          keyPoints: [
            "Uniform review depth is why teams abandon automation — size the check to the consequence.",
            "Low: spot check one in ten. Medium: a named person reads everything. High: two-person sign-off.",
            "Nobody approves output they cannot verify; unverifiable approval is a hole where the safety was.",
            "Reviews drift lighter over time — schedule a fixed monthly deep re-check.",
            "A one-page policy gets read; a five-page one protects nothing.",
            "Reporting a bad output must carry no blame, or you will hear about failures from clients instead.",
            "Agree keep/fix/drop criteria before rollout so sunk cost cannot decide for you.",
          ],
          steps: [
            "Classify the task's output as low, medium or high cost of error, and write down why.",
            "Set the review depth to match, and name the person who does it.",
            "Confirm the reviewer can actually verify the underlying facts, not just the writing.",
            "Write the one-page policy covering uses, prohibited inputs, review roles, attribution and reporting.",
            "Schedule a monthly deep re-check of ten recent outputs regardless of current review level.",
            "Agree the keep/fix/drop criteria and book the two-week review before rollout.",
          ],
          checklist: [
            "The cost of error is written down, in money or in trust.",
            "Review depth matches that cost, and the reviewer is named.",
            "The reviewer can verify the source facts, not just the output's readability.",
            "The policy is one page and every team member has read it.",
            "Prohibited inputs are specific to this business, not generic.",
            "Reporting a bad output is explicitly blame-free, in writing.",
            "The two-week review is booked with criteria agreed in advance.",
          ],
          worksheet: [
            "For your chosen task: what would a wrong output actually cost, in money and in client trust?",
            "Who will review it, and can they genuinely verify the facts behind the output?",
            "What must never be pasted into an AI tool in your business? List it specifically.",
            "If someone on your team sent a client a wrong AI-generated answer tomorrow, would they tell you? Honestly?",
          ],
          prompts: [
            {
              name: "Draft a one-page AI usage policy",
              prompt: `Draft a one-page AI usage policy for my team.

Business: [WHAT WE DO]. Team size: [NUMBER].
Tasks we use AI for: [LIST THEM SPECIFICALLY]
Sensitive data we handle: [CLIENT DATA, FINANCIALS, NDA MATERIAL, ETC.]
Regulatory context, if any: [DESCRIBE OR SAY NONE]

Cover: what we use AI for (specific tasks, not "productivity"), what must never be entered into an AI tool, who reviews what and at what depth, whether we disclose AI assistance to clients and when, and who to tell when something goes wrong — stated as explicitly blame-free.

One page maximum. Plain language. No legal boilerplate. Write it so someone reads it once and remembers the three things that matter.`,
            },
            {
              name: "Design the review step",
              prompt: `Help me design the review step for an AI-assisted task.

The task: [DESCRIBE]
The output and who sees it: [DESCRIBE]
What a wrong answer would cost: [MONEY, TRUST, LEGAL]
Who is available to review: [ROLES]

Recommend the review depth and justify it. Specify exactly what the reviewer checks, in a list they could follow in under two minutes. Tell me how the reviewer verifies the underlying facts rather than just judging the writing. Then tell me what will most likely go wrong with this review step in month three, and what to put in place now to prevent it.`,
            },
          ],
          practice: [
            "Write your one-page policy today and read it aloud to one team member. Every place they look puzzled is a place to rewrite.",
            "Take ten recent AI-assisted outputs from your team and review them properly. Report the failure rate to the team without blaming anyone.",
          ],
          table: {
            fileLabel: "Automation register",
            columns: [
              "Task",
              "Prompt version",
              "Owner",
              "Cost of error",
              "Review depth",
              "Reviewer",
              "Live since",
              "Time saved per run",
              "Runs per week",
              "Last deep re-check",
            ],
            sampleRows: [
              ["Reformat supplier quotes", "v1.3", "A. Boateng", "Low — internal", "Spot check 1 in 10", "A. Boateng", "2026-06-15", "12 min", "30", "2026-08-01"],
              ["Draft delivery-delay emails", "v2.1", "S. Whitfield", "Medium — client-facing, revisable", "Named reviewer reads all", "S. Whitfield", "2026-07-02", "9 min", "18", "2026-08-01"],
              ["Generate client quotes", "v1.0", "E. Attah", "High — client acts on the number", "Two-person sign-off", "E. Attah + finance", "2026-07-28", "20 min", "12", "2026-08-01"],
            ],
          },
        },
      ],
      quiz: {
        title: "Module 2 check: building it safely",
        passMark: 70,
        maxAttempts: 3,
        questions: [
          {
            prompt: "Which four parts make a prompt behave consistently?",
            type: "MULTI",
            explanation:
              "Role and context, delimited inputs, constraints, and an exact output format. " +
              "Constraints are where most weak prompts are thin.",
            choices: [
              "*Role and context, in two sentences or fewer",
              "*Inputs, explicitly delimited",
              "*Constraints, including what must never appear",
              "*An exact output format",
            ],
          },
          {
            prompt: "What is the instruction most often missing from a production prompt?",
            explanation:
              "What to do when the input is inadequate. Without it you get a confident answer " +
              "built on nothing — the failure most likely to reach a client.",
            choices: [
              "*What to do when the input is inadequate",
              "A request to be concise",
              "An instruction to be polite",
              "A word limit",
            ],
          },
          {
            prompt: "A client-facing quote is generated with AI assistance. What review depth applies?",
            explanation:
              "High cost of error — the client acts on the number. Two-person sign-off, with " +
              "a reviewer who can check the source data.",
            choices: [
              "*Two-person sign-off, with a reviewer able to verify the source data",
              "Spot check one in ten",
              "No review; the prompt was tested",
              "Review only the first month",
            ],
          },
          {
            prompt: "Why must reporting a bad AI output be explicitly blame-free?",
            explanation:
              "Because if reporting is punished, people stop reporting, and you find out about " +
              "failures from a client instead of from your team.",
            choices: [
              "*Otherwise people stop reporting and you hear about failures from clients",
              "It is a regulatory requirement in all jurisdictions",
              "It reduces the cost of insurance",
              "It makes the policy shorter",
            ],
          },
        ],
      },
      assignment: {
        title: "Ship one automation with its safety net",
        briefMd: `
Take the task you chose in Module 1 and put it into production properly.

1. **The prompt**, built with all four parts, versioned, including the
   inadequate-input instruction.
2. **The test results**: ten real past cases, scored pass or fail, and the constraints
   you added in response to the failures. Show the before and after.
3. **The review step**: the cost of error written down, the review depth chosen, the
   named reviewer, and how that reviewer verifies the underlying facts.
4. **Your one-page AI policy.**
5. **The measurement plan**: what you are measuring, the before figure, and the
   keep/fix/drop criteria agreed *in advance*.

The test results are the part that matters. A submission where all ten passed first
time usually means the test cases were too easy — pick harder ones.
        `.trim(),
        deliverables: [
          "A versioned prompt with all four parts and the inadequate-input instruction",
          "Ten real test cases scored, with the constraints added in response to failures",
          "A review step with cost of error, depth, named reviewer and verification method",
          "A one-page AI usage policy",
          "A measurement plan with a before figure and pre-agreed keep/fix/drop criteria",
        ],
        points: 150,
        dueInDays: 14,
      },
    },
  ],

  finalQuiz: {
    title: "AI-Powered Operations — final assessment",
    description: "Five questions across auditing, choosing, prompting and safety.",
    passMark: 75,
    timeLimitMinutes: 15,
    maxAttempts: 3,
    questions: [
      {
        prompt: "What profile should your first automation have?",
        explanation:
          "High frequency, low judgement, low cost of error. It is boring on purpose — you " +
          "are building review habits where mistakes are cheap.",
        choices: [
          "*High frequency, low judgement, low cost of error",
          "The task the team finds most frustrating",
          "The most complex task, for the biggest payoff",
          "Whatever is most visible to clients",
        ],
      },
      {
        prompt: "Which of these should be left alone as first automation candidates?",
        type: "MULTI",
        explanation:
          "Anything client-facing without a review step, rules that exist only in someone's " +
          "head, regulated output, and anything happening fewer than five times a week.",
        choices: [
          "*Client-facing output with no review step in place",
          "*Tasks whose rule has never been written down",
          "*Regulated or legally binding output",
          "*Tasks occurring fewer than five times a week",
        ],
      },
      {
        prompt: "How many real examples should a prompt be tested on before production?",
        explanation:
          "Ten real past cases where you already know the right answer — then add one " +
          "constraint per observed failure and repeat.",
        choices: [
          "*Ten real past cases where you already know the correct answer",
          "One, if it works well",
          "Three invented examples",
          "Testing is unnecessary if the prompt is detailed",
        ],
      },
      {
        prompt: "What does 'nobody approves output they cannot verify' mean in practice?",
        explanation:
          "A reviewer who cannot check the underlying facts is rubber-stamping — the process " +
          "has a hole exactly where the safety was supposed to be.",
        choices: [
          "*A reviewer who cannot check the source facts is rubber-stamping, not reviewing",
          "Only managers may approve AI output",
          "All output must be approved twice",
          "Output must include its sources in every case",
        ],
      },
      {
        prompt: "Once a prompt is stable, review depth can safely be reduced permanently.",
        type: "TRUE_FALSE",
        explanation:
          "Review naturally drifts lighter as confidence grows, which is how the eventual " +
          "failure happens. Schedule a fixed monthly deep re-check regardless.",
        choices: ["True", "*False"],
      },
    ],
  },

  capstone: {
    title: "Capstone: your operations automation plan",
    briefMd: `
One document, no more than three pages, that a new operations lead could pick up and
run.

1. **Where the time goes.** Your audit summary: hours by category, top ten tasks.
2. **What you deleted.** The task that existed out of habit, and what happened when
   it stopped.
3. **What is live.** The one automation you shipped: the prompt version, the review
   step, the reviewer, and the measured before-and-after including review time.
4. **What is next.** Your two following candidates with their scores, and why they
   are in that order.
5. **The rules.** Your one-page policy, and your monthly deep re-check schedule.

Close with a short paragraph on **what you got wrong**. Something in the audit, the
scoring, or the testing did not go the way you expected. That paragraph is worth more
to your team than the rest of the document.
    `.trim(),
    deliverables: [
      "A time audit summary with hours by category and top ten tasks",
      "The deleted task and the outcome of stopping it",
      "One live automation with prompt version, review step and measured before/after",
      "Two next candidates, scored and ordered with justification",
      "A one-page policy and a monthly deep re-check schedule",
      "A paragraph on what you got wrong",
    ],
    points: 200,
    dueInDays: 21,
  },
};
