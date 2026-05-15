export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  fact: string;
}

export const quizData: QuizQuestion[] = [
  {
    q: 'How long does it take for a plastic bottle to decompose in nature?',
    options: ['10 years', '50 years', '450 years', '1000 years'],
    correct: 2,
    fact: 'Plastic bottles take approximately 450 years to decompose, releasing harmful chemicals throughout!',
  },
  {
    q: 'What percentage of plastic waste is actually recycled globally?',
    options: ['50%', '35%', '20%', '9%'],
    correct: 3,
    fact: 'Only about 9% of all plastic ever produced has been recycled. The rest ends up in landfills or oceans.',
  },
  {
    q: 'Which item takes the longest to decompose?',
    options: ['Glass bottle', 'Plastic bag', 'Styrofoam cup', 'Aluminum can'],
    correct: 0,
    fact: 'Glass bottles take over 1 million years to decompose! That\'s longer than modern humans have existed.',
  },
  {
    q: 'How many trees are cut down each year for paper production?',
    options: ['1 billion', '3 billion', '15 billion', '50 billion'],
    correct: 2,
    fact: 'Approximately 15 billion trees are cut down every year, with paper production being a major contributor.',
  },
  {
    q: 'What is the most recyclable material in the world?',
    options: ['Plastic', 'Paper', 'Aluminum', 'Glass'],
    correct: 2,
    fact: 'Aluminum can be recycled infinitely without loss of quality and uses 95% less energy than making new aluminum!',
  },
  {
    q: 'How much food is wasted globally each year?',
    options: ['100 million tons', '500 million tons', '1/3 of all food produced', 'Half of all food produced'],
    correct: 2,
    fact: 'About 1/3 of all food produced globally (1.3 billion tons) is wasted each year!',
  },
  {
    q: 'What is "upcycling" compared to recycling?',
    options: ['Same as recycling', 'Converting waste into higher quality items', 'Melting materials down', 'Sending to landfill'],
    correct: 1,
    fact: 'Upcycling transforms waste materials into products of better quality or higher value than the original!',
  },
  {
    q: 'How many gallons of water does it take to produce one cotton t-shirt?',
    options: ['50 gallons', '200 gallons', '700 gallons', '2,700 gallons'],
    correct: 3,
    fact: 'One cotton t-shirt requires about 2,700 gallons of water to produce - that\'s 2.5 years of drinking water!',
  },
];
