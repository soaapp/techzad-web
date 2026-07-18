---
title: The hidden cost of "we'll fix it after launch"
author: Ali
---

Every team has said it at least once. The deadline is close, a rough edge shows up in testing, and someone offers the reasonable-sounding compromise: ship now, fix it after launch. The feature works well enough, the calendar is unforgiving, and the fix goes onto a list. That list is where the real cost begins to accumulate, quietly and with interest.

This is not a story about carelessness. Most teams that defer a fix are making a genuine trade under real pressure. But it is worth looking at what the trade actually charges you, because the invoice rarely arrives on launch day.

## Why the deferral feels free

In the moment, postponing a fix looks like the cheapest option on the table. The work is scoped, the workaround is understood, and the ship date is protected. Nothing appears to break.

The problem is that a deferred fix is not a static item on a list. It is a small liability that grows as the system around it changes.

- **The context evaporates.** The engineer who understood the edge case moves to another project. Three months later, the fix costs twice as much because someone has to rediscover why it mattered.
- **Workarounds harden into features.** Support scripts, manual steps, and "just refresh the page" become part of how the product is used. Removing them later feels like a regression to the people who adapted.
- **Trust erodes at the edges.** Users rarely file a ticket for a small annoyance. They simply lower their expectations, and quietly tell a colleague the tool is a bit flaky.

## The compounding nobody budgets for

Ironically, the fixes we defer are often the ones most entangled with everything else. A rough edge in a core workflow touches data, reporting, and downstream integrations. Leave it, and each new feature built on top inherits the same crooked foundation.

In practice, this is how a two-hour fix becomes a two-week project. Not because the fix changed, but because the surface it touches grew. The bug that once affected one screen now affects a report, an export, and a partner API that expects the old behaviour.

## A more honest way to decide

None of this means every imperfection must block a release. Some genuinely can wait. The goal is to make the deferral a real decision rather than a reflex. A few habits help.

1. **Name the cost out loud.** Write down what breaks if this is never fixed. If the answer is "very little," you have found a true low priority. If the answer is uncomfortable, you have found something else.
2. **Attach an owner and a trigger.** A fix with no owner and no revisit date is not deferred, it is abandoned. Tie it to a concrete event: the next release, the first support complaint, the next integration.
3. **Separate polish from foundation.** A misaligned button can wait. A quiet data inconsistency cannot, because everything built on top will trust the wrong number.

## What the list is really telling you

A backlog of "fix after launch" items is a useful signal if you read it honestly. A short one suggests a team shipping deliberately. A long and ageing one suggests a product being steered by its deadlines rather than its craft.

You remain in the driver's seat only as long as you can still see the road. When the deferred work grows faster than you can pay it down, the product starts making decisions for you.

So the question is not whether to ever defer a fix. It is whether you are choosing to, or simply hoping the bill never comes.
