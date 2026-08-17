---
title: What restaurants taught me about real-time systems
author: Ali
---

Stand near the pass of a busy kitchen on a Friday night and you are watching one of the best real-time systems ever built. Tickets arrive faster than anyone would like, orders change mid-flight, and somehow plates leave hot and in the right order. No one calls it distributed computing, but that is exactly what it is.

I have spent decades designing systems that must respond in the moment, and I keep coming back to the restaurant as the clearest teacher. The lessons are hiding in plain sight, next to the fryer.

## Throughput is not the same as speed

A new cook tries to make each dish as fast as possible. An experienced one manages the whole line so the entire table finishes together.

That distinction matters in software too. We often optimize a single request and celebrate the millisecond we saved, while the customer waits on the slowest part of the meal.

- **Latency is felt, throughput is measured.** A diner does not care that the kitchen served two hundred covers. They care that their table ate together, warm.
- **The bottleneck moves.** On a slow night the grill is fine and the bar is slammed. On a busy night it flips. Good expediters watch where the pressure is right now, not where it was last week.

## Backpressure keeps the kitchen alive

When the tickets pile up, a good expediter does something that feels counterintuitive. They slow the front of house down. They stop seating for ten minutes.

In systems we call this backpressure, and it is often the difference between a service that degrades gracefully and one that falls over. Ironically, the fastest way to stay up under load is to accept a little less work.

The kitchen that never says "hold on" is the kitchen that sends out cold food and forgets the allergy note.

## Every order needs a single source of truth

The ticket rail is the shared state. It is visible, it is ordered, and everyone trusts it. When a server shouts a change instead of writing it down, that is when the extra plate appears and the confusion begins.

In practice, the teams I have seen struggle most are the ones with three versions of the truth: one in the code, one in someone's head, and one in a spreadsheet nobody opens. The rail works because it is boring and honest.

## Degrade the menu, not the experience

When something breaks, the good restaurants do not close. They pull the special that needs the broken oven and keep serving everything else. The guest may never notice.

Is your system built to fail the same way, dropping the non-essential feature quietly while the core keeps running? Or does one broken oven shut the whole dining room?

- **Graceful degradation over heroic recovery.** A smaller menu tonight beats a dark restaurant.
- **Protect the core order path.** People forgive a missing dessert. They do not forgive a missing main.

## What the line really teaches

You can read a shelf of books on queues, timeouts, and prioritization. You will understand them faster by watching an expediter for one dinner service.

The deepest lesson is not technical at all. Under real load, systems succeed when people trust the shared rail, respect the bottleneck, and know which plate matters most. The tools change every few years. The line does not.

A great kitchen is not the one that never gets slammed. It is the one that stays calm when it does.
