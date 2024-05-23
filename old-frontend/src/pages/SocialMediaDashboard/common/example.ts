import {PieChartItem} from "./PieChart.tsx";
import {PlatformCircleDescriptor, WordCloudItem} from "./common.ts";
import {Platform} from "../../../common/types.ts";


function nowMinusDays(days: number): Date {
  const now = new Date()
  now.setDate(now.getDate() - days)
  return now
}

export const EXAMPLE_LINE_DATA: [string, number][] = [
  [nowMinusDays(5).toISOString(), 10],
  [nowMinusDays(4).toISOString(), 20],
  [nowMinusDays(3).toISOString(), 30],
  [nowMinusDays(2).toISOString(), 15],
  [nowMinusDays(1).toISOString(), 8],
  [nowMinusDays(0).toISOString(), 22],
];


export const EXAMPLE_PIE_DATA: PieChartItem[] = [
  { id: 'a', title: 'Lorem ipsum', value: 20 },
  { id: 'b', title: 'Dolor sit amet', value: 30 },
  { id: 'c', title: 'Consectetur adipiscing elit', value: 10 },
  { id: 'd', title: 'Sed do eiusmod tempor', value: 40 },
  { id: 'e', title: 'Incididunt ut labore', value: 15 },
  { id: 'f', title: 'Other', value: 5 },
];


export const EXAMPLE_PLATFORM_DATA: PlatformCircleDescriptor[] = [
  {id: '#0', relativeSize: 0.6, platform: Platform.TWITTER},
  {id: '#1', relativeSize: 0.4, platform: Platform.REDDIT},
  {id: '#2', relativeSize: 0.4, platform: Platform.INSTAGRAM},
  {id: '#3', relativeSize: 0.4, platform: Platform.TIKTOK},
  {id: '#4', relativeSize: 0.4, platform: Platform.FACEBOOK},
];


export const EXAMPLE_WORD_CLOUD_DATA: WordCloudItem[] = [
  {word: 'Lorem', count: 20},
  {word: 'ipsum', count: 30},
  {word: 'dolor', count: 10},
  {word: 'sit', count: 40},
  {word: 'amet', count: 15},
  {word: 'consectetur', count: 5},
  {word: 'adipiscing', count: 20},
  {word: 'elit', count: 30},
  {word: 'sed', count: 10},
  {word: 'do', count: 40},
  {word: 'eiusmod', count: 15},
  {word: 'tempor', count: 5},
  {word: 'incididunt', count: 20},
  {word: 'ut', count: 30},
  {word: 'labore', count: 10},
  {word: 'et', count: 40},
  {word: 'dolore', count: 15},
  {word: 'magna', count: 5},
  {word: 'aliqua', count: 20},
  {word: 'Ut', count: 30},
  {word: 'enim', count: 10},
  {word: 'ad', count: 40},
];
