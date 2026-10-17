/* Program families (Phase 35 ticket 2t3): FAMILIES on its own, so the recipe book's cache key holds only what the book
   reads (recipe-book.js); app/library.js and the pages read it through KBLibrary as before. */
(function (root) {
  // Families group the subjects; chips and shelves follow this order. Subjects listed before they have programs
  // just don't show. A program whose subject is missing here is an error (the UI tests fail on it), never dropped quietly.
  const FAMILIES = [
    ['Strength', ['Signature', 'Strength', 'Pull-ups', 'Legs & glutes', 'Kettlebell only', 'Bodyweight', 'Busy week', 'Grip & forearms', 'Kettlebell complexes', 'Climber / pull strength', 'Chest', 'Back', 'Shoulders', 'Arms', 'Hips & adductors', 'Calves & lower legs', 'Neck & traps']],
    ['Cardio & combat', ['Conditioning', 'HIIT', 'Plyometrics', 'Boxing', 'Kickboxing', 'Running prep', 'Court & field sports']],
    ['Mind & body', ['Core & abs', 'Mobility & posture', 'Yoga', 'Pilates', 'Power yoga', 'Yin yoga', 'Yoga flow', 'Mat core', 'Kettlebell Pilates', 'Flexibility', 'Balance & stability', 'Gentle / low impact', 'Back care']],
    ['Mixed', ['Strength & stretch', 'Fighter', 'Athlete', 'Balanced week', 'Calm strength', 'Variety', 'Weekly mix', 'Surprise', 'Beach body', 'Bedroom stamina', 'Sex positions', 'Couples', 'Endurance & control', 'Hip power & thrust', 'Carry & hold', 'Flexible & bendy', 'Strip & show-off', 'Her pleasure', 'Quickie', 'Back & knees care', 'Date night warm-up', 'Positions tour', 'Morning glory / Sunday', 'Explicit', 'Rough', 'Kink-lite', 'Body play', 'Rimming', 'Edging', 'Massage', 'Strip and tease', 'Shower and bath', 'Pool', 'Hot tub', 'Balcony', 'Doorframe']],
  ];
  /* node:coverage ignore next */ // the browser branch: families.js loads before library.js on the page
  if (typeof module !== 'undefined' && module.exports) module.exports = { FAMILIES }; else root.KBFamilies = { FAMILIES };
})(typeof window !== 'undefined' ? window : globalThis);
