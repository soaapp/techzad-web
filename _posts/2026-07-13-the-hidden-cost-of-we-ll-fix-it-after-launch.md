---
title: "The hidden cost of \"we'll fix it after launch\""
author: Ali
---

Every team has said it at least once. A deadline is close, a rough edge appears, and someone offers the reasonable-sounding compromise: "let's ship it and fix it after launch." The intent is good, the pressure is real, and the logic feels sound. In practice, that small phrase often quietly reshapes a product for years, because the fix rarely arrives on the schedule we imagine.

## Why the deferral feels rational

The appeal is easy to understand. Shipping creates momentum, satisfies stakeholders, and turns an abstract plan into something people can actually touch.

This does not imply carelessness. Teams defer work for honest reasons: a hard date, a demo, a customer waiting since last quarter. The problem is not the decision itself. It is that "after launch" is treated as a real point in time, when in most cases it is a hope.

## Where the cost actually hides

The expense of a deferred fix is rarely the fix. It is everything that grows on top of the rough edge while it sits untouched.

- **Workarounds harden into habits.** Someone on support learns to manually correct the export that drops the last row. Six months later, three people do it, nobody remembers why, and the "temporary" step is now part of the process.
- **Assumptions spread outward.** Other features get built against the flawed behaviour. Fixing the original issue now means touching four things that quietly depend on it.
- **Trust erodes in small increments.** A customer who hits the same glitch twice stops filing reports. They do not complain. They just quietly plan their exit.
- **The backlog becomes a graveyard.** "Fix after launch" tickets accumulate faster than they close, and the ones that matter get buried under the ones that shout.

## The math nobody writes down

A defect caught before launch costs a conversation and an afternoon. The same defect caught a year later costs an investigation, a regression test, a coordination meeting, and the memory of three people who have since moved to other projects.

Ironically, the cheap fix we postponed to save time becomes the expensive fix we cannot schedule. The interest compounds silently, and no invoice ever shows the total.

## A more honest way to decide

The goal is not to fix everything before launch. That is its own trap. The goal is to be truthful about what "later" means.

1. **Name the real deadline for the fix.** If it is genuinely next sprint, write the date. If nobody will commit to a date, that tells you it is not getting fixed.
2. **Estimate the cost of waiting, not just the cost of fixing.** Ask who absorbs the rough edge in the meantime, and how many times per day.
3. **Separate polish from risk.** A cosmetic gap can wait. A silent data problem that spreads with every new user cannot.
4. **Assign an owner, not a team.** Work owned by everyone is owned by no one.

Is the deferral buying you a faster launch, or borrowing against a launch you will pay for later with interest?

## The part that matters most

Good teams do ship imperfect things. Craft is not about shipping flawlessly; it is about knowing which imperfections you can live with and being honest when you cannot.

"We'll fix it after launch" is not a plan. It is a promise, and promises deserve dates.
