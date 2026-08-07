# JI Global Academy

The learning platform for JI Consultation. Student registration, a course
catalog, a lesson player with a downloadable working pack for every lesson,
progress tracking, quizzes, marked assignments, verifiable certificates, a
community, and a payment gateway.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS 4 and Prisma. It
runs with **zero infrastructure** — SQLite and a mock payment provider by
default — and moves to Postgres and Stripe/Paystack by changing environment
variables.

---

## Quick start

```bash
npm install
cp .env.example .env          # then set SESSION_SECRET
npm run setup                 # generate client, create the database, seed it
npm run dev                   # http://localhost:3000
```

`npm run setup` seeds four complete courses, generates **124 downloadable
documents**, and creates five learners at different stages so every screen has
something real on it.

Seeded sign-ins (from your `.env`):

| Role       | Email                        | Password        |
| ---------- | ---------------------------- | --------------- |
| Student    | `student@example.com`        | `Student!2345`  |
| Admin      | `admin@jiglobalacademy.com`  | `Academy!2345`  |
| Instructor | `adaeze.nwosu@jiglobalacademy.com` | `Instructor!2345` |

The student account has one course finished with a certificate, one about a
third of the way through, and one just started.

---

## What is built

### Foundation

| Feature | Where |
| --- | --- |
| Student registration & sign-in | `src/server/actions/auth.ts`, `src/app/(auth)/` |
| Dashboard | `src/app/dashboard/page.tsx` |
| Course catalog | `src/app/courses/page.tsx` |
| Progress tracking | `src/lib/progress.ts` |
| Certificates | `src/app/certificates/`, `src/components/certificate-sheet.tsx` |
| Community | `src/app/community/` |
| Assignments | `src/app/courses/[slug]/assignments/[assignmentId]/` |
| Quizzes | `src/app/courses/[slug]/quizzes/[quizId]/`, `src/lib/quiz.ts` |
| Payment gateway | `src/lib/payments.ts`, `src/app/api/payments/confirm/` |

### Course structure

Every course carries a welcome video and overview, then modules of lessons,
each lesson with its own download pack, a quiz and an assignment per module,
and a final quiz plus a capstone before the certificate is issued.

```
Course
├── Welcome video + overview (outcomes, requirements, instructor)
├── Module
│   ├── Lesson → body, video, download pack
│   ├── Module quiz      (best attempt counts, retakeable)
│   └── Module assignment (marked, with written feedback)
├── Final quiz
├── Capstone assignment
└── Certificate (issued automatically, publicly verifiable)
```

### Downloads

Every lesson ships a pack. Which documents appear depends on what the lesson
author filled in:

| Type | Format | Generated from |
| --- | --- | --- |
| PDF notes | PDF | summary + key points + steps |
| Checklist | PDF | `checklist` |
| SOP | PDF | `steps` (3 or more) |
| Template | CSV or Markdown | `table`, else `steps` |
| Worksheet | Markdown | `worksheet` |
| Prompt library | Markdown | `prompts` |
| Practice exercises | Markdown | `practice` |

They are **generated from the same authored source as the lesson**
(`prisma/content/`), so a worksheet can never drift out of sync with the video
it belongs to. The PDFs are produced by a small dependency-free writer
(`src/lib/pdf.ts`) — no headless browser, no font embedding.

---

## How it works

### Progress and completion

A course is made of three kinds of completable item: lessons, quizzes and
assignments. Progress is the share of those a learner has finished, so the
number on the dashboard always maps to something they can point at.

- **Lesson** — marked complete by the learner
- **Quiz** — best attempt at or above the pass mark (a bad first attempt costs
  nothing)
- **Assignment** — submitted, and not returned for rework

When the last item lands, the enrolment flips to `COMPLETED` and the
certificate is issued in the same transaction. `recomputeEnrollment()` is
called after every action that could change completion, and certificate
issuance is idempotent.

### Access control

Course material is **never** served from `public/`. Downloads live under
`content/` and are streamed by `/api/resources/[id]`, which re-checks enrolment
on every request and records the download. Lessons flagged `isPreview` are the
only material an anonymous visitor can reach — that is what makes the catalog
taster honest.

`src/lib/access.ts` is the single place that answers "is this person allowed to
see this?", so pages, server actions and the download route cannot drift apart.

### Payments

`src/lib/payments.ts` defines a two-method gateway interface — start a
checkout, verify a charge — with three implementations:

