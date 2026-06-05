import { type TarotCard, ALL_CARDS } from '../data/cards';
import { type Spread, type SpreadPosition } from '../data/spreads';

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: SpreadPosition;
}

export interface ReadingResult {
  spread: Spread;
  drawnCards: DrawnCard[];
  question: string;
  timestamp: number;
}

function shuffleDeck(deck: TarotCard[]): TarotCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCards(spread: Spread, question: string): ReadingResult {
  const shuffled = shuffleDeck(ALL_CARDS);
  const drawnCards: DrawnCard[] = spread.positions.map((position, i) => ({
    card: shuffled[i],
    isReversed: Math.random() > 0.5,
    position,
  }));

  return {
    spread,
    drawnCards,
    question,
    timestamp: Date.now(),
  };
}

export function getCardImagePath(card: TarotCard): string {
  return `/cards/${card.image}`;
}

export function formatCardName(drawn: DrawnCard): string {
  return `${drawn.card.name}${drawn.isReversed ? '（逆位）' : '（正位）'}`;
}

export function buildReadingContext(result: ReadingResult): string {
  let context = '';
  context += `问卜者的问题：${result.question}\n`;
  context += `使用牌阵：${result.spread.name} — ${result.spread.description}\n\n`;
  context += `抽到的牌：\n`;
  for (const drawn of result.drawnCards) {
    const orientation = drawn.isReversed ? '逆位' : '正位';
    const info = drawn.isReversed ? drawn.card.reversed : drawn.card.upright;
    context += `位置「${drawn.position.name}」（${drawn.position.meaning}）：${drawn.card.name} (${drawn.card.nameEn}) ${orientation}\n`;
    context += `  关键词：${info.keywords.join('、')}\n`;
    context += `  牌义：${info.meaning}\n\n`;
  }
  return context;
}
