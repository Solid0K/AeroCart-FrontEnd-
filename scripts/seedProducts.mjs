// Seeds the catalog with a handful of real products (real Unsplash photos,
// no placeholder icons) by calling your actual running backend — this does
// not touch the database directly, it just drives the same admin API the
// UI uses.
//
// Requires an account that already has the Admin role. The public /auth
// endpoints can only ever create Role.User accounts (see
// AuthService.registerUser), so there is currently no API-only way to
// create the first admin — you have to either:
//   a) register a normal user, then flip their role to Admin directly in
//      MongoDB (e.g. in mongosh: db.Users.updateOne({email:"you@x.com"},
//      {$push:{roles:"Admin"}})), or
//   b) already have an admin account from earlier.
//
// Usage:
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword npm run seed:products
//
// Optional:
//   API_BASE_URL=http://localhost:8080   (defaults to this)

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing credentials. Run with:\n" +
      "  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpassword npm run seed:products"
  );
  process.exit(1);
}

// Real Unsplash photos, all published under the Unsplash License (free for
// commercial use, no attribution required). Query params request a
// reasonably sized, cropped JPEG so product cards don't load full-res
// originals.
const IMG = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const PRODUCTS = [
  {
    name: "Aero Wireless Over-Ear Headphones",
    description:
      "Noise-isolating over-ear headphones with 30-hour battery life and a foldable frame for travel.",
    price: 129.99,
    category: "Audio",
    stockQuantity: 40,
    imageUrls: [IMG("photo-1567928513899-997d98489fbd")],
  },
  {
    name: "Orbit Compact Smart Speaker",
    description:
      "Room-filling sound from a speaker small enough to fit on a nightstand, with voice assistant support.",
    price: 89.0,
    category: "Home",
    stockQuantity: 25,
    imageUrls: [IMG("photo-1605648916361-9bc12ad6a569")],
  },
  {
    name: "Glow Minimalist LED Desk Lamp",
    description:
      "Adjustable warm-to-cool LED lamp with a touch dimmer, built for long work sessions.",
    price: 45.5,
    category: "Home",
    stockQuantity: 60,
    imageUrls: [IMG("photo-1533090161767-e6ffed986c88")],
  },
  {
    name: "Pulse Fitness Smartwatch",
    description:
      "Tracks heart rate, sleep, and workouts, with a always-on display and a week of battery life.",
    price: 199.0,
    category: "Wearables",
    stockQuantity: 15,
    imageUrls: [IMG("photo-1722153105551-cfea928e80de")],
  },
  {
    name: "Stride Everyday Running Shoes",
    description:
      "Lightweight cushioned running shoes built for daily mileage on pavement or trail.",
    price: 79.99,
    category: "Footwear",
    stockQuantity: 50,
    imageUrls: [IMG("photo-1562183241-b937e95585b6")],
  },
  {
    name: "Voyage Leather Weekend Backpack",
    description:
      "Full-grain leather backpack with a padded laptop sleeve, built to age well with daily use.",
    price: 110.0,
    category: "Accessories",
    stockQuantity: 20,
    imageUrls: [IMG("photo-1622560480605-d83c853bc5c3")],
  },
  {
    name: "Drip Pour-Over Coffee Maker",
    description:
      "A slow, even pour-over brewer with a reusable stainless steel filter — no paper filters needed.",
    price: 34.99,
    category: "Kitchen",
    stockQuantity: 35,
    imageUrls: [IMG("photo-1679144949637-c99b6ab82f16")],
  },
  {
    name: "Keystroke Mechanical Keyboard",
    description:
      "Hot-swappable mechanical keyboard with tactile switches and per-key backlighting.",
    price: 95.0,
    category: "Accessories",
    stockQuantity: 18,
    imageUrls: [IMG("photo-1566748861876-c7e74c17eb5a")],
  },
];

async function signIn() {
  const res = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`Sign in failed (${res.status}): ${await res.text()}`);
  }
  // AuthController.login returns the raw token string, not JSON.
  return res.text();
}

async function addProduct(token, product) {
  const res = await fetch(`${API_BASE_URL}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  if (!res.ok) {
    throw new Error(`(${res.status}) ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  console.log(`Signing in as ${ADMIN_EMAIL}…`);
  const token = await signIn();

  console.log(`Adding ${PRODUCTS.length} products to ${API_BASE_URL}…\n`);
  let succeeded = 0;
  for (const product of PRODUCTS) {
    try {
      const created = await addProduct(token, product);
      console.log(`  ✓ ${created.name}  (sku: ${created.sku})`);
      succeeded++;
    } catch (err) {
      console.log(`  ✗ ${product.name}  — ${err.message}`);
    }
  }

  console.log(`\n${succeeded}/${PRODUCTS.length} products added.`);
  if (succeeded < PRODUCTS.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
