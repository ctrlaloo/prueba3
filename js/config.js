/* ============================================================
   SITE_CONFIG — the ONLY file you need to edit to reuse this
   for another person. {name} and {nick} work inside any text.
   ============================================================ */
const SITE_CONFIG = {
  storageKey: "kalel-v1",            // change per person so saves don't mix
  title: "for you",
  person: { name: "Kalel", nickname: "Superman" },
  access: { password: "1709", extraNames: [] }, // extra accepted names
  relationship: { firstMeeting: "September 17" },
  favorites: ["Spider-Man", "Miles Morales", "Zelda", "Anime"],
  colors: { background: "#050505", primary: "#e50914", text: "#ffffff", accent: "#ff9ec4" }, // accent = soft kawaii pink
  icons: { catch: "♥", quiz: "✦", adventure: "☾", choose: "✿", final: "✉", memory: "△", jar: "♡" },
  loveNotes: ["te amo.", "I love you. Yes, again.", "You are my favorite person.", "Eres mi lugar favorito.", "Te amo más de lo que cabe en una página.", "You make ordinary days feel like a game I want to keep playing.", "Contigo, todo.", "I would pick you in every universe.", "Mi persona favorita.", "Thinking about you. Always."],
  mascot: {                           // Arañita, the little spider who talks
    lines: ["hi {nick}! pick something ✦", "I've been guarding this place for you", "psst... there are secrets here", "you look good today. just saying."],
    pet: ["eep! again again", "hehe that tickles", "best pats in the city", "I'm yours now, you know that?", "more... please"],
    win: ["you're so good at this!", "I knew you could do it ♥", "okay that was cool"],
    fail: ["it's okay, I'm still proud of you", "so close! try again?", "I believe in you ♥"]
  },
  music: { src: "assets/music/background.mp3" },
  timing: { idleMs: 45000 },

  messages: {
    intro1: "HEY, YOU.",
    intro2: "I MADE SOMETHING FOR YOU.",
    granted: "ACCESS GRANTED.",
    welcome: "I WAS WAITING FOR YOU.",
    hubTitle: "YOUR EXPERIENCE",
    wrongName: ["Are you sure that's you?", "That's not quite right."],
    wrongPass: ["That's not quite right.", "Try again."],
    locked: "LOCKED. COMPLETE THE EXPERIENCE TO UNLOCK THIS.",
    unlocked: "THE FINAL THING IS WAITING FOR YOU.",
    finalSeq: ["YOU MADE IT.", "BUT I THINK YOU ALREADY KNEW..."],
    finalTitle: "For you",
    exploring: "you're really exploring everything, huh?",
    idle: "still there?",
    believe: "I believe in you. Try again."
  },

  sections: [
    { id: "catch", title: "CATCH MY HEART" },
    { id: "quiz", title: "HOW WELL DO YOU KNOW ME?" },
    { id: "memory", title: "MEMORY LANE" },
    { id: "adventure", title: "OUR LITTLE ADVENTURE" },
    { id: "jar", title: "OPEN WHEN..." },
    { id: "choose", title: "CHOOSE CAREFULLY" },
    { id: "final", title: "SOMETHING WAITING FOR YOU" }
  ],

  games: {
    catch: {
      seconds: 30, goal: 15, gap: 900, gapStep: 30, minGap: 380,
      life: 1700, speedUp: 50, minLife: 800,
      hint: "Catch them all before time runs out.",
      hover: "that one's yours.",
      winTitle: "YOU GOT THEM ALL.",
      winLines: ["Guess you caught my heart too.", "That one was always yours.", "Not bad, {nick}."],
      loseTitle: "SO CLOSE.",
      lose: "Okay, okay. One more try."
    },
    quiz: {
      right: "You actually know me.",
      wrong: "I'll let that slide...",
      questions: [
        { question: "What was the first thing I noticed about you?",
          options: ["Your smile", "Your laugh", "Your style", "How you talked about what you love"], correct: 3 },
        { question: "What's my comfort movie?",
          options: ["Into the Spider-Verse", "Howl's Moving Castle", "Interstellar", "Coco"], correct: 0 },
        { question: "Where did we first meet?",
          options: ["Online", "School", "A friend's place", "Somewhere I still smile about"], correct: 3 },
        { question: "What do I say when I really, really like something?",
          options: ["That's actually so cool", "Okay wait.", "Show me again", "Nothing. I just stare."], correct: 1 },
        { question: "What's my love language?",
          options: ["Words", "Time together", "Little gifts", "All of them, annoyingly"], correct: 3 },
        { question: "What would I do if we had a free day?",
          options: ["Games and snacks", "Walk around the city", "Movie marathon", "Anything, as long as it's with you"], correct: 3 },
        { question: "What did I think the first time you smiled at me?",
          options: ["Oh no.", "Oh no. I'm in trouble.", "I'm keeping this one", "All of the above"], correct: 3 },
        { question: "How much do I love you?",
          options: ["A lot", "More than a lot", "More than this website", "Te amo. That's the answer."], correct: 3 }
      ],
      results: [
        { min: 1, line: "Okay... you know me really well. Scary." },
        { min: 0.5, line: "Okay... you know me pretty well." },
        { min: 0, line: "You have some studying to do. 😭" }
      ]
    },
    adventure: {
      scenes: {
        start: { text: "You're walking through the city at night. Neon bleeds into the wet pavement. Somewhere above you, something moves between the rooftops.",
          choices: [["Follow the lights", "lights"], ["Take the shortcut", "alley"], ["Turn around", "turn"]] },
        lights: { text: "The lights lead to a rooftop. The whole city glows below, and someone left two coffees on the ledge. One has your name on it.",
          choices: [["Take the coffee", "coffee"], ["Look for who left it", "look"]] },
        look: { text: "You check behind the vent, the stairs, the water tank. Nobody. Then you hear a quiet laugh behind you.",
          choices: [["Turn around", "roof"], ["Pretend you didn't hear", "tag"]] },
        alley: { text: "The shortcut is... not a shortcut. You are, in fact, very lost. A cat watches you with deep disappointment.",
          choices: [["Follow the cat", "cat"], ["Call me for directions", "call"]] },
        turn: { text: "You turn around and I'm already there, pretending I wasn't following you. \"Wasn't me,\" I say. It was me.",
          choices: [["Admit you were hoping I'd show up", "roof"], ["Run", "tag"]] },
        coffee: { text: "Still warm. Under the cup there's a note in my handwriting: ‘If you're reading this, you followed the lights. Of course you did.’",
          choices: [["Look up", "stars"], ["Read the back", "note"]] },
        note: { text: "The back says: ‘I never told you how loud my heart gets when you walk in. Te amo, {nick}. Now look up.’",
          choices: [["Look up", "stars"], ["Hug the note", "hugnote"]] },
        hugnote: { end: 1, title: "VERY ON BRAND", text: "You hug a piece of paper. I'm watching from behind the vent, crying a little. Te amo." },
        stars: { text: "The sky opens up. The city goes quiet and you hear footsteps behind you. You know those footsteps.",
          choices: [["Don't turn. Wait for me", "hold"], ["Turn around", "roof"]] },
        hold: { end: 1, title: "HANDS", text: "I take your hand without a word. You squeeze back. That's the whole conversation. That's the whole story. I love you." },
        roof: { end: 1, title: "THE ROOFTOP", text: "We sit there until the city goes quiet. No mission. No rush. Just you, me, and a view that finally makes sense." },
        cat: { end: 1, title: "THE CAT KNEW", text: "The cat leads you straight back to me. Best navigator in the city. I'm giving it your snacks." },
        call: { end: 1, title: "SIGNAL FOUND", text: "I pick up on the first ring. \"Where are you?\" \"Lost.\" \"Stay there. I'm coming.\" I always will." },
        tag: { end: 1, title: "TAG, YOU'RE IT", text: "You run. I'm faster. Obviously. Caught you, {nick}." }
      }
    },
    jar: {
      title: "Open them all.", hint: "Tap a slip. There are twelve.",
      winTitle: "ALL TWELVE.", winLine: "Every single one was true.",
      notes: ["Te amo. Start with the easy one.", "I think about the day we met more than I admit.", "You make me braver. Don't tell anyone.", "Your laugh is my favorite sound.", "Even on my worst days, you feel like home.", "I'd choose you in every universe. Even the weird ones.", "Thank you for being exactly who you are.", "I'm proud of you. Always have been.", "Eres mi persona favorita en todos los multiversos.", "I'm not great at saying this out loud, so: te amo.", "Whatever happens, I'm on your team.", "Last one: I love you. I really, really do."]
    },
    memory: {
      title: "Find the pairs.", symbols: ["♥", "🕷", "☾", "✿", "△", "★"],
      lines: ["a match!", "we match, too.", "nice one, {nick}", "told you we were a pair"],
      winTitle: "PERFECT MATCH.", winLine: "{n} moves. We were always a pair."
    },
    choose: {
      doneTitle: "NOTED.",
      doneLine: "I'll remember all of that.",
      rounds: [
        { prompt: "Pick one.", options: [["Movie night", "Cozy. I approve."], ["Going out", "Oh, interesting choice."]] },
        { prompt: "Pick one.", options: [["Hug", "I'll remember that."], ["Kiss", "Bold choice."]] },
        { prompt: "Pick one.", options: [["Me", "Correct answer."], ["Obviously me", "Correct answer. Again."]] },
        { prompt: "Who falls asleep first?", options: [["Me", "I'll keep watch. Always."], ["You", "I'll steal the blanket then."]] },
        { prompt: "Pick our superpower.", options: [["Stopping time", "Then I'd use it just to look at you."], ["Flying together", "Deal. Hold on tight."]] },
        { prompt: "Pick one.", options: [["Stay in tonight", "Best plan. Always."], ["Midnight walk", "I'll bring the playlist."]] },
        { prompt: "Say it first.", options: [["I love you", "I felt that one."], ["Te amo", "Sí. Yo también. Siempre."]] }
      ]
    }
  },

  // Easter eggs. type "type" = typed on keyboard, "click" = click [data-secret] element
  secrets: [
    { id: "title", type: "click", clicks: 5, nudgeAt: 3, nudge: "okay... you're curious, huh?", msg: "Curiosity looks good on you." },
    { id: "miles", type: "type", value: "miles", msg: "With great power... comes great taste in boyfriends." },
    { id: "zelda", type: "type", value: "zelda", msg: "It's dangerous to go alone. Take me with you." },
    { id: "anime", type: "type", value: "senpai", msg: "Notice me? You already did." },
    { id: "pet", type: "pet", msg: "Ten pats. Arañita is yours forever." },
    { id: "spider", type: "click", clicks: 5, nudgeAt: 0, nudge: "", msg: "You found the tiny one. Nobody finds the tiny one." }
  ],

  photos: [
    { src: "assets/images/photo1.jpg", caption: "Add a caption here" },
    { src: "assets/images/photo2.jpg", caption: "Another memory" },
    { src: "assets/images/photo3.jpg", caption: "This one's my favorite" }
  ],

  letter: [
    "You made it all the way here.", "",
    "I could have just written you a message.",
    "I could have sent you a picture.",
    "I could have said 'I love you' and left it there.", "",
    "But I wanted to make you something.", "",
    "Something you could click through.",
    "Something you could play.",
    "Something that would remind you that someone thought about you enough to make all of this.", "",
    "So...", "",
    "hi, {nick}.", "",
    "I love you."
  ]
};
