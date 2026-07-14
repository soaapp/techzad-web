---
title: "What Extra Chicken Taught Me About Software Quality"
author: Ali
---

A restaurant we work with recently reported a curious bug. When a server added extra chicken to a Caesar salad, the charge appeared correctly on the POS screen, but it never printed on the customer's receipt. Every other modifier printed fine. Only the extra chicken went missing.

On paper, this is a minor defect. One modifier, one receipt line, a few dollars. In the dining room, it looked very different. A guest sees a total that is higher than the items listed in front of them. The server now has to explain a discrepancy they did not create and cannot fix. Nobody argues about lettuce, but everybody notices a number that does not add up.

## Small bugs are rarely small

What I have observed over many years of delivering systems is that the severity of a bug has very little to do with the size of the code change behind it. It has everything to do with where the bug sits in a moment of trust.

A receipt is not just paper. It is the one artifact of the entire technology stack that the customer actually holds in their hands. If it is wrong, the customer does not conclude that a print template has a missing conditional. They conclude that the restaurant is careless with their money.

- **The screen is for the staff; the paper is for the guest.** Testing often stops at the screen, because that is where developers live. The moment of truth happens one step later.
- **Edge cases hide in the popular items.** Extra chicken is likely the most ordered modifier in the building. High-frequency paths deserve the most testing, yet they often receive the least, because everyone assumes they must already work.
- **The person who finds the bug is rarely the person who can fix it.** A server during Friday rush has no ticket queue. They have a table of four waiting for an explanation.

## Follow the paper trail

The lesson we keep re-learning: test the artifacts, not just the interfaces. Print the receipt. Export the report. Open the email on an actual phone. Whatever leaves your system and lands in a human hand deserves its own test, because that is the part your customer will judge you by.

In restaurants, as in software, the details are the difference between a good night and a long one.
