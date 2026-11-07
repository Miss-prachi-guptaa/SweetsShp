import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Chicksum Database...');

  // Clean existing records
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.review.deleteMany();

  // Create Categories
  const chicken = await prisma.category.create({
    data: {
      name: 'Chicken',
      slug: 'chicken',
      description: 'Tender cuts, curry cuts, and farm-fresh choices',
      image: '/categories/chicken.png',
    },
  });

  const mutton = await prisma.category.create({
    data: {
      name: 'Mutton',
      slug: 'mutton',
      description: 'Rich, flavourful & hand-cut pasture goat meat',
      image: '/categories/mutton.png',
    },
  });

  const seafood = await prisma.category.create({
    data: {
      name: 'Seafood',
      slug: 'seafood',
      description: 'Fresh daily catch, cleaned and portioned',
      image: '/categories/seafood.png',
    },
  });

  // Create Products
  const products = [
    {
      name: 'Desi Cockrel Chicken',
      slug: 'desi-cockrel-chicken',
      description: 'Free-range country rooster meat with authentic rustic flavour and lean texture. Perfect for traditional slow-cooked curries.',
      price: 400.0,
      originalPrice: 450.0,
      weight: '1 kg',
      cutType: 'Curry Cut (Medium)',
      categoryId: chicken.id,
      image: '/products/desi-chicken.jpeg',
      tag: 'Farm fresh',
      rating: 4.9,
      reviewsCount: 184,
      isFeatured: true,
    },
    {
      name: 'Chicken Lollipop',
      slug: 'chicken-lollipop',
      description: 'Frenched chicken winglets expertly cut and prepared for restaurant-style frying or baking. Kids and party favourite.',
      price: 360.0,
      originalPrice: 400.0,
      weight: '1 kg (16-18 pcs)',
      cutType: 'Winglet Lollipops',
      categoryId: chicken.id,
      image: '/products/chicken-lollipop.jpeg',
      tag: 'Bestseller',
      rating: 4.8,
      reviewsCount: 312,
      isFeatured: true,
    },
    {
      name: 'Chicken Keema (Minced)',
      slug: 'chicken-keema',
      description: 'Extra fine mince made strictly from clean boneless breast and thigh meat. Ideal for kebabs, samosas, and keema matar.',
      price: 200.0,
      originalPrice: 230.0,
      weight: '500 g',
      cutType: 'Finely Minced',
      categoryId: chicken.id,
      image: '/products/chicken-keema.png',
      tag: 'High Protein',
      rating: 4.7,
      reviewsCount: 95,
      isFeatured: false,
    },
    {
      name: 'Chicken Curry Cut (Skinless)',
      slug: 'chicken-curry-cut',
      description: 'Evenly proportioned bone-in curry cut pieces including drumsticks, breast, and thighs for rich gravy cooking.',
      price: 135.0,
      originalPrice: 160.0,
      weight: '500 g',
      cutType: 'Curry Cut (12-14 pcs)',
      categoryId: chicken.id,
      image: '/products/chicken-curry.png',
      tag: 'Everyday Value',
      rating: 4.8,
      reviewsCount: 520,
      isFeatured: true,
    },
    {
      name: 'Boneless Chicken Breast',
      slug: 'boneless-chicken-breast',
      description: 'Trimmed tender fillets without skin or bone. Low calorie, high protein, perfect for grilling, wraps, and meal prep.',
      price: 175.0,
      originalPrice: 210.0,
      weight: '500 g',
      cutType: 'Clean Fillets',
      categoryId: chicken.id,
      image: '/products/chicken-breast.png',
      tag: 'Lean & Clean',
      rating: 4.9,
      reviewsCount: 278,
      isFeatured: true,
    },
    {
      name: 'Chicken Liver — Kaleji',
      slug: 'chicken-liver-kaleji',
      description: 'Nutrient-rich, fresh chicken liver cleaned with zero bile contact. High in iron, vitamin A, and mineral richness.',
      price: 180.0,
      originalPrice: 200.0,
      weight: '500 g',
      cutType: 'Whole Cleaned',
      categoryId: chicken.id,
      image: '/products/chicken-liver.png',
      tag: 'Iron Rich',
      rating: 4.6,
      reviewsCount: 82,
      isFeatured: false,
    },
    {
      name: 'Mutton Curry Pieces (Goat)',
      slug: 'mutton-curry-pieces',
      description: 'Tender goat curry cut from leg, shoulder, and ribs. Balanced mix of meat and marrow bones for aromatic gravies.',
      price: 340.0,
      originalPrice: 390.0,
      weight: '500 g',
      cutType: 'Curry Cut (Medium Bone-in)',
      categoryId: mutton.id,
      image: '/products/mutton.png',
      tag: 'Hand Cut',
      rating: 4.9,
      reviewsCount: 410,
      isFeatured: true,
    },
    {
      name: 'Mutton Liver (Kaleji)',
      slug: 'mutton-liver',
      description: 'Fresh goat liver meticulously handled and thoroughly washed. Velvety texture and earthy taste when stir-fried.',
      price: 360.0,
      originalPrice: 420.0,
      weight: '500 g',
      cutType: 'Diced Cubes',
      categoryId: mutton.id,
      image: '/products/mutton-liver.jpeg',
      tag: 'Chef Choice',
      rating: 4.7,
      reviewsCount: 140,
      isFeatured: false,
    },
    {
      name: 'Tengra Fish (River Ar)',
      slug: 'tengra-fish',
      description: 'Sweetwater river tengra fish, freshly caught and degutted. Loved for its delicate flesh and authentic Bengali style jhol.',
      price: 430.0,
      originalPrice: 490.0,
      weight: '600 g (Gross)',
      cutType: 'Whole Cleaned & Gutted',
      categoryId: seafood.id,
      image: '/products/tengra.jpeg',
      tag: 'Fresh Catch',
      rating: 4.8,
      reviewsCount: 165,
      isFeatured: true,
    },
    {
      name: 'Payasi Boneless Fillets',
      slug: 'payasi-boneless-fillets',
      description: 'Zero bone white fish fillets with a mild aroma and firm flake. Best suited for fish finger, rava fry, and continental dishes.',
      price: 480.0,
      originalPrice: 550.0,
      weight: '1 kg',
      cutType: 'Boneless Fillets',
      categoryId: seafood.id,
      image: '/products/fish-fillet.png',
      tag: 'Zero Bone',
      rating: 4.9,
      reviewsCount: 220,
      isFeatured: true,
    },
    {
      name: 'Papda Fish',
      slug: 'papda-fish',
      description: 'Delicate freshwater butterfish with soft bone structure and buttery taste. Sourced early morning from certified fisheries.',
      price: 450.0,
      originalPrice: 510.0,
      weight: '600 g',
      cutType: 'Whole Cleaned',
      categoryId: seafood.id,
      image: '/products/papda.jpeg',
      tag: 'Regional Delicacy',
      rating: 4.7,
      reviewsCount: 118,
      isFeatured: false,
    },
    {
      name: 'King Prawns (Jumbo)',
      slug: 'king-prawns',
      description: 'Pristine coastal jumbo prawns peeled and deveined with tail on. Succulent, naturally sweet, ready to cook in minutes.',
      price: 680.0,
      originalPrice: 780.0,
      weight: '250 g (Cleaned)',
      cutType: 'Peeled & Deveined (Tail-on)',
      categoryId: seafood.id,
      image: '/products/prawns.jpeg',
      tag: 'Premium Catch',
      rating: 5.0,
      reviewsCount: 345,
      isFeatured: true,
    },
  ];

  for (const item of products) {
    await prisma.product.create({ data: item });
  }

  // Reviews
  const reviews = [
    {
      author: 'Rohit K.',
      location: 'Boring Road, Patna',
      rating: 5,
      comment: 'The chicken was so fresh and properly cleaned! Delivery arrived in 45 minutes flat. Will never buy from open butcher shops again.',
    },
    {
      author: 'Priya Verma',
      location: 'Kankarbagh, Patna',
      rating: 5,
      comment: 'Super impressed with the king prawns and mutton curry cut. Vacuum sealed packaging with ice packs kept everything chilled.',
    },
    {
      author: 'Anil Sinha',
      location: 'Bailey Road, Patna',
      rating: 5,
      comment: 'Honest weight after cleaning! Normally local shops charge gross weight with high wastage. Chicksum gives real value.',
    },
  ];

  for (const r of reviews) {
    await prisma.review.create({ data: r });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
