---
title: Why every migration plan needs a rollback story
author: Ali
---

A migration plan without a rollback story is a one-way bridge. It usually holds. But the one time it does not, you are standing in the middle of it with no way back and a growing crowd behind you.

Most teams I meet have a detailed plan for going forward. The database gets upgraded, the service gets cut over, the old system goes dark. What they often cannot answer, calmly and in one sentence, is a simpler question: if this goes wrong at 2am, how do we get back to yesterday?

## The forward plan is the easy half

It is natural to spend your energy on the destination. The new platform is exciting. The old one is the thing everyone wants to leave behind.

So the forward path gets rehearsed, diagrammed, and celebrated in the kickoff deck. The return path gets a single bullet that reads "roll back if needed," as if that were a step rather than a project of its own.

In practice, rolling back is frequently harder than rolling forward, for reasons that only surface under pressure:

- **Data moves in one direction.** Once the new system has written an hour of live orders, reverting the schema does not un-write them. Your rollback has to answer where that hour goes.
- **The old system quietly rots.** Configuration drifts, certificates expire, a dependency gets decommissioned by another team. The fallback you assumed was warm has been cooling for months.
- **Confidence replaces verification.** Nobody tests the rollback because nobody expects to need it. So the first time it runs is the worst possible time to discover it does not.

This does not imply anyone was careless. It highlights a bias we all share: we prepare for the future we want, not the one we are trying to avoid.

## What a real rollback story contains

A rollback story is not a sentence. It is a short, concrete answer to a few honest questions, written before cutover and tested like any other feature.

1. **Define the point of no return.** Name the exact moment after which reverting costs more than fixing forward. Everyone should know which side of that line they are on.
2. **Decide what happens to new data.** Spell out how records created on the new system are preserved, replayed, or reconciled if you go back. Vagueness here is where trust leaks out.
3. **Keep the old path warm.** Treat the previous system as live until the new one has earned its retirement. Patch it, monitor it, and prove it still starts.
4. **Rehearse the reversal.** Run the rollback in a sandbox with real-shaped data, time it, and let the person who will run it at 2am be the one who practises it at 2pm.
5. **Write the decision rule.** Agree in advance on the signal that triggers a rollback, so the call is made by a plan and not by whoever is most tired in the room.

## The quiet benefit nobody expects

Here is the part that surprises people. A team with a credible rollback story migrates faster, not slower.

When you know you can get back, you stop hedging. You cut over decisively instead of running both systems in a nervous half-state for three months. The safety net is what lets you jump.

Ironically, the plans that refuse to discuss failure are the ones that fail slowly and expensively, because every step is taken with one foot already braced for retreat.

A migration is a promise that tomorrow will be better than today. A rollback story is the smaller promise underneath it: that if tomorrow is not ready, today will still be there waiting.
