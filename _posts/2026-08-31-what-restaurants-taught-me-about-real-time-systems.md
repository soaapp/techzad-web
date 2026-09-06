---
title: What restaurants taught me about real-time systems
author: Ali
---

A busy kitchen on a Friday night is one of the best distributed systems you will ever watch run. Orders arrive faster than anyone can cook, tickets pile up on the rail, and yet the food comes out hot, roughly in order, and mostly correct. No architecture diagram, no incident channel, just a line of people moving with intent.

I have spent years designing software that promises to handle load, degrade gracefully, and stay consistent under pressure. Every so often I realize a good restaurant solved these problems long before we gave them acronyms.

## The rail is a queue with a conscience

The ticket rail is a message queue. Orders land in order, and the expediter reads them left to right. But a kitchen does something our queues often forget to do: it batches by station, not by arrival.

Four tables order steak within a minute of each other. The grill cook does not fire them one at a time in strict sequence. He fires them together, because the constraint is the grill, not the clock. In practice, that is throughput optimization done by feel.

## Backpressure is a person saying "heard"

When the pass gets slammed, the expediter calls out and the servers slow their tickets. Nobody keeps shoving orders into a station that is already underwater. That is backpressure, and it works because the signal is loud and immediate.

Software systems frequently fail here. We accept every request, queue it politely, and then fall over all at once. A kitchen would rather tell you the wait is twenty minutes than accept your order and forget it.

- **Bounded queues over infinite optimism.** A rail has finite space. When it fills, the kitchen pushes back rather than pretending capacity is unlimited.
- **Local decisions, global rhythm.** Each station manages its own pace, and the expediter keeps the whole line coherent without micromanaging every plate.
- **Degrade the dish, not the service.** Out of an ingredient, a good kitchen offers a substitute in seconds. The table still eats. The system stays up.

## Consistency is the expediter's job

Here is the part we tend to underbuild. The food is cooked in parallel across stations, but it has to arrive at the table together. The expediter is the coordinator: he holds the fish until the risotto is plated, then sends both.

That is eventual consistency with a deadline. The components run independently, and one calm person makes sure the final state is correct before it reaches the customer. Ironically, we spend enormous effort recreating this role in code, and often the cheapest fix is simply naming who owns the final assembly.

## Where the metaphor ends

I want to be fair, because kitchens are not magic. They rely on a stable menu, trained people, and a physical limit on how many tables exist. Our systems face open networks, adversarial traffic, and load that arrives from anywhere at any hour. The comparison illuminates; it does not excuse skipping the hard engineering.

But when I feel a design getting complicated, I ask a simple question. Who is the expediter, and what happens when the rail fills up?

The answer usually tells me whether I have built a real-time system or just a fast one that has not been busy yet. A kitchen never confuses the two, and neither should we.
