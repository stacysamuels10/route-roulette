const challenges = [
  // ============================================================
  // PHYSICAL (1–8)
  // ============================================================
  {
    id: 1,
    name: "KOM Hunter",
    category: "physical",
    description:
      "PR at least one Strava segment on today's ride. Screenshot or it didn't happen.",
    emoji: "⚡",
    difficulty: "hard",
  },
  {
    id: 2,
    name: "Sprint Royale",
    category: "physical",
    description:
      "Sprint every city limit sign you pass. Bonus points if you yell the town name as you cross.",
    emoji: "🏁",
    difficulty: "medium",
  },
  {
    id: 3,
    name: "No-Drop Diesel",
    category: "physical",
    description:
      "Hold Zone 2 the entire ride, no spikes. If your heart rate touches Zone 3, you owe the group a coffee.",
    emoji: "🚂",
    difficulty: "medium",
  },
  {
    id: 4,
    name: "Climb Collector",
    category: "physical",
    description:
      "Count every hill and name them all ridiculous names. Bonus if you make a summit log.",
    emoji: "🏔️",
    difficulty: "easy",
  },
  {
    id: 5,
    name: "The Breakaway",
    category: "physical",
    description:
      "Ride the last 10 miles at threshold. Pretend you're solo off the front with a helicopter overhead.",
    emoji: "💨",
    difficulty: "hard",
  },
  {
    id: 6,
    name: "Aero Tuck Challenge",
    category: "physical",
    description:
      "Hold aero position on every descent over 30 seconds. Your back will hate you. Your Strava will thank you.",
    emoji: "🫠",
    difficulty: "medium",
  },
  {
    id: 7,
    name: "Standing Only",
    category: "physical",
    description:
      "Stand for every climb, no sitting allowed. Channel your inner Wout van Aert on the Koppenberg.",
    emoji: "🦵",
    difficulty: "hard",
  },
  {
    id: 8,
    name: "The TT",
    category: "physical",
    description:
      "Pick a 5-mile stretch and time trial it. Report your watts. Lie about your watts. We all do.",
    emoji: "⏱️",
    difficulty: "hard",
  },

  // ============================================================
  // GOOFY (9–17)
  // ============================================================
  {
    id: 9,
    name: "The Ambassador",
    category: "goofy",
    description:
      "Wave at every single person you see. Count them. Report back. If you hit 100 you're legally the mayor.",
    emoji: "👋",
    difficulty: "easy",
  },
  {
    id: 10,
    name: "Karaoke Climb",
    category: "goofy",
    description:
      "Sing an entire song out loud on the next climb. Breathlessness is part of the performance. Bonus for harmonies.",
    emoji: "🎤",
    difficulty: "medium",
  },
  {
    id: 11,
    name: "Honk Census",
    category: "goofy",
    description:
      "Tally every car honk on the ride. Zero = perfect score. Ten or more = you might be riding on the interstate.",
    emoji: "📋",
    difficulty: "easy",
  },
  {
    id: 12,
    name: "Photo Bomb",
    category: "goofy",
    description:
      "Get a selfie with 3 different animals. Cows, horses, dogs, goats—all count. Bonus for anything exotic.",
    emoji: "📸",
    difficulty: "easy",
  },
  {
    id: 13,
    name: "The Narrator",
    category: "goofy",
    description:
      "Narrate your ride out loud like a Tour de France commentator for at least 5 minutes. Extra credit for dramatic attacks on mailboxes.",
    emoji: "🎙️",
    difficulty: "easy",
  },
  {
    id: 14,
    name: "Kit Clash",
    category: "goofy",
    description:
      "Wear the most mismatched cycling kit you own. Socks from one team, jersey from another, bibs from a third. Own it.",
    emoji: "🤡",
    difficulty: "easy",
  },
  {
    id: 15,
    name: "Wrong Hand",
    category: "goofy",
    description:
      "Drink from your bottle with your non-dominant hand only. Spilling on yourself is practically guaranteed.",
    emoji: "🫗",
    difficulty: "medium",
  },
  {
    id: 16,
    name: "Bike Name",
    category: "goofy",
    description:
      "Your bike needs a name by the end of this ride. Introduce it to the group at the finish. A ceremony is encouraged.",
    emoji: "🚲",
    difficulty: "easy",
  },
  {
    id: 17,
    name: "Wave & Wink",
    category: "goofy",
    description:
      "Wink at every cyclist you pass. Keep a tally of confused looks vs. winks back. Report the ratio.",
    emoji: "😉",
    difficulty: "easy",
  },

  // ============================================================
  // FOOD (18–25)
  // ============================================================
  {
    id: 18,
    name: "Cafe Crawler",
    category: "food",
    description:
      "Find the best coffee within 1 mile of the route. Rate it on a 5-bean scale. Presentation matters.",
    emoji: "☕",
    difficulty: "easy",
  },
  {
    id: 19,
    name: "BBQ Recon",
    category: "food",
    description:
      "Detour to the nearest BBQ joint. Order a pulled pork sandwich. Eat it in cycling kit. You've earned this.",
    emoji: "🍖",
    difficulty: "easy",
  },
  {
    id: 20,
    name: "The Bonk Test",
    category: "food",
    description:
      "No food until mile 30, then eat something ridiculous. Gas station hot dog, entire sleeve of Oreos—dealer's choice.",
    emoji: "💀",
    difficulty: "hard",
  },
  {
    id: 21,
    name: "Gas Station Gourmet",
    category: "food",
    description:
      "Buy and eat something from a rural gas station. Write a 3-sentence review like you're a Michelin inspector.",
    emoji: "⛽",
    difficulty: "easy",
  },
  {
    id: 22,
    name: "Ice Cream Mandatory",
    category: "food",
    description:
      "Find ice cream on this ride. This is non-negotiable. The ride does not end until ice cream is consumed.",
    emoji: "🍦",
    difficulty: "easy",
  },
  {
    id: 23,
    name: "The Hydration Station",
    category: "food",
    description:
      "Drink a full bottle every 45 minutes. Track your pee stops. Science demands data.",
    emoji: "💧",
    difficulty: "medium",
  },
  {
    id: 24,
    name: "Biscuit Mission",
    category: "food",
    description:
      "Find a biscuit. Nashville has them everywhere. Rate it on fluffiness, butter content, and overall life-changing potential.",
    emoji: "🫓",
    difficulty: "easy",
  },
  {
    id: 25,
    name: "Convenience Store Sommelier",
    category: "food",
    description:
      "Buy a drink at a gas station. Swirl it. Sniff it. Review the bouquet, mouthfeel, and finish like a sommelier. Bonus for a Cheerwine tasting note.",
    emoji: "🥤",
    difficulty: "easy",
  },
];

export default challenges;
