---
title: What restaurants taught me about real-time systems
author: Ali
---

A busy kitchen on a Friday night is one of the best real-time systems I have ever watched run. Orders arrive faster than anyone can read them, ingredients run low without warning, and every table expects its food hot, correct, and roughly in the order it was requested. No architecture diagram, no dashboard. Just people, tickets, and a pass.

I spent years designing systems that move data under pressure. It took a plate of fries going cold on the counter to teach me what those systems are really about.

## The kitchen is a queue you can see

Watch the ticket rail above the line. Orders come in, hang there, and clear when the food goes out. That rail is a message queue made physical, and it teaches lessons we often abstract away in software.

- **Backpressure is a feature, not a failure.** When the rail fills, a good expediter slows the front of house down. They stop seating tables. In software we call this rate limiting, and we frequently bolt it on far too late.
- **Order matters, until it doesn't.** Tickets are worked roughly first in, first out, but a four minute dish and a twenty minute dish do not start together. Priority and cook time reshape the queue constantly, the same way a well tuned scheduler does.
- **Freshness has a deadline.** A plated dish waiting on one missing side is a request holding resources while it times out. Every second on the pass is latency the guest can taste.

## Failure is assumed, not feared

The thing that struck me most is how calmly a good kitchen handles things going wrong. A ticket gets dropped. A pan burns. A supplier sends the wrong cut.

In practice, the response is never panic. It is a fallback path that everyone already knows.

- **Graceful degradation.** Out of the special? The server offers the next best thing before the guest even notices a gap. The system stays up with reduced functionality.
- **Idempotency by habit.** "Refire table nine" does not create a second bill. The kitchen knows how to repeat an action without duplicating its effect, which is exactly what we ask of a retry.
- **Observability at a glance.** The expediter reads the whole line in one look: what is behind, what is plated, what is stalled. That is a dashboard built from posture and eye contact.

## Where the analogy earns its keep

It would be easy to romanticise this. A kitchen is not a distributed database, and I am not suggesting we replace monitoring tools with a ticket rail. But the parallels point at something we often forget when we design for scale.

The kitchen optimises for the guest, not for the kitchen. Every decision on the line traces back to a person waiting at a table. Our systems, by contrast, frequently optimise for throughput numbers that no user will ever see.

So the question I now bring to design reviews is simple. Is this queue serving the person at the end of it, or is it serving the metric on our chart?

The best kitchens answer that with every plate. A real-time system, in the end, is not measured by how much it can move. It is measured by whether the thing arrives hot, correct, and on time for the one person waiting on it.
