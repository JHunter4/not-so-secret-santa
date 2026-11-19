// Answers for the identity-verification questions. Text answers ignore case, spaces and punctuation.
export const VERIFICATION = {
  motherBirthday: { month: 10, day: 15 }, // October 15
  thursdayFood: ['stew peas'],
  favouriteTime: ['christmas', 'xmas'],
  rescueTarget: {
    words: ['ECONOMIC', 'ANALYST'],
    // Letter positions shown for free: first C in ECONOMIC, N and T in ANALYST.
    revealed: [[1], [1, 6]],
  },
  fireSeconds: 30,
};

export const EVENT = {
  year: 2026,
  period: 'December 1 to December 25, 2026',
};

export const BUDGET_MIN = 2000;
export const BUDGET_MAX = 10000;
export const BUDGET_STEP = 500;
export const BUDGET_DEFAULT = 5000;

export const CARD_OPTIONS = [2, 3, 4];

export const DELIVERY_RULES = [
  'Deliver 1 gift and your notes/cards discreetly between December 1 and December 25.',
  'At least ONE note must be handwritten.',
  'The gift should remain within the agreed budget.',
  'Keep the identity of the Secret Santa a mystery.',
  "Respect the recipient's workspace and personal belongings.",
  'Have fun and spread Christmas cheer!',
];

export const PLEDGE_PARAGRAPHS = [
  'hereby pledge to spread Christmas cheer, deliver thoughtful surprises and maintain the sacred (if slightly see-through) secrecy of Not So Secret Santa.',
  'I understand that I am delivering 1 gift plus notes/cards, that at least one note must be handwritten, and that all deliveries must be completed without being spotted by my recipient.',
  'I promise to respect the agreed gift budget, embrace the Christmas spirit and carry out my festive duties with the appropriate level of secrecy and mischief.',
];

export const FINAL_MISSION_TEXT =
  "Print this agreement, sign it and secretly leave it on your Secret Santa recipient's desk. Make sure they don't see you doing it!";

export const FOOTER_TEXT = 'Not So Secret Santa 2026 | Officially Unofficial Christmas Business';

export const initialAnswers = {
  budget: BUDGET_DEFAULT,
  gifts: 1,
  cards: null,
  pledged: false,
};

export function formatJmd(amount) {
  return `J$${Number(amount).toLocaleString('en-US')}`;
}

export function budgetAmount(answers) {
  const n = Number(answers.budget);
  return Number.isFinite(n) && n > 0 ? n : null;
}
