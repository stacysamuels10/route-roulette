const zwiftWorkouts = [
  // ============================================================
  // SERIOUS (1–5)
  // ============================================================
  {
    id: 1,
    name: "FTP Builder",
    type: "serious",
    duration: "75 min",
    description:
      "2x20 min at threshold with 5 min recovery. The bread and butter of getting faster.",
    intensity: "hard",
    instructions: [
      "10 min warmup at 55% FTP",
      "20 min at 95-100% FTP",
      "5 min recovery at 50% FTP",
      "20 min at 95-100% FTP",
      "10 min cooldown at 50% FTP",
    ],
    emoji: "🔥",
    tip: "Put on a playlist that makes you feel like you're in a movie training montage.",
  },
  {
    id: 2,
    name: "VO2 Max Sharpener",
    type: "serious",
    duration: "60 min",
    description:
      "5x4 min at 110% FTP with 3 min recovery. This is where the real fitness gains hide—right next to the suffering.",
    intensity: "brutal",
    instructions: [
      "10 min warmup building from 50% to 75% FTP",
      "4 min at 110% FTP",
      "3 min recovery at 50% FTP",
      "4 min at 110% FTP",
      "3 min recovery at 50% FTP",
      "4 min at 110% FTP",
      "3 min recovery at 50% FTP",
      "4 min at 110% FTP",
      "3 min recovery at 50% FTP",
      "4 min at 110% FTP",
      "8 min cooldown at 50% FTP",
    ],
    emoji: "🫁",
    tip: "You'll want to quit on interval 3. That's normal. Interval 4 is where the magic happens.",
  },
  {
    id: 3,
    name: "Sweet Spot Sunday",
    type: "serious",
    duration: "80 min",
    description:
      "3x15 min at 88-93% FTP. Hard enough to build fitness, easy enough to do every week. The Goldilocks zone.",
    intensity: "hard",
    instructions: [
      "10 min warmup at 55% FTP",
      "15 min at 88-93% FTP",
      "5 min recovery at 50% FTP",
      "15 min at 88-93% FTP",
      "5 min recovery at 50% FTP",
      "15 min at 88-93% FTP",
      "10 min cooldown at 50% FTP",
    ],
    emoji: "🍯",
    tip: "Pick a Zwift route with scenery. You'll be staring at the screen for a while.",
  },
  {
    id: 4,
    name: "Tempo Grinder",
    type: "serious",
    duration: "75 min",
    description:
      "60 straight minutes in Zone 3. Sounds easy. Isn't. Builds the diesel engine that powers long rides.",
    intensity: "moderate",
    instructions: [
      "10 min warmup building from 50% to 75% FTP",
      "60 min steady at 76-85% FTP",
      "5 min cooldown at 50% FTP",
    ],
    emoji: "🚂",
    tip: "This is a great day to binge a show. You'll need the distraction around minute 40.",
  },
  {
    id: 5,
    name: "The Ramp Test of Doom",
    type: "serious",
    duration: "25 min",
    description:
      "Start easy, increase power every minute until you physically cannot continue. Discover your FTP and your breaking point simultaneously.",
    intensity: "brutal",
    instructions: [
      "5 min warmup at 50% FTP",
      "Start at 100W, increase 20W every minute",
      "Hold each step for the full minute",
      "Continue until you cannot maintain target power",
      "Your FTP = 75% of your best 1-min power",
      "Collapse over handlebars (mandatory)",
    ],
    emoji: "📈",
    tip: "Don't look at total time remaining. Just focus on surviving the current minute.",
  },

  // ============================================================
  // GOOFY (6–10)
  // ============================================================
  {
    id: 6,
    name: "The Microwave",
    type: "goofy",
    duration: "45 min",
    description:
      "30 seconds on, 30 seconds off for 30 minutes straight. You'll spin like a microwave plate and feel equally cooked.",
    intensity: "hard",
    instructions: [
      "10 min warmup at 55% FTP",
      "30 sec at 130% FTP / 30 sec at 40% FTP — repeat 30 times",
      "5 min cooldown at 50% FTP",
    ],
    emoji: "📡",
    tip: "Set a timer on your phone. You WILL lose count. Everyone loses count.",
  },
  {
    id: 7,
    name: "DJ Spin Class",
    type: "goofy",
    duration: "50 min",
    description:
      "Change your effort level AND the song every 5 minutes. Match your watts to the vibe. Rage song? Full gas. Ballad? Recovery.",
    intensity: "moderate",
    instructions: [
      "Queue up 10 songs in alternating energy levels",
      "5 min warmup — pick something chill",
      "Every 5 min: new song, new effort (50-120% FTP, match the mood)",
      "High energy song = 100-120% FTP",
      "Chill song = 50-65% FTP",
      "Mid-tempo = 80-90% FTP",
      "Finish with your favorite pump-up song, all out",
    ],
    emoji: "🎧",
    tip: "Make a playlist in advance or you'll spend the whole workout scrolling Spotify at 200 watts.",
  },
  {
    id: 8,
    name: "One-Legged Wonder",
    type: "goofy",
    duration: "45 min",
    description:
      "Alternate single-leg drills to find (and fix) your pedal stroke imbalances. Warning: your weak leg will betray you immediately.",
    intensity: "moderate",
    instructions: [
      "10 min warmup, both legs, at 55% FTP",
      "2 min right leg only at 50% FTP (left foot unclipped, resting)",
      "2 min left leg only at 50% FTP",
      "2 min both legs at 75% FTP",
      "Repeat single-leg block 5 times",
      "5 min cooldown both legs at 50% FTP",
    ],
    emoji: "🦩",
    tip: "Your pedal stroke will sound like a washing machine at first. That's the point.",
  },
  {
    id: 9,
    name: "The Commentator",
    type: "goofy",
    duration: "45 min",
    description:
      "Join a Zwift group ride or race and narrate the entire thing out loud like Phil Liggett. Bonus points for dramatic attacks on flat roads.",
    intensity: "moderate",
    instructions: [
      "Join any Zwift group ride or race",
      "10 min warmup — set the scene, describe the peloton",
      "Narrate every attack, surge, and wheel-suck in your best British accent",
      "Award imaginary jerseys to random avatars",
      "Sprint finish with full commentary crescendo",
      "Post-race interview yourself in the cooldown",
    ],
    emoji: "🎬",
    tip: "Record yourself. You'll either be proud or horrified. Either way it's content.",
  },
  {
    id: 10,
    name: "Shame Spiral",
    type: "goofy",
    duration: "45 min",
    description:
      "Endurance mode, 45 minutes, watch a cooking show, and you absolutely cannot eat. Build mental fortitude and an appetite simultaneously.",
    intensity: "moderate",
    instructions: [
      "Set up a cooking show on your screen (anything with Guy Fieri preferred)",
      "45 min steady endurance pace at 65-75% FTP",
      "No snacking. No gels. No secret candy.",
      "Rate each dish you see on a 1-10 scale",
      "The hungrier you get, the higher the ratings go",
      "Eat immediately after. You've earned it.",
    ],
    emoji: "😈",
    tip: "Do NOT pick a show about Nashville hot chicken unless you want to DNF to go get some.",
  },
];

export default zwiftWorkouts;
