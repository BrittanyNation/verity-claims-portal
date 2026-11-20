# Verity Claims Portal

A fully functional member claims portal for Verity, a fictional health plan. Built as an original portfolio sample by Brittany Nation. Verity is fictional, no affiliation with any real health plan is claimed, and no real health or payment information should be entered anywhere on the site. All sample data lives only in the visitor browser via localStorage.

Live site: https://brittanynation.github.io/verity-claims-portal/

## What it does

**My Claims (index.html)**
- 12 sample claims rendered from data, with status chips for All, Paid, In Review, Denied, and Pending Info
- Live search by provider, service, or claim number, plus four sort orders and a live result count with an honest empty state
- Summary stats computed from the claim data on every render: total claims, plan paid, you may owe, open claims
- Claim detail view with a billed, allowed, paid, and owe breakdown, a paid percent bar, a three step status timeline, and plain word notes for denied and pending claims
- Ask About This Claim carries the claim number into the Ask or Appeal page through localStorage

**Ask or Appeal (submit.html)**
- Validated form for a question, an appeal, or a document send: full name, email format, claim number in VC-2026-0000 format, date of service that cannot be in the future, and a message of at least 20 characters, each with its own inline error
- A successful send ends in a confirmation with a generated VC-A-XXXXX reference, saved to localStorage
- Submission list with lookup by reference, claim number, or word, and a one click withdraw that updates the status

**Help and Glossary (help.html)**
- 8 term searchable glossary with a live count and empty state
- Six FAQ accordions that open one at a time
- Support hours table with today highlighted
- Validated callback request ending in a VC-C-XXXXX reference, and a duplicate aware Verity Letter signup

## How it is built

Plain HTML, CSS, and JavaScript with no build step, so GitHub Pages serves it as is. The JavaScript is commented step by step as study code from the post-course combined skills practice that followed Dr. Angela Yu Full-Stack Web Development Bootcamp: data driven rendering, derived state where filtered lists and all totals are computed and never stored twice, option and status driven views, and validated forms ending in generated references. All content photography is real Pexels photography downloaded into images/ and referenced locally.

Palette: slate navy #223140, warm clay #C4664A, sand #E8DDC9, warm paper #FBF7F0, sage #7A8B7A, gold #C9A86A, ink #22201D.

## Roles this supports

Claims Examiner, Claims Operations, Prebill Specialist, Subrogation Specialist, Technical Writer, and Front-End Developer applications, by evidencing claims workflow knowledge (billed, allowed, paid, owe, denial and appeal handling, prior authorization vocabulary) in a coded, working front end with real written content.
