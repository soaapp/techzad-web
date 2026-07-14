---
title: "The hidden cost of \"we'll fix it after launch\""
author: Ali
---

Most teams treat "we'll fix it after launch" as a scheduling decision. In practice, it is a financing decision. You are not deferring the work, you are borrowing against it, and the interest compounds quietly in places the original estimate never accounted for.

I have watched this phrase rescue a deadline and then, months later, quietly consume the team that used it. The problem is rarely the deferred item itself. The problem is everything that grows around it while it waits.

## Why the deferral feels rational

To be fair, shipping early is often the right call. Real users teach you things no internal review ever will, and a feature nobody uses is not worth polishing. The instinct to launch and learn is sound.

The trouble is that "fix it after launch" is usually applied to the wrong category of work. Not to speculative features, but to known defects: the confusing error message, the edge case that corrupts a record, the report that is off by one. These are not experiments. They are debts with a due date already stamped on them.

## Where the cost actually accumulates

The launch-day estimate rarely counts what comes next.

- **Context decay.** The engineer who understood the shortcut moves to another project. When the fix finally comes up, someone spends three days relearning what one person knew for free in the moment.
- **Workaround entrenchment.** Users and support staff invent coping habits around the flaw. By the time you fix it, you are also unwinding a process people now depend on.
- **Trust erosion.** Each visible rough edge teaches customers to expect rough edges. That expectation is expensive to reverse, and it colours how they read every future release.
- **Compounding architecture.** New features get built on top of the thing you meant to fix, so the fix now touches five systems instead of one.

None of this appears in the ticket. All of it appears in the invoice.

## A short story from the studio

We once shipped a form with a validation gap we planned to close "next sprint." It seemed harmless. Within two weeks, a handful of malformed records had flowed downstream into billing, reporting, and an export a client had already forwarded to their own auditor.

The original fix was an afternoon. The cleanup was a fortnight, and the apology was harder to write than any line of code.

## A more honest way to decide

The question is not whether to defer, but what you are actually deferring. So we started naming it out loud before launch.

1. **Classify the item.** Is this an unproven feature, or a known defect? Defects rarely deserve the "after launch" bucket.
2. **Price the delay, not just the fix.** Ask who else touches this data, and what habits will form around it in ninety days.
3. **Set an expiry, not an intention.** "After launch" with no date is not a plan. A dated commitment is.
4. **Write down the reasoning.** Future you deserves to know why past you took the shortcut.

This does not mean every flaw blocks a release. It means the decision is made with eyes open, and the cost is visible to the people who will pay it.

Speed and quality are often framed as opposites. In my experience they are the same conversation held at two different moments, and the bill always finds its way back to whoever spoke first.

The cheapest fix is the one you scheduled before you needed it.
