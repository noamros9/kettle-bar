# Kettle & Bar roadmap

A draft for Noam to reorder, cut or add to. Items link to issues once they exist.

## Now: foundations
Make the app safe to keep changing.

- **Automated tests** ([#5](https://github.com/noamros9/kettle-bar/issues/5)): session and rest rules, program invariants, catalogue checks, sync merge, UI smoke tests in CI.
- **Backup of progress** ([#6](https://github.com/noamros9/kettle-bar/issues/6)): nightly export to a private backup repo, and in-app export/import.
- **Architecture: deepen the Workout Session module** (review candidate 1): rest rules and timer plans in one testable module.
- **Architecture: one Program Builder** (review candidate 2): one generator, with Three-Split 60 as a config.
- **Smaller download**: load each program's data when it's opened instead of all 29 up front (the page is ~1.6 MB today).

## Next: training log
Record what actually happened, not just "done".

- **Log weights and reps** per set (prefilled with the plan), and show "last time" next to each exercise.
- **History & streaks**: calendar of finished workouts, sessions per week, total minutes, current streak.
- **Swap an exercise** for an alternative that works the same muscles with your equipment (for a sore joint or a missing weight).
- **Skip / repeat a day** and a "resume where you left off" button.
- **Finish screen**: a summary after the cool-down (time, sets, rounds, PRs) with a one-tap "Mark as done".

## Later: smarter progression
- **Test days** every 20 days (max push-ups, pull-ups, plank). Results adjust the next level's reps automatically.
- **Personal records** per exercise (heaviest weight, most reps, longest hold) with a small chart.
- **Deload weeks** and rest-day suggestions when a streak gets long.
- **"What next?"** recommendations when a program ends, based on what you enjoyed and your test results.
- **Build your own program in the app**: pick subject, length, equipment and split, and the builder generates it.

## Polish
- **Voice cues** for the timer ("10 seconds", "switch sides", "next: goblet squats") using the phone's speech.
- **Animated exercise drawings**: move between the two poses instead of showing them side by side.
- **Hebrew version** (right to left), like the other apps.
- **Share a workout** as an image.
- **Home-screen shortcut** straight to today's workout.

## Ideas parked
- Heart-rate or Google Fit integration: limited from a web app, revisit if the app moves to a native wrapper.
- New equipment programs (bands, heavier kettlebell, bench): when Noam buys the gear.
