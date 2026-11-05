/* ============================================================
   CUSTOMIZE THIS SECTION
   ============================================================ */
const CONFIG = {
  name: "Neha",

  // Gate passcode (numbers only for the keypad). Change this before sharing.
  passcode: "123",
  passcodeHint: "Three digits. A little code for a big feeling.",

  // Ceremony assets (wrong code + cake cutting)
  bubuImage: "images/bubu-try-again.gif",
  knifeImage: "images/cake-knife.jpg",
  cakeSliceImage: "images/cake-slice.jpg",
  ageFrom: 29,
  ageTo: 30,

  // Animated Bubu / Dudu corner stickers (GIF) — cycles on every page
  cornerStickers: {
    topLeft: ["images/bubu-peek.gif", "images/bubu-wave.gif"],
    topRight: ["images/dudu-cute.gif", "images/dudu-wave.gif"],
    bottomLeft: ["images/bubu-corner.gif", "images/bubu-dudu-love.gif", "images/bubu-dudu-hug.gif"],
    bottomRight: ["images/dudu-corner.gif", "images/dudu-love.gif", "images/dudu-wave.gif"],
  },
  cornerStickerRotateMs: 7000,

  tagline: "Neha, a little interactive surprise made just for your birthday.",

  // Personal photos (add these to images/)
  // heroImage = Neha’s photo shown after the cake (Open me → cake → this photo)
  heroImage: "images/hero.jpg",
  finaleImage: "images/finale.jpg",

  // Birthday decorations
  cakeImage: "images/cake.jpg",
  ribbonImage: "images/ribbon.jpg",
  partyDecorImage: "images/party-decor.gif",

  gallery: [
    { src: "images/moment-1.jpg", caption: "Neha’s smile" },
    { src: "images/moment-2.jpg", caption: "Our favorite spot" },
    { src: "images/moment-3.jpg", caption: "Late-night laughs" },
    { src: "images/moment-4.jpg", caption: "Just us" },
    { src: "images/moment-5.jpg", caption: "A quiet morning" },
    { src: "images/moment-6.jpg", caption: "Forever with Neha" },
    { src: "images/moment7.jpg", caption: "Forever with Neha" },
    { src: "images/moment-8.jpg", caption: "Forever with Neha" },
    { src: "images/moment-9.jpg", caption: "Forever with Neha" },
    { src: "images/moment-10.jpg", caption: "Forever with Neha" },
  ],

  // About Neha — edit these lines anytime
  about: {
    headline: "The girl who makes ordinary days feel like something worth keeping.",
    intro:
      "This page is a tiny love letter disguised as facts. Neha, here’s how the world looks brighter with you in it.",
    traits: [
      { title: "Her smile", text: "The kind that resets a whole day without trying." },
      { title: "Her heart", text: "Soft where it matters, strong when it counts." },
      { title: "Her laugh", text: "Favorite sound." },
      { title: "Her presence", text: "Home isn’t a place — it’s wherever she is." },
    ],
    favorites: [
      "Late-night talks that even when you were tired",
      "The way she notices the little things",
      "How she makes courage look like and landing into Tech",
      "Choosing her, again and again",
    ],
    closing: "Happy birthday, Neha. Thank you for being you — and for being mine.",
  },
};

const QUESTIONS = [
  {
    text: "Have you got butterflies so far?",
    yes: "Yes",
    no: "Hmm ",
  },
  {
    text: "Do you think we are living a real-life love story?",
    yes: "Yes",
    no: "Hmm ",
  },
  {
    text: "Do you think you love me even more now after looking at this?",
    yes: "Yes",
    no: "Hmm ",
  },
  {
    text: "Are you feeling to hug me tightly right now?",
    yes: "Yes",
    no: "Hmm ",
  },
  {
    text: "Are you still in shock that I made this? (Hold on, there is still more to go!)",
    yes: "Yes",
    no: "Hmm ",
  },
  {
    text: "Have you got all your favorite memories refreshed?",
    yes: "Yes",
    no: "Hmm ",
  },
  {
    text: "Are you smiling right now?",
    yes: "Yes",
    no: "Hmm ",
  },
  {
    text: "Do you realize that making you happy is my absolute favorite thing to do?",
    yes: "Yes",
    no: "Hmm ",
  },
  {
    text: "Are you falling for me again :)?",
    yes: "Yes",
    no: "Hmm ",
  },
  {
    text: "This is the last one: if you are feeling extra special, will you let me spoil you forever?",
    yes: "Yes",
    no: "Hmm ",
  },
];


const QUIZ_STORAGE_KEY = "birthday-quiz-result";
const GATE_STORAGE_KEY = "neha-birthday-unlocked";
