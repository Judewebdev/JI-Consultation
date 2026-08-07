import type { CourseSpec } from "../types";

/**
 * The free front door to the academy. Short, finishable in one sitting, and
 * it teaches people how to use the platform — which cuts support questions
 * and gets learners to their first certificate quickly.
 */
export const orientationCourse: CourseSpec = {
  slug: "academy-orientation",
  title: "Academy Orientation",
  subtitle: "How to get real results from JI Global Academy in your first two weeks",
  description:
    "A short, free course that shows you how the academy works and, more importantly, " +
    "how to study in a way that actually changes what you do on Monday morning. You will " +
    "set a goal, plan your weeks, learn how the downloads and assignments fit together, " +
    "and meet the community. Most people finish it in under an hour.",
  category: "Getting started",
  level: "BEGINNER",
  priceCents: 0,
  estimatedHours: 1,
  featured: true,
  welcomeVideoUrl: "https://cdn.jiglobalacademy.com/welcome/orientation.mp4",
  welcomeVideoNote:
    "A two-minute hello from the JI Consultation team: who the academy is for, what we " +
    "expect from you, and what you can expect from us.",
  outcomes: [
    "Set one specific outcome for your studies instead of a vague intention",
    "Know exactly how modules, lessons, downloads, assignments and quizzes fit together",
    "Build a weekly study rhythm you can hold down alongside a full workload",
    "Get useful answers from the community instead of silence",
    "Earn your first certificate and see how verification works",
  ],
  requirements: [
    "About an hour",
    "Something to write with — the worksheets are the point, not the videos",
  ],
  passMark: 70,

  courseResources: [
    {
      kind: "CHECKLIST",
      title: "First two weeks — setup checklist",
      description: "Everything to get in place before you start your first paid course.",
      sections: [
        {
          heading: "Before your first lesson",
          items: [
            "Write down the one outcome you want from the academy this quarter.",
            "Block two study sessions a week in your calendar, with a named start time.",
            "Download the notes pack for the first module and skim it before watching.",
            "Introduce yourself in the community — one post, three sentences.",
          ],
        },
        {
          heading: "After every lesson",
          items: [
            "Tick the lesson complete so your progress stays honest.",
            "Save the downloads into your own working folder, not your downloads folder.",
            "Write one sentence: what will I do differently because of this?",
          ],
        },
        {
          heading: "End of week one",
          items: [
            "Submit at least one assignment, even if it is not perfect.",
            "Answer one other learner's question in the community.",
            "Review your goal — is it still the right one?",
          ],
        },
      ],
    },
  ],

  modules: [
    {
      title: "Getting oriented",
      summary: "What the academy is for, and how to use it without wasting your time.",
      lessons: [
        {
          slug: "welcome-to-the-academy",
          title: "Welcome, and what this is really for",
          summary:
            "Why JI Global Academy exists, who it is for, and the one rule that separates " +
            "learners who change their business from learners who collect certificates.",
          durationMinutes: 8,
          isPreview: true,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/orientation-welcome.mp4",
          body: `
## The problem this academy exists to solve

Most business training fails in the same place. Not at the point of teaching — the
teaching is usually fine — but at the point of **application**. People watch, they
nod, they feel informed, and then Monday arrives and nothing about how they work
has changed.

We have built this academy around that failure point. Every lesson here ends in a
thing you do, not a thing you know.

## How that shows up in the design

- Every lesson ships with **downloads you use while working**, not reading material.
- Every module ends with an **assignment against your own business**, not a case study.
- Quizzes are there to catch misunderstandings early, not to award points.
- The certificate is issued when you have done the work, not when you have watched
  the videos.

> If you only do one thing differently after this course: fill in the worksheets as
> you go, not afterwards. The learners who finish are almost always the ones who
> wrote something down in week one.

## Who this is for

Owner-operators, consultants and small-team leaders who are doing the work
themselves and need systems that survive contact with a busy week. If you are
looking for theory, there are better places. If you want a process you can hand to
someone else by Friday, you are in the right room.
          `.trim(),
          keyPoints: [
            "Training fails at application, not at explanation — so the work is the point, not the video.",
            "Every lesson gives you something to use while working: notes, a checklist, a template, an SOP.",
            "Assignments are done against your own business, which is why they are worth doing.",
            "Certificates are issued on completed work, so they mean something to the person reading them.",
          ],
          checklist: [
            "I can state, in one sentence, what I want to be different in 90 days.",
            "I have somewhere to keep the downloads that is not my downloads folder.",
            "I have blocked two study sessions in my calendar this week.",
            "I know where the community is and I have read the pinned post.",
          ],
          worksheet: [
            "What is the specific, uncomfortable problem in your business that made you sign up?",
            "If that problem were solved, what would be measurably different in 90 days? Give a number.",
            "What have you tried already, and why did it not stick?",
            "Who else in your business needs to change how they work for this to succeed?",
          ],
          practice: [
            "Write your 90-day outcome as a single sentence containing one number and one date. Then cut it to under 20 words.",
            "Open your calendar and put two 45-minute study blocks in it for the next two weeks. Give them a name that is not 'study'.",
          ],
        },
        {
          slug: "how-the-platform-works",
          title: "How courses, downloads and assessment fit together",
          summary:
            "A tour of the moving parts: modules, lessons, the download pack, assignments, " +
            "quizzes and how progress is actually calculated.",
          durationMinutes: 10,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/orientation-platform.mp4",
          body: `
## The shape of a course

Every course follows the same structure, so once you have done one you know how to
do all of them:

1. A **welcome video** and course overview — what you will be able to do at the end.
2. **Modules**, each covering one capability.
3. **Lessons** inside each module, each with its own download pack.
4. A **module quiz** to catch misunderstandings while they are still cheap to fix.
5. A **module assignment** applying the work to your business.
6. A **final quiz** and a **capstone**, then your certificate.

## How progress is calculated

Your progress bar is not "videos watched". It counts three kinds of item:

- Lessons you have marked complete
- Quizzes where your **best attempt** met the pass mark
- Assignments you have submitted and not had returned for rework

The percentage is simply how many of those you have finished. A course is complete
when all of them are done — which is why you cannot get to 100% by watching alone.

## The download pack

Each lesson carries some combination of PDF notes, a checklist, a template, an SOP,
a worksheet, a prompt library and practice exercises. They are generated from the
same source as the lesson, so they never contradict the video.

They are also **access-controlled**: they are not sitting at a public URL. That
protects your work and ours.
          `.trim(),
          keyPoints: [
            "Course → modules → lessons, with a quiz and an assignment at the end of each module.",
            "Progress counts lessons completed, quizzes passed and assignments cleared — not minutes watched.",
            "Quizzes take your best attempt, so a bad first run costs you nothing but time.",
            "Downloads are generated from the same source as the lesson, so they never drift out of sync.",
            "Course material is access-controlled, not public — it is tied to your enrolment.",
          ],
          steps: [
            "Open the course and watch the welcome video before anything else — it tells you what the end state looks like.",
            "Read the course overview and the outcomes list, and decide which module matters most to you.",
            "Work through lessons in order, downloading the pack before you watch rather than after.",
            "Take the module quiz as soon as you finish the module, while the material is fresh.",
            "Submit the module assignment before moving on, even if you are not happy with it.",
          ],
          checklist: [
            "I have watched the welcome video for my current course.",
            "I have downloaded the pack for the lesson I am about to start.",
            "I mark each lesson complete as I finish it.",
            "I take the module quiz before starting the next module.",
            "I have submitted every assignment for the modules I have finished.",
          ],
          practice: [
            "Open any course in the catalog, find its final quiz pass mark, and note how many attempts you get.",
            "Download one lesson pack and open every file in it. Decide which of the seven formats you will actually use.",
          ],
        },
      ],
      quiz: {
        title: "Module 1 check: how the academy works",
        description: "Four questions on the structure and how progress is measured.",
        passMark: 70,
        maxAttempts: 5,
        questions: [
          {
            prompt: "How is your progress percentage in a course calculated?",
            explanation:
              "Progress counts completable items — lessons, quizzes and (where required) " +
              "assignments — so it always maps to something you can point at.",
            choices: [
              "*By the share of lessons, passed quizzes and cleared assignments you have finished",
              "By the number of minutes of video you have watched",
              "By how many days you have been enrolled",
              "By the number of downloads you have opened",
            ],
          },
          {
            prompt: "You score 45% on a module quiz at the first attempt. What happens?",
            explanation:
              "Quizzes record your best attempt. A weak first run costs you nothing except " +
              "the time to go back over the material.",
            choices: [
              "*Nothing is lost — retake it, and your best attempt is the one that counts",
              "The module is locked permanently",
              "Your course progress is reduced",
              "You have to re-enrol in the course",
            ],
          },
          {
            prompt: "Which of these are true of the lesson download pack?",
            type: "MULTI",
            explanation:
              "The packs are generated from the same authored source as the lesson, and " +
              "they are served through an access check rather than from a public folder.",
            choices: [
              "*It is generated from the same source as the lesson, so it cannot contradict the video",
              "*It is access-controlled and tied to your enrolment",
              "It is emailed to you as a single zip at the end of the course",
              "It is only available after you pass the module quiz",
            ],
          },
          {
            prompt:
              "According to the lesson, the point at which most business training fails is the point of application, not explanation.",
            type: "TRUE_FALSE",
            explanation:
              "That failure point is the reason the academy is built around assignments and " +
              "working documents rather than lectures.",
            choices: ["*True", "False"],
          },
        ],
      },
      assignment: {
        title: "Set your 90-day outcome",
        briefMd: `
Before you spend money on a course, be clear about what you are buying it for.

Write a short brief — no more than a page — covering:

1. **The problem.** What specifically is not working in your business right now? Be
   concrete. "Marketing is weak" is not concrete. "We get 4 enquiries a month and
   need 12" is.
2. **The 90-day outcome.** One sentence, with a number and a date in it.
3. **The constraint.** What is the real limit — time, money, people, skill? Name the
   one that bites hardest.
4. **The first move.** What will you do in the next seven days, regardless of which
   course you take?

Do not write this to impress anyone. A vague brief here produces vague work for the
next three months.
        `.trim(),
        deliverables: [
          "A one-page brief covering problem, 90-day outcome, constraint and first move",
          "Your 90-day outcome stated in a single sentence with a number and a date",
        ],
        points: 100,
        dueInDays: 7,
      },
    },

    {
      title: "Study habits and the community",
      summary: "How to keep going after the initial enthusiasm wears off.",
      lessons: [
        {
          slug: "building-a-study-rhythm",
          title: "Building a rhythm you can hold down",
          summary:
            "The realistic version of studying alongside a full workload: short sessions, " +
            "fixed times, and a rule for what happens when you miss one.",
          durationMinutes: 9,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/orientation-rhythm.mp4",
          body: `
## Enthusiasm is not a plan

Almost everyone starts strong. The dropout point is week three, when the novelty is
gone and the week is busy. The people who get through are not more disciplined —
they have made the sessions smaller and more predictable.

## What works

**Two sessions a week, 45 minutes each, at a fixed time.** Not "when I get a
chance". A named slot in the calendar that other things have to work around.

**Download first, watch second.** Have the worksheet open while the video plays.
The point is to be filling something in, not to be receiving.

**One sentence at the end of every session.** What will I do differently? If you
cannot answer it, the session did not land, and you should redo it rather than
push on.

## The rule for missed sessions

You will miss sessions. The rule is: **never miss two in a row.** One missed session
is a busy week. Two is the start of stopping. If you miss one, the next one is
non-negotiable, even if you only manage twenty minutes.

## Working with a colleague

If you can get one other person in your business doing the same course, do it. Not
for accountability theatre — because the assignments get much better when two people
who know the business argue about the answer.
          `.trim(),
          keyPoints: [
            "The dropout point is week three, when novelty runs out — plan for that week, not week one.",
            "Two fixed 45-minute sessions a week beats an open-ended intention to 'study more'.",
            "Have the worksheet open while you watch; passive watching is the failure mode.",
            "Never miss two sessions in a row — one is a busy week, two is quitting.",
            "Doing the course with a colleague makes the assignments materially better.",
          ],
          steps: [
            "Pick two slots in your week and name them in your calendar after the outcome, not after the activity.",
            "Set up one folder for academy work, with a subfolder per course, before your first session.",
            "At the start of each session, download the lesson pack and open the worksheet.",
            "At the end of each session, write the one sentence: what will I do differently?",
            "If you miss a session, move it rather than skip it, and protect the next one absolutely.",
          ],
          checklist: [
            "Two named study slots exist in my calendar for the next four weeks.",
            "I have a single folder where all academy work lives.",
            "I open the worksheet before I press play, not after.",
            "I finish every session with one written sentence about what changes.",
            "I have a rule for missed sessions and I have told someone what it is.",
          ],
          worksheet: [
            "Which two 45-minute slots in your week are genuinely defensible? Name the days and times.",
            "What will most likely cause you to miss them, and what is your response when it happens?",
            "Who in your business should be doing this course with you, and what stops them?",
            "Where will the downloads live, and who else needs access to that folder?",
          ],
          practice: [
            "Do a 20-minute dry run right now: open a lesson, download the pack, fill in the first worksheet question, and write your one sentence.",
            "Write your missed-session rule on one line and put it at the top of your academy folder as a text file.",
          ],
          table: {
            fileLabel: "Weekly study plan",
            columns: ["Week", "Session 1 (day/time)", "Session 2 (day/time)", "Module target", "Assignment due", "Done"],
            sampleRows: [
              ["1", "Tue 07:30", "Thu 07:30", "Orientation M1", "90-day outcome brief", "yes"],
              ["2", "Tue 07:30", "Thu 07:30", "Orientation M2", "Community intro", ""],
              ["3", "Tue 07:30", "Sat 09:00", "Course 1, Module 1", "Positioning statement", ""],
              ["4", "Tue 07:30", "Thu 07:30", "Course 1, Module 2", "Offer teardown", ""],
            ],
          },
        },
        {
          slug: "using-the-community",
          title: "Getting useful answers from the community",
          summary:
            "How to ask a question that gets a real answer, and why answering other " +
            "people's questions is the fastest way to consolidate what you have learned.",
          durationMinutes: 7,
          videoUrl: "https://cdn.jiglobalacademy.com/lessons/orientation-community.mp4",
          body: `
## Why most questions get no reply

Not because people are unhelpful. Because the question is unanswerable. "How do I
get more clients?" has no reply that is worth anyone's time to write.

A question gets answered when the person reading it can see what you have already
tried and what specifically went wrong.

## The four-line question

Use this shape and your reply rate goes up sharply:

1. **Context.** What kind of business, what size, what market. One line.
2. **What you tried.** The actual thing you did, with numbers if you have them.
3. **What happened.** The result, not your interpretation of it.
4. **The specific question.** One question, not four.

## Answer more than you ask

The fastest way to find out whether you have understood something is to try to
explain it to someone who has not. If you can answer one question a week in the
community, you will retain more of this course than someone who reads it twice.

## Share the work, not just the wins

Post the assignment you were not sure about. The feedback on a mediocre first draft
is worth more than applause for a polished one.
          `.trim(),
          keyPoints: [
            "Unanswerable questions get no answers — specificity is what earns a reply.",
            "Use the four-line shape: context, what you tried, what happened, one specific question.",
            "Answering other people's questions consolidates your own understanding faster than rereading.",
            "Post work you are unsure about; feedback on a rough draft beats applause for a polished one.",
          ],
          steps: [
            "Before posting, write the four lines separately: context, what you tried, what happened, the question.",
            "Cut your question down to one question — if there are two, post two threads.",
            "Include real numbers wherever you have them, even if they are embarrassing.",
            "Tag the thread with the right category so the people who can help actually see it.",
            "Come back and post what happened after you acted on the advice.",
          ],
          checklist: [
            "My post says what kind of business this is and roughly how big.",
            "My post says what I actually tried, not what I intended to try.",
            "My post contains exactly one question.",
            "I have included numbers where I have them.",
            "I have answered at least one other person's question this week.",
          ],
          prompts: [
            {
              name: "Sharpen a vague question before posting",
              prompt: `I want to ask a question in a business course community, but my draft is too vague to answer.

My draft: [PASTE YOUR DRAFT QUESTION]

Context about my business: [INDUSTRY, SIZE, MARKET, HOW LONG TRADING]
What I have already tried: [WHAT YOU DID, WITH NUMBERS]
What actually happened: [THE RESULT]

Rewrite this as a four-line post: context, what I tried, what happened, one specific question. Then list the two or three facts I have left out that someone would need in order to answer me properly.`,
            },
            {
              name: "Draft a reply to someone else's question",
              prompt: `Someone in my course community asked this:

[PASTE THEIR QUESTION]

My relevant experience: [WHAT YOU HAVE ACTUALLY DONE IN THIS AREA]

Help me draft a reply that is genuinely useful. Rules: be concrete, say what I would do and why, flag where my experience does not transfer to their situation, and do not pad it with encouragement. Keep it under 200 words.`,
            },
          ],
          worksheet: [
            "What is the one question about your business you would most like a straight answer to?",
            "Rewrite it using the four-line shape. What did you have to admit that you had left out?",
            "Which part of this course could you already explain to a colleague without notes?",
            "What piece of your own work are you avoiding sharing, and what does that tell you?",
          ],
          practice: [
            "Post one introduction in the community: who you are, what your business does, and your 90-day outcome. Three sentences.",
            "Find an unanswered question in the community and write a reply, even if your answer is 'here is what I would try and why'.",
          ],
        },
      ],
      quiz: {
        title: "Module 2 check: habits and community",
        description: "Three questions on study rhythm and asking good questions.",
        passMark: 70,
        maxAttempts: 5,
        questions: [
          {
            prompt: "What is the rule for missed study sessions?",
            explanation:
              "One missed session is a busy week; two in a row is how stopping starts. " +
              "The next session after a miss is the one that matters.",
            choices: [
              "*Never miss two in a row",
              "Make up the time at the weekend",
              "Restart the module from the beginning",
              "Reduce your weekly target permanently",
            ],
          },
          {
            prompt: "Which elements make up the four-line community question?",
            type: "MULTI",
            explanation:
              "Context, what you tried, what happened, and one specific question. " +
              "Leaving out what you tried is the most common reason a post gets no reply.",
            choices: [
              "*Context about your business",
              "*What you already tried, with numbers",
              "*What actually happened",
              "*One specific question",
            ],
          },
          {
            prompt: "When should you download the lesson pack?",
            explanation:
              "Before you watch, so you can fill things in as you go. Downloading " +
              "afterwards almost always means never opening it.",
            choices: [
              "*Before watching, so the worksheet is open while you work through the lesson",
              "After watching, as revision material",
              "At the end of the module",
              "Only if you fail the quiz",
            ],
          },
        ],
      },
      assignment: {
        title: "Introduce yourself and publish your plan",
        briefMd: `
Two small pieces of work, both public.

**1. Introduce yourself in the community.** Three sentences: who you are, what your
business does, and the 90-day outcome you wrote in the last assignment. That is it —
resist the urge to write a biography.

**2. Publish your study plan.** Fill in the weekly study plan template from the
"Building a rhythm" lesson for the next four weeks, and paste the first two weeks
into your submission.

The point of making both public is not accountability theatre. It is that a plan you
were willing to show someone is usually a more honest plan than one you kept to
yourself.
        `.trim(),
        deliverables: [
          "A link to your community introduction post",
          "Your first two weeks of the study plan, filled in with real days and times",
        ],
        points: 50,
        dueInDays: 10,
      },
    },
  ],

  finalQuiz: {
    title: "Orientation — final check",
    description:
      "Five questions across the whole course. Pass this and your certificate is issued.",
    passMark: 70,
    timeLimitMinutes: 10,
    maxAttempts: 5,
    questions: [
      {
        prompt: "What makes an academy course count as complete?",
        explanation:
          "Every completable item has to be done: lessons marked complete, quizzes passed, " +
          "and assignments submitted where the course requires them.",
        choices: [
          "*All lessons completed, all quizzes passed, and all required assignments cleared",
          "All videos watched to the end",
          "The final quiz passed, regardless of the rest",
          "Thirty days of enrolment",
        ],
      },
      {
        prompt: "Where should the downloads for a lesson live?",
        explanation:
          "In your own working folder, organised per course — not left in the browser's " +
          "downloads folder where you will never find them again.",
        choices: [
          "*In a dedicated academy folder, organised by course",
          "In your browser's downloads folder",
          "Printed and filed",
          "They should not be downloaded; read them in the browser",
        ],
      },
      {
        prompt: "Which of these are reasons the assignments are done against your own business?",
        type: "MULTI",
        explanation:
          "Applying the method to real constraints is what turns a lesson into a change in " +
          "how you operate — and it surfaces the parts you did not really understand.",
        choices: [
          "*Because applying a method to real constraints is where understanding actually forms",
          "*Because it produces work you can use immediately rather than a case study answer",
          "Because it is easier to grade",
          "Because case studies are not available",
        ],
      },
      {
        prompt: "A certificate is issued as soon as you have watched every video in a course.",
        type: "TRUE_FALSE",
        explanation:
          "Certificates are issued on completed work — lessons, quizzes and assignments — " +
          "which is what makes them worth something to whoever reads them.",
        choices: ["True", "*False"],
      },
      {
        prompt: "What is the most common reason a community question goes unanswered?",
        explanation:
          "It is too vague to answer. Nobody can usefully reply to 'how do I get more " +
          "clients?' without knowing what you have already tried.",
        choices: [
          "*It is too vague — it does not say what was tried or what happened",
          "It was posted at the wrong time of day",
          "It was in the wrong category",
          "It was too long",
        ],
      },
    ],
  },

  capstone: {
    title: "Capstone: your academy plan on one page",
    briefMd: `
Pull the whole course together into a single page you would be willing to show a
business partner.

It should contain:

- **Your 90-day outcome**, in one sentence, with a number and a date.
- **The constraint** that most limits you, named honestly.
- **Which course you are taking next** and why that one rather than the others.
- **Your study rhythm**: the two named slots, and your missed-session rule.
- **One measure** you will check in 90 days to decide whether this worked.

Keep it to one page. If it runs longer, you have not decided anything yet — you have
listed options.
    `.trim(),
    deliverables: [
      "A one-page academy plan covering outcome, constraint, next course, rhythm and measure",
      "The single measure you will check in 90 days, stated as a number",
    ],
    points: 100,
    dueInDays: 14,
  },
};
