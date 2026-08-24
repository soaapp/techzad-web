---
title: What restaurants taught me about real-time systems
author: Ali
---

A busy kitchen on a Friday night is one of the most demanding real-time systems I have ever watched. Orders arrive faster than they can be cooked, every dish has a different deadline, and the whole operation lives or dies on timing that no one ever writes down.

I spent an evening last month sitting near the pass at a small family restaurant, watching the expeditor call tickets. By the end of the night I had filled a page of notes, and most of them were about software.

## The kitchen is a distributed system

No single person holds the whole state of the kitchen in their head. The grill cook knows the grill. The person on salads knows the cold station. The expeditor coordinates, but even they trust each station to report honestly.

This is how healthy distributed systems behave. Responsibility is local, communication is explicit, and no component pretends to know more than it does.

A few patterns stood out:

- **Backpressure is a feature.** When the grill fell behind, the expeditor stopped seating new tickets at that station rather than piling them on. In software we often do the opposite, accepting every request until the whole system collapses at once.
- **Latency budgets are per dish, not per kitchen.** Fries and a steak have very different deadlines, yet they must arrive together. Good kitchens plan backward from the plate. Good systems plan backward from the user.
- **Freshness beats throughput.** A dish that sits under the heat lamp is technically "done" and practically ruined. Data that arrives late is often the same: correct, and useless.

## The receipt is the source of truth

Everything reconciles against the ticket. Not the cook's memory, not a verbal agreement, the printed ticket that both the kitchen and the front of house can see.

In practice, this is the single most important idea in real-time work. When two parts of a system disagree, you need one artifact that settles the argument. Without it, you get the restaurant version of a race condition: two servers both certain the table was theirs.

## Degrade gracefully, do not fail loudly

When the kitchen got slammed, it did not shut down. The menu quietly narrowed. Specials disappeared. The kitchen shed load in a way the guest barely noticed.

Ironically, the software equivalent is often treated as failure rather than design. We build systems that run beautifully until the moment they don't, then fall over completely. A kitchen would never survive that way, so why do we accept it?

The better model is the one every seasoned chef already knows: when you cannot do everything well, do the important things well and let the rest wait.

## What the people taught me

None of this ran on a dashboard. It ran on people who had learned, over many shifts, to read the room and adjust. The expeditor was not executing an algorithm. He was applying judgment shaped by thousands of Friday nights.

That is the part we frequently forget when we automate. We can encode the timing, the queues, and the reconciliation. What is harder to encode is the seasoned instinct that says this table can wait two minutes and that one cannot.

The best real-time systems I have built were never purely technical. They paired reliable mechanics with people who understood the meal, not just the machine.

A kitchen keeps its promises one plate at a time, and so should our software.