- **`mock`** (default) — no keys, no network. Redirects to a local page that
  imitates a hosted card form, so the flow you demo is the flow that runs in
  production.
- **`stripe`** — Checkout Sessions.
- **`paystack`** — transaction initialisation, for NGN/GHS/ZAR/KES.

Switch with `PAYMENTS_PROVIDER`. No application code changes.

Enrolment is granted **only** after `verify()` confirms the charge
server-to-server and the amount matches the order — never on the redirect back
from the provider, which anyone can visit. Replaying a confirm URL cannot
double-enrol.

### Security notes

- Sessions are HS256 JWTs in an `httpOnly`, `sameSite=lax` cookie; `secure` in
  production. Passwords are bcrypt at cost 12.
- Sign-in returns one message for "no such account" and "wrong password", and
  spends the same time either way, so the form cannot enumerate accounts.
- Prices come from the database, never from the submitted form.
- Markdown is escaped before any formatting is re-introduced
  (`src/lib/markdown.ts`), and `javascript:`/`data:` links are dropped, so
  learner-authored community posts cannot inject markup.
- Quiz grading (`src/lib/quiz.ts`) ignores choice ids that do not belong to the
  question and de-duplicates selections, so a hand-crafted form post cannot
  inflate a score. A question scores only when the selected set exactly matches
  the correct set.
- Stored file paths are resolved against the content root and anything escaping
  it is refused.

---

## Authoring a course

Courses are TypeScript data, not database fixtures — reviewable in a pull
request and diffable.

```
prisma/content/
├── types.ts              # the authoring format
├── resource-builder.ts   # turns a lesson into its download pack
├── community.ts          # seed conversations
└── courses/
    ├── orientation.ts
    ├── consulting-foundations.ts
    ├── client-acquisition.ts
    └── ai-operations.ts
```

A lesson looks like this — fill in an array, get a document:

```ts
{
  slug: "pricing-the-outcome",
  title: "Pricing the outcome, not the hours",
  summary: "Why the day rate caps your income…",
  durationMinutes: 24,
  body: "## What the day rate actually does…",   // Markdown
  keyPoints: [...],   // → PDF notes
  steps: [...],       // → SOP + template
  checklist: [...],   // → checklist PDF
  worksheet: [...],   // → worksheet
  prompts: [...],     // → prompt library
  practice: [...],    // → practice exercises
  table: {...},       // → CSV template
}
```

In a quiz, the correct choices are marked with a leading `*`:

```ts
choices: [
  "*It caps income at your available hours",
  "It is illegal in most jurisdictions",
]
```

Add the course to `prisma/content/courses/index.ts` and re-run `npm run db:seed`.

---

## Going to production

1. **Postgres.** Change `provider` in `prisma/schema.prisma` to `postgresql`
   and set `DATABASE_URL`. Every column already uses portable scalar types —
   SQLite has no enums or arrays, so status columns are strings validated in
   `src/lib/enums.ts` and list columns hold JSON.
2. **Secrets.** Set `SESSION_SECRET` (`openssl rand -base64 48`). The app
   refuses to start in production without it.
3. **`APP_URL`.** Read at runtime, unlike `NEXT_PUBLIC_*` which is inlined at
   build time — so one image can be deployed to staging and production.
4. **Payments.** Set `PAYMENTS_PROVIDER` and the matching keys.
5. **File storage.** `src/lib/content-store.ts` is the only module that touches
   disk. Point it at S3/R2 by reimplementing its four functions.
6. **Video.** Lesson and welcome video URLs are stored per lesson; drop in your
   host's player where the placeholder renders.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | `prisma generate` then a production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` — the gate that must stay green |
| `npm run setup` | Generate, push schema, seed |
| `npm run db:seed` | Re-seed (safe to re-run; clears first) |
| `npm run db:reset` | Drop and recreate the schema |
| `npm run db:studio` | Prisma Studio |

## Verified

Checked against a production build driven through a real browser:

- Registration → auto-enrolment in the free orientation course → dashboard
- Lesson completion advancing progress, and the dashboard reflecting it
- Quiz submission, scoring, explanations on wrong answers, and retakes
- Paid checkout → gateway → verified confirmation → enrolment unlocked
- Community thread creation and replies
- Assignment submission
- A full course completed end to end, issuing a certificate that verifies
  publicly
- Download gating: anonymous users get preview material only (`200`), paid
  material is refused (`401`), and an enrolled learner from a different course
  is refused (`403`)
