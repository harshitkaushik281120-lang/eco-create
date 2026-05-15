export interface WasteSuggestion {
  name: string;
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  time: string;
  desc: string;
  material?: string;
}

export const wasteDatabase: Record<string, WasteSuggestion[]> = {
  '🍶 Plastic Bottles': [
    { name: 'Self-Watering Planter', emoji: '🌱', difficulty: 'easy', points: 30, time: '30 min', desc: 'Cut bottle in half, invert top into bottom, add soil and plant. The bottom holds water for slow release!' },
    { name: 'Piggy Bank', emoji: '🐷', difficulty: 'easy', points: 25, time: '20 min', desc: 'Paint bottle pink, add a coin slot, legs from bottle caps. Perfect for saving money sustainably!' },
    { name: 'Hanging Chandelier', emoji: '💡', difficulty: 'hard', points: 80, time: '3 hours', desc: 'Cut bottles into flower shapes, string them with LED lights for a stunning eco-chandelier.' },
    { name: 'Bird Feeder', emoji: '🐦', difficulty: 'easy', points: 35, time: '45 min', desc: 'Cut openings in bottle sides, insert wooden spoons as perches, fill with birdseed.' },
    { name: 'Mini Greenhouse', emoji: '🌿', difficulty: 'medium', points: 50, time: '1 hour', desc: 'Use large bottles as mini greenhouses for starting seeds. Cut top as a dome cover.' },
  ],
  '📰 Old Paper': [
    { name: 'Paper Mache Bowl', emoji: '🥣', difficulty: 'medium', points: 45, time: '2 hours', desc: 'Tear paper, dip in paste, layer over a balloon mold. Pop balloon when dry for a lightweight bowl.' },
    { name: 'Origami Gift Boxes', emoji: '🎁', difficulty: 'easy', points: 20, time: '15 min', desc: 'Fold newspaper into beautiful gift boxes. No tape needed! Great for zero-waste gifting.' },
    { name: 'Wall Art Collage', emoji: '🎨', difficulty: 'medium', points: 55, time: '2 hours', desc: 'Create stunning wall art using newspaper pages, colored magazines, and mod podge on canvas.' },
    { name: 'Seedling Pots', emoji: '🌱', difficulty: 'easy', points: 25, time: '30 min', desc: 'Roll newspaper into biodegradable seed starter pots. Plant directly in ground when ready!' },
    { name: 'Journal/Notebook', emoji: '📔', difficulty: 'medium', points: 40, time: '1 hour', desc: 'Stack and bind recycled paper pages, create a cardboard cover, decorate the outside.' },
  ],
  '👕 Fabric/Clothing': [
    { name: 'Tote Bag', emoji: '👜', difficulty: 'easy', points: 30, time: '1 hour', desc: 'Cut old t-shirt, sew bottom, create handles. Zero-waste shopping bag in under an hour!' },
    { name: 'Patchwork Quilt', emoji: '🛏️', difficulty: 'hard', points: 100, time: '8 hours', desc: 'Cut fabric scraps into squares, sew together in colorful patterns for a warm memory quilt.' },
    { name: 'Plant Pot Cozy', emoji: '🪴', difficulty: 'easy', points: 25, time: '30 min', desc: 'Wrap and tie old sweater sleeves around plant pots for an adorable boho plant display.' },
    { name: 'Dog Toy', emoji: '🐕', difficulty: 'easy', points: 20, time: '20 min', desc: 'Braid strips of old t-shirts into durable dog toys. Your pet will love it!' },
    { name: 'Rag Rug', emoji: '🏡', difficulty: 'medium', points: 65, time: '4 hours', desc: 'Weave fabric strips through a frame or loom to create colorful, durable floor rugs.' },
  ],
  '🥫 Tin Cans': [
    { name: 'Candle Holders', emoji: '🕯️', difficulty: 'easy', points: 25, time: '30 min', desc: 'Punch decorative patterns in cans with a nail, place tea lights inside for magical lighting effects.' },
    { name: 'Garden Planters', emoji: '🌻', difficulty: 'easy', points: 20, time: '20 min', desc: 'Paint tin cans in bright colors, add drainage holes, fill with soil and flowers for a herb garden.' },
    { name: 'Wind Chimes', emoji: '🎵', difficulty: 'medium', points: 45, time: '1.5 hours', desc: 'String together different sized cans with beads and wire to create melodic wind chimes.' },
    { name: 'Desk Organizer', emoji: '✏️', difficulty: 'easy', points: 30, time: '45 min', desc: 'Group tin cans of different sizes, wrap with rope or paint, glue together for a chic organizer.' },
  ],
  '🪵 Wood Scraps': [
    { name: 'Floating Shelf', emoji: '📚', difficulty: 'medium', points: 60, time: '2 hours', desc: 'Sand and polish wood scraps, mount with hidden brackets for minimalist floating shelves.' },
    { name: 'Picture Frames', emoji: '🖼️', difficulty: 'easy', points: 35, time: '45 min', desc: 'Cut scrap wood into frame shapes, sand smooth, stain or paint. Rustic charm guaranteed!' },
    { name: 'Garden Fence', emoji: '🌿', difficulty: 'hard', points: 85, time: '5 hours', desc: 'Build a charming garden border fence from various wood scraps and branches.' },
    { name: 'Charcuterie Board', emoji: '🧀', difficulty: 'medium', points: 50, time: '2 hours', desc: 'Sand a beautiful wood piece, add food-safe oil finish for a stunning serving board.' },
  ],
  '💻 Electronics': [
    { name: 'Circuit Board Art', emoji: '🎨', difficulty: 'medium', points: 55, time: '2 hours', desc: 'Frame old circuit boards as modern tech art pieces. Add LED backlighting for wow factor.' },
    { name: 'Keyboard Keycap Jewelry', emoji: '💍', difficulty: 'easy', points: 30, time: '1 hour', desc: 'Turn keyboard keys into unique pendants and earrings with key rings and jump rings.' },
    { name: 'Monitor Whiteboard', emoji: '📋', difficulty: 'hard', points: 75, time: '3 hours', desc: 'Disassemble old monitor, clean glass panel, mount as a writable glass board for your workspace.' },
  ],
  '🪟 Glass': [
    { name: 'Terrarium', emoji: '🌿', difficulty: 'medium', points: 55, time: '2 hours', desc: 'Fill glass jars with layers of pebbles, soil, and tiny plants for self-contained ecosystems.' },
    { name: 'Candle Jars', emoji: '🕯️', difficulty: 'easy', points: 25, time: '30 min', desc: 'Melt wax, add wicks and scents, pour into clean glass jars for beautiful scented candles.' },
    { name: 'Mosaic Art', emoji: '🎨', difficulty: 'hard', points: 90, time: '4 hours', desc: 'Safely break colored glass into pieces, arrange on tiles or boards to create stunning mosaics.' },
  ],
  '📦 Cardboard': [
    { name: 'Cat House', emoji: '🏠', difficulty: 'medium', points: 50, time: '2 hours', desc: 'Stack and glue boxes, cut doors and windows. Your cats will thank you for this castle!' },
    { name: 'Storage Boxes', emoji: '📦', difficulty: 'easy', points: 20, time: '30 min', desc: 'Wrap boxes in decorative paper, add dividers. Perfect stylish organizers for any room.' },
    { name: 'Dollhouse', emoji: '🏡', difficulty: 'hard', points: 95, time: '6 hours', desc: 'Build multi-story dollhouse from boxes, decorate rooms with fabric scraps and paper.' },
  ],
  '🎨 Old Paint': [
    { name: 'Painted Rocks Garden', emoji: '🪨', difficulty: 'easy', points: 20, time: '1 hour', desc: 'Paint collected rocks with leftover paint to create beautiful garden markers and art.' },
    { name: 'Abstract Canvas', emoji: '🖼️', difficulty: 'easy', points: 30, time: '1 hour', desc: 'Pour and blend leftover paints on canvas for stunning abstract pour paintings.' },
  ],
  '🔋 Batteries': [
    { name: 'Battery Clock', emoji: '🕐', difficulty: 'hard', points: 70, time: '3 hours', desc: 'Use battery cases as decorative elements in a unique wall clock design.' },
  ],
  '👟 Old Shoes': [
    { name: 'Shoe Planter', emoji: '🌸', difficulty: 'easy', points: 25, time: '20 min', desc: 'Fill old boots or shoes with soil and plant succulents or flowers for a quirky garden display.' },
    { name: 'Doorstop', emoji: '🚪', difficulty: 'easy', points: 15, time: '15 min', desc: 'Fill old shoe with sand or rocks, decorate creatively for a functional doorstop.' },
  ],
  '🛢️ Oil Containers': [
    { name: 'Watering Can', emoji: '🚿', difficulty: 'medium', points: 40, time: '1 hour', desc: 'Clean thoroughly, add perforated cap to spout for a DIY garden watering can.' },
    { name: 'Sand Castle Mold', emoji: '🏖️', difficulty: 'easy', points: 15, time: '10 min', desc: 'Cut bottom off container for a perfect beach or sandbox molding tool.' },
  ],
};

export const wasteTags = Object.keys(wasteDatabase);

export const defaultSuggestions: WasteSuggestion[] = [
  { name: 'Creative Art Installation', emoji: '🎨', difficulty: 'medium', points: 60, time: '2 hours', desc: 'Transform your material into an eye-catching art installation that tells an environmental story.' },
  { name: 'Functional Storage', emoji: '📦', difficulty: 'easy', points: 30, time: '45 min', desc: 'Clean and repurpose your material as a creative storage container for your home or office.' },
  { name: 'Garden Feature', emoji: '🌿', difficulty: 'easy', points: 35, time: '1 hour', desc: 'Use your material as a unique garden border, planter, or decorative feature.' },
];
