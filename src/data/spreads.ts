export interface SpreadPosition {
  index: number;
  name: string;
  meaning: string;
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  quotaCost: number;
  positions: SpreadPosition[];
}

export const SPREADS: Spread[] = [
  {
    id: 'single',
    name: '单牌',
    description: '抽取一张牌，获得当下的核心指引',
    cardCount: 1,
    quotaCost: 1,
    positions: [
      { index: 0, name: '指引', meaning: '当下最需要关注的核心信息' },
    ],
  },
  {
    id: 'three-card',
    name: '三张牌',
    description: '过去、现在、未来 — 看清事物的来龙去脉',
    cardCount: 3,
    quotaCost: 1,
    positions: [
      { index: 0, name: '过去', meaning: '影响当前处境的过去因素' },
      { index: 1, name: '现在', meaning: '当前的核心状况与挑战' },
      { index: 2, name: '未来', meaning: '可能的发展方向与结果' },
    ],
  },
  {
    id: 'celtic-cross',
    name: '凯尔特十字',
    description: '最经典的全面分析牌阵，深度解读人生课题',
    cardCount: 10,
    quotaCost: 2,
    positions: [
      { index: 0, name: '现状', meaning: '当前核心问题与处境' },
      { index: 1, name: '阻碍', meaning: '面临的主要障碍或挑战' },
      { index: 2, name: '潜意识', meaning: '内心深处的真实想法' },
      { index: 3, name: '过去', meaning: '近期过去的影响因素' },
      { index: 4, name: '可能', meaning: '最佳的可能结果' },
      { index: 5, name: '未来', meaning: '近期将要发生的事' },
      { index: 6, name: '自我', meaning: '你对问题的态度与立场' },
      { index: 7, name: '环境', meaning: '周围人和环境的影响' },
      { index: 8, name: '希望与恐惧', meaning: '内心的期待或深层恐惧' },
      { index: 9, name: '结果', meaning: '最终结果与指引' },
    ],
  },
];
