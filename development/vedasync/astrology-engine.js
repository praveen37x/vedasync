/**
 * Vedasync Astrology Engine
 * Handles astronomical approximations, Vedic charts, and Ashtakoota compatibility.
 */

// 27 Nakshatras
const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", animal: "Horse", gana: "Deva", nadi: "Adi" },
  { name: "Bharani", lord: "Venus", animal: "Elephant", gana: "Manushya", nadi: "Madhya" },
  { name: "Krittika", lord: "Sun", animal: "Sheep", gana: "Rakshasa", nadi: "Antya" },
  { name: "Rohini", lord: "Moon", animal: "Serpent", gana: "Manushya", nadi: "Antya" },
  { name: "Mrigashira", lord: "Mars", animal: "Serpent", gana: "Deva", nadi: "Madhya" },
  { name: "Ardra", lord: "Rahu", animal: "Dog", gana: "Manushya", nadi: "Adi" },
  { name: "Punarvasu", lord: "Jupiter", animal: "Cat", gana: "Deva", nadi: "Adi" },
  { name: "Pushya", lord: "Saturn", animal: "Sheep", gana: "Deva", nadi: "Madhya" },
  { name: "Ashlesha", lord: "Mercury", animal: "Cat", gana: "Rakshasa", nadi: "Antya" },
  { name: "Magha", lord: "Ketu", animal: "Rat", gana: "Rakshasa", nadi: "Antya" },
  { name: "Purva Phalguni", lord: "Venus", animal: "Rat", gana: "Manushya", nadi: "Madhya" },
  { name: "Uttara Phalguni", lord: "Sun", animal: "Cow", gana: "Manushya", nadi: "Adi" },
  { name: "Hasta", lord: "Moon", animal: "Buffalo", gana: "Deva", nadi: "Adi" },
  { name: "Chitra", lord: "Mars", animal: "Tiger", gana: "Rakshasa", nadi: "Madhya" },
  { name: "Swati", lord: "Rahu", animal: "Buffalo", gana: "Deva", nadi: "Antya" },
  { name: "Vishakha", lord: "Jupiter", animal: "Tiger", gana: "Rakshasa", nadi: "Antya" },
  { name: "Anuradha", lord: "Saturn", animal: "Hare", gana: "Deva", nadi: "Madhya" },
  { name: "Jyeshtha", lord: "Mercury", animal: "Hare", gana: "Rakshasa", nadi: "Adi" },
  { name: "Mula", lord: "Ketu", animal: "Dog", gana: "Rakshasa", nadi: "Adi" },
  { name: "Purva Ashadha", lord: "Venus", animal: "Monkey", gana: "Manushya", nadi: "Madhya" },
  { name: "Uttara Ashadha", lord: "Sun", animal: "Mongoose", gana: "Manushya", nadi: "Antya" },
  { name: "Shravana", lord: "Moon", animal: "Monkey", gana: "Deva", nadi: "Antya" },
  { name: "Dhanishta", lord: "Mars", animal: "Lion", gana: "Rakshasa", nadi: "Madhya" },
  { name: "Shatabhisha", lord: "Rahu", animal: "Horse", gana: "Rakshasa", nadi: "Adi" },
  { name: "Purva Bhadrapada", lord: "Jupiter", animal: "Lion", gana: "Manushya", nadi: "Adi" },
  { name: "Uttara Bhadrapada", lord: "Saturn", animal: "Cow", gana: "Manushya", nadi: "Madhya" },
  { name: "Revati", lord: "Mercury", animal: "Elephant", gana: "Deva", nadi: "Antya" }
];

// 12 Rashis (Zodiac Signs)
const RASHIS = [
  { name: "Mesha (Aries)", ruler: "Mars", element: "Fire", varna: "Kshatriya", vashya: "Chatushpada" },
  { name: "Vrishabha (Taurus)", ruler: "Venus", element: "Earth", varna: "Vaishya", vashya: "Chatushpada" },
  { name: "Mithuna (Gemini)", ruler: "Mercury", element: "Air", varna: "Shudra", vashya: "Manusha" },
  { name: "Karka (Cancer)", ruler: "Moon", element: "Water", varna: "Brahmin", vashya: "Jalachar" },
  { name: "Simha (Leo)", ruler: "Sun", element: "Fire", varna: "Kshatriya", vashya: "Vanachar" },
  { name: "Kanya (Virgo)", ruler: "Mercury", element: "Earth", varna: "Vaishya", vashya: "Manusha" },
  { name: "Tula (Libra)", ruler: "Venus", element: "Air", varna: "Shudra", vashya: "Manusha" },
  { name: "Vrishchika (Scorpio)", ruler: "Mars", element: "Water", varna: "Brahmin", vashya: "Keeta" },
  { name: "Dhanu (Sagittarius)", ruler: "Jupiter", element: "Fire", varna: "Kshatriya", vashya: "Manusha" },
  { name: "Makara (Capricorn)", ruler: "Saturn", element: "Earth", varna: "Vaishya", vashya: "Jalachar" },
  { name: "Kumbha (Aquarius)", ruler: "Saturn", element: "Air", varna: "Shudra", vashya: "Manusha" },
  { name: "Meena (Pisces)", ruler: "Jupiter", element: "Water", varna: "Brahmin", vashya: "Jalachar" }
];

// Relationships between planets (Friendly, Neutral, Inimical)
// 0: Inimical, 1: Neutral, 2: Friendly
const PLANETARY_FRIENDSHIP = {
  "Sun": { "Sun": 2, "Moon": 2, "Mars": 2, "Mercury": 1, "Jupiter": 2, "Venus": 0, "Saturn": 0 },
  "Moon": { "Sun": 2, "Moon": 2, "Mars": 1, "Mercury": 2, "Jupiter": 1, "Venus": 1, "Saturn": 1 },
  "Mars": { "Sun": 2, "Moon": 2, "Mars": 2, "Mercury": 0, "Jupiter": 2, "Venus": 1, "Saturn": 1 },
  "Mercury": { "Sun": 2, "Moon": 0, "Mars": 1, "Mercury": 2, "Jupiter": 1, "Venus": 2, "Saturn": 2 },
  "Jupiter": { "Sun": 2, "Moon": 2, "Mars": 2, "Mercury": 0, "Jupiter": 2, "Venus": 0, "Saturn": 1 },
  "Venus": { "Sun": 0, "Moon": 0, "Mars": 1, "Mercury": 2, "Jupiter": 1, "Venus": 2, "Saturn": 2 },
  "Saturn": { "Sun": 0, "Moon": 0, "Mars": 0, "Mercury": 2, "Jupiter": 1, "Venus": 2, "Saturn": 2 }
};

// Animal relationship chart for Yoni Koota
// 0: Enemy, 1: Friendly, 2: Neutral, 3: Very Friendly, 4: Same Animal (Perfect)
const YONI_COMPATIBILITY = {
  "Horse": { "Horse": 4, "Elephant": 2, "Sheep": 3, "Serpent": 2, "Dog": 1, "Cat": 2, "Rat": 1, "Cow": 2, "Buffalo": 1, "Tiger": 1, "Hare": 2, "Monkey": 3, "Lion": 1, "Mongoose": 0 },
  "Elephant": { "Horse": 2, "Elephant": 4, "Sheep": 2, "Serpent": 3, "Dog": 2, "Cat": 2, "Rat": 1, "Cow": 2, "Buffalo": 3, "Tiger": 0, "Hare": 2, "Monkey": 2, "Lion": 0, "Mongoose": 1 },
  "Sheep": { "Horse": 3, "Elephant": 2, "Sheep": 4, "Serpent": 2, "Dog": 1, "Cat": 2, "Rat": 2, "Cow": 3, "Buffalo": 2, "Tiger": 1, "Hare": 1, "Monkey": 2, "Lion": 1, "Mongoose": 2 },
  "Serpent": { "Horse": 2, "Elephant": 3, "Sheep": 2, "Serpent": 4, "Dog": 2, "Cat": 2, "Rat": 1, "Cow": 2, "Buffalo": 2, "Tiger": 2, "Hare": 1, "Monkey": 0, "Lion": 2, "Mongoose": 0 },
  "Dog": { "Horse": 1, "Elephant": 2, "Sheep": 1, "Serpent": 2, "Dog": 4, "Cat": 0, "Rat": 2, "Cow": 1, "Buffalo": 2, "Tiger": 2, "Hare": 0, "Monkey": 2, "Lion": 1, "Mongoose": 1 },
  "Cat": { "Horse": 2, "Elephant": 2, "Sheep": 2, "Serpent": 2, "Dog": 0, "Cat": 4, "Rat": 0, "Cow": 2, "Buffalo": 2, "Tiger": 1, "Hare": 3, "Monkey": 2, "Lion": 1, "Mongoose": 2 },
  "Rat": { "Horse": 1, "Elephant": 1, "Sheep": 2, "Serpent": 1, "Dog": 2, "Cat": 0, "Rat": 4, "Cow": 2, "Buffalo": 2, "Tiger": 1, "Hare": 2, "Monkey": 1, "Lion": 2, "Mongoose": 0 },
  "Cow": { "Horse": 2, "Elephant": 2, "Sheep": 3, "Serpent": 2, "Dog": 1, "Cat": 2, "Rat": 2, "Cow": 4, "Buffalo": 3, "Tiger": 0, "Hare": 2, "Monkey": 2, "Lion": 0, "Mongoose": 1 },
  "Buffalo": { "Horse": 1, "Elephant": 3, "Sheep": 2, "Serpent": 2, "Dog": 2, "Cat": 2, "Rat": 2, "Cow": 3, "Buffalo": 4, "Tiger": 1, "Hare": 2, "Monkey": 1, "Lion": 1, "Mongoose": 2 },
  "Tiger": { "Horse": 1, "Elephant": 0, "Sheep": 1, "Serpent": 2, "Dog": 2, "Cat": 1, "Rat": 1, "Cow": 0, "Buffalo": 1, "Tiger": 4, "Hare": 1, "Monkey": 2, "Lion": 3, "Mongoose": 2 },
  "Hare": { "Horse": 2, "Elephant": 2, "Sheep": 1, "Serpent": 1, "Dog": 0, "Cat": 3, "Rat": 2, "Cow": 2, "Buffalo": 2, "Tiger": 1, "Hare": 4, "Monkey": 2, "Lion": 1, "Mongoose": 2 },
  "Monkey": { "Horse": 3, "Elephant": 2, "Sheep": 2, "Serpent": 0, "Dog": 2, "Cat": 2, "Rat": 1, "Cow": 2, "Buffalo": 1, "Tiger": 2, "Hare": 2, "Monkey": 4, "Lion": 1, "Mongoose": 1 },
  "Lion": { "Horse": 1, "Elephant": 0, "Sheep": 1, "Serpent": 2, "Dog": 1, "Cat": 1, "Rat": 2, "Cow": 0, "Buffalo": 1, "Tiger": 3, "Hare": 1, "Monkey": 1, "Lion": 4, "Mongoose": 2 },
  "Mongoose": { "Horse": 0, "Elephant": 1, "Sheep": 2, "Serpent": 0, "Dog": 1, "Cat": 2, "Rat": 0, "Cow": 1, "Buffalo": 2, "Tiger": 2, "Hare": 2, "Monkey": 1, "Lion": 2, "Mongoose": 4 }
};

// Sidereal Periods (cycles in Earth days)
const PLANETARY_CYCLES = {
  "Sun": 365.256,
  "Moon": 27.321,
  "Mars": 686.980,
  "Mercury": 87.969,
  "Jupiter": 4332.589,
  "Venus": 224.701,
  "Saturn": 10759.22,
  "Rahu": 6793.5  // Retrograde cycle
};

// Sidereal position offsets relative to Aries 0 degrees on epoch (Jan 1, 2000 00:00:00 UTC)
const EPOCH_POSITIONS = {
  "Sun": 256.4,
  "Moon": 218.6,
  "Mars": 320.1,
  "Mercury": 250.7,
  "Jupiter": 25.3,
  "Venus": 290.4,
  "Saturn": 42.8,
  "Rahu": 110.5
};

const EPOCH = new Date("2000-01-01T00:00:00Z");

/**
 * Calculates planetary positions based on cycles
 * @param {Date} date - date of birth
 * @param {number} timeOffsetHrs - hours of the day (0-24)
 * @returns {Object} map of planet to its Nirayana longitude (0-360)
 */
function calculatePlanetaryPositions(date, timeOffsetHrs) {
  const localDate = new Date(date);
  localDate.setHours(localDate.getHours() + timeOffsetHrs);
  const diffTime = localDate.getTime() - EPOCH.getTime();
  const elapsedDays = diffTime / (1000 * 60 * 60 * 24);

  const positions = {};
  for (const planet in EPOCH_POSITIONS) {
    const cycle = PLANETARY_CYCLES[planet];
    const initial = EPOCH_POSITIONS[planet];
    let pos;
    if (planet === "Rahu") {
      // Retrograde
      pos = (initial - (elapsedDays * 360 / cycle)) % 360;
    } else {
      pos = (initial + (elapsedDays * 360 / cycle)) % 360;
    }
    if (pos < 0) pos += 360;
    positions[planet] = Math.round(pos * 100) / 100;
  }
  // Ketu is always opposite Rahu
  positions["Ketu"] = (positions["Rahu"] + 180) % 360;
  return positions;
}

/**
 * Safely parses any time string (24h, 12h AM/PM, etc.) to decimal hours (0.0 - 24.0)
 */
function parseTimeToDecimal(timeString) {
  if (!timeString && timeString !== 0) return 12.0;
  if (typeof timeString === "number") return timeString;
  const str = String(timeString).trim();
  const isPM = /pm/i.test(str);
  const isAM = /am/i.test(str);
  const clean = str.replace(/[^\d:]/g, "");
  const parts = clean.split(":").map(p => parseInt(p, 10) || 0);
  let hrs = parts[0] !== undefined ? parts[0] : 12;
  const mins = parts[1] !== undefined ? parts[1] : 0;

  if (isPM && hrs < 12) hrs += 12;
  if (isAM && hrs === 12) hrs = 0;

  return hrs + (mins / 60);
}

/**
 * Computes Ascendant (Lagna) based on sun position and birth time
 * Lagna moves 15 degrees per hour starting from Sun's longitude at Sunrise (approx 6:00 AM local)
 */
function calculateLagna(sunLongitude, timeString) {
  const birthTimeDecimal = parseTimeToDecimal(timeString);
  // Assumes sunrise at 06:00
  let diffHours = birthTimeDecimal - 6.0;
  if (diffHours < 0) diffHours += 24;

  const lagna = (sunLongitude + diffHours * 15) % 360;
  return Math.round(lagna * 100) / 100;
}

/**
 * Maps a longitude to its Rashi (0-11 index)
 */
function getRashiIndex(longitude) {
  return Math.floor(longitude / 30);
}

/**
 * Maps a longitude to its Nakshatra (0-26 index)
 */
function getNakshatraIndex(longitude) {
  return Math.floor(longitude / (13 + 1/3));
}

/**
 * Calculates Navamsha (D9) Sign Index (0-11) for a given sidereal longitude
 */
function getNavamshaRashiIndex(longitude) {
  const rIdx = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.floor(degInSign / 3.333333); // 30 degrees divided into 9 parts of 3°20' each

  let startSignIdx = 0;
  const element = RASHIS[rIdx].element;
  if (element === "Fire") startSignIdx = 0; // Aries
  else if (element === "Earth") startSignIdx = 9; // Capricorn
  else if (element === "Air") startSignIdx = 6; // Libra
  else if (element === "Water") startSignIdx = 3; // Cancer

  return (startSignIdx + part) % 12;
}

/**
 * Calculates complete birth details
 */
function getBirthProfile(name, dobString, tobString, pobString) {
  let birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) {
    birthDate = new Date();
  }
  const decimalHours = parseTimeToDecimal(tobString);
  
  const planets = calculatePlanetaryPositions(birthDate, decimalHours);
  const lagnaDegrees = calculateLagna(planets["Sun"], tobString);

  const moonLong = planets["Moon"];
  const moonRashiIdx = getRashiIndex(moonLong);
  const moonNakIdx = getNakshatraIndex(moonLong);

  const sunLong = planets["Sun"];
  const sunRashiIdx = getRashiIndex(sunLong);
  const sunNakIdx = getNakshatraIndex(sunLong);

  const lagnaRashiIdx = getRashiIndex(lagnaDegrees);

  const nakshatra = NAKSHATRAS[moonNakIdx];
  const rashi = RASHIS[moonRashiIdx];
  
  // Calculate D1 Lagna houses (House 1 starts at Lagna Rashi)
  const planetHouses = {};
  for (const planet in planets) {
    const planetRashi = getRashiIndex(planets[planet]);
    let house = planetRashi - lagnaRashiIdx + 1;
    if (house <= 0) house += 12;
    planetHouses[planet] = house;
  }

  // Calculate D1 Chandra houses (House 1 starts at Moon Rashi)
  const chandraHouses = {};
  for (const planet in planets) {
    const planetRashi = getRashiIndex(planets[planet]);
    let house = planetRashi - moonRashiIdx + 1;
    if (house <= 0) house += 12;
    chandraHouses[planet] = house;
  }

  // Calculate D9 Navamsha sign indices and houses
  const navamshaRashiIndices = {};
  const navamshaHouses = {};
  const lagnaNavRashiIdx = getNavamshaRashiIndex(lagnaDegrees);
  
  navamshaRashiIndices["Lagna"] = lagnaNavRashiIdx;
  for (const planet in planets) {
    const navRashi = getNavamshaRashiIndex(planets[planet]);
    navamshaRashiIndices[planet] = navRashi;
    
    let house = navRashi - lagnaNavRashiIdx + 1;
    if (house <= 0) house += 12;
    navamshaHouses[planet] = house;
  }

  // Calculate planetary signs in D1
  const planetSigns = {};
  for (const planet in planets) {
    const rIdx = getRashiIndex(planets[planet]);
    planetSigns[planet] = RASHIS[rIdx].name.split(" ")[0];
  }

  // Calculate planetary signs in D9
  const planetNavSigns = {};
  for (const planet in planets) {
    const rIdx = navamshaRashiIndices[planet];
    planetNavSigns[planet] = RASHIS[rIdx].name.split(" ")[0];
  }

  return {
    name,
    dob: dobString,
    tob: tobString,
    pob: pobString,
    planets,
    lagna: {
      degrees: lagnaDegrees,
      rashi: RASHIS[lagnaRashiIdx].name,
      rashiIndex: lagnaRashiIdx,
      navRashiIndex: lagnaNavRashiIdx,
      navRashiName: RASHIS[lagnaNavRashiIdx].name
    },
    moonSign: {
      name: rashi.name,
      rashiIndex: moonRashiIdx,
      ruler: rashi.ruler,
      element: rashi.element,
      varna: rashi.varna
    },
    nakshatra: {
      name: nakshatra.name,
      index: moonNakIdx,
      pada: Math.floor((moonLong % 13.333) / 3.333) + 1,
      lord: nakshatra.lord,
      animal: nakshatra.animal,
      gana: nakshatra.gana,
      nadi: nakshatra.nadi
    },
    sunSign: RASHIS[sunRashiIdx].name,
    planetHouses,
    chandraHouses,
    navamshaRashiIndices,
    navamshaHouses,
    planetSigns,
    planetNavSigns
  };
}

/**
 * Calculates Ashtakoota Compatibility Score (out of 36)
 */
function calculateCompatibility(boyProfile, girlProfile) {
  const boyNak = NAKSHATRAS[boyProfile.nakshatra.index];
  const girlNak = NAKSHATRAS[girlProfile.nakshatra.index];
  const boyRashi = RASHIS[boyProfile.moonSign.rashiIndex];
  const girlRashi = RASHIS[girlProfile.moonSign.rashiIndex];

  let scoreBreakdown = {
    varna: { max: 1, secured: 0, description: "" },
    vashya: { max: 2, secured: 0, description: "" },
    tara: { max: 3, secured: 0, description: "" },
    yoni: { max: 4, secured: 0, description: "" },
    maitri: { max: 5, secured: 0, description: "" },
    gana: { max: 6, secured: 0, description: "" },
    bhakoot: { max: 7, secured: 0, description: "" },
    nadi: { max: 8, secured: 0, description: "" }
  };

  let totalScore = 0;

  // 1. Varna (Mental Compatibility/Work Style)
  const varnaWeights = { "Brahmin": 4, "Kshatriya": 3, "Vaishya": 2, "Shudra": 1 };
  if (varnaWeights[boyRashi.varna] >= varnaWeights[girlRashi.varna]) {
    scoreBreakdown.varna.secured = 1;
    scoreBreakdown.varna.description = "Excellent. High alignment of work ethics, ego compatibility, and life values.";
  } else {
    scoreBreakdown.varna.secured = 0;
    scoreBreakdown.varna.description = "Average. Slight differences in spiritual values and career ambitions.";
  }

  // 2. Vashya (Mutual Attraction and Influence)
  if (boyRashi.vashya === girlRashi.vashya) {
    scoreBreakdown.vashya.secured = 2;
    scoreBreakdown.vashya.description = "Perfect. High level of mutual magnetic attraction and emotional bonding.";
  } else if (
    (boyRashi.vashya === "Manusha" && girlRashi.vashya === "Chatushpada") || 
    (boyRashi.vashya === "Manusha" && girlRashi.vashya === "Jalachar")
  ) {
    scoreBreakdown.vashya.secured = 1;
    scoreBreakdown.vashya.description = "Good. Normal compatibility with general understanding and care.";
  } else {
    scoreBreakdown.vashya.secured = 0;
    scoreBreakdown.vashya.description = "Low. Potential for struggle over control and power dynamics in the relationship.";
  }

  // 3. Tara (Destiny/Lifespan/Health)
  // Distance from boy's Nakshatra to girl's, and vice versa
  const dist1 = (girlProfile.nakshatra.index - boyProfile.nakshatra.index + 27) % 9 || 9;
  const dist2 = (boyProfile.nakshatra.index - girlProfile.nakshatra.index + 27) % 9 || 9;
  
  const badTaras = [3, 5, 7]; // Vipat, Pratyari, Naidhana taras
  const tara1Bad = badTaras.includes(dist1);
  const tara2Bad = badTaras.includes(dist2);

  if (!tara1Bad && !tara2Bad) {
    scoreBreakdown.tara.secured = 3;
    scoreBreakdown.tara.description = "Perfect. Astrological taras are highly auspicious, indicating safety, longevity, and wealth.";
  } else if (!tara1Bad || !tara2Bad) {
    scoreBreakdown.tara.secured = 1.5;
    scoreBreakdown.tara.description = "Average. Mixed influences. One partner may face minor health or stability challenges.";
  } else {
    scoreBreakdown.tara.secured = 0;
    scoreBreakdown.tara.description = "Difficult. Unfavorable taras could lead to sudden obstacles or health complications.";
  }

  // 4. Yoni (Physical/Sexual Compatibility)
  const yoniScore = YONI_COMPATIBILITY[boyNak.animal][girlNak.animal];
  scoreBreakdown.yoni.secured = yoniScore;
  if (yoniScore === 4) {
    scoreBreakdown.yoni.description = "Perfect. Same animal group, representing the highest physical and sexual harmony.";
  } else if (yoniScore === 3) {
    scoreBreakdown.yoni.description = "Highly Compatible. Great intimate chemistry and mutual biological comfort.";
  } else if (yoniScore === 2) {
    scoreBreakdown.yoni.description = "Neutral. Balanced physical relationship without major issues.";
  } else if (yoniScore === 1) {
    scoreBreakdown.yoni.description = "Low. Slight friction and difference in physical expectations.";
  } else {
    scoreBreakdown.yoni.description = "Incompatible. Inimical animal group (e.g. Cat and Rat), suggesting potential physical discord.";
  }

  // 5. Maitri (Intellectual Harmony/Friendship of Rulers)
  const boyRuler = boyRashi.ruler;
  const girlRuler = girlRashi.ruler;
  const friendship1 = PLANETARY_FRIENDSHIP[boyRuler][girlRuler] ?? 1;
  const friendship2 = PLANETARY_FRIENDSHIP[girlRuler][boyRuler] ?? 1;
  
  const avgFriendship = (friendship1 + friendship2) / 2;
  if (avgFriendship === 2) {
    scoreBreakdown.maitri.secured = 5;
    scoreBreakdown.maitri.description = "Excellent. The planetary rulers are mutual friends, indicating supreme understanding.";
  } else if (avgFriendship >= 1.5) {
    scoreBreakdown.maitri.secured = 4;
    scoreBreakdown.maitri.description = "Very Good. Friendly planetary relationship, ensuring peaceful daily conversation.";
  } else if (avgFriendship >= 1.0) {
    scoreBreakdown.maitri.secured = 3;
    scoreBreakdown.maitri.description = "Neutral. Common respect and cooperation with occasional disagreements.";
  } else if (avgFriendship >= 0.5) {
    scoreBreakdown.maitri.secured = 1;
    scoreBreakdown.maitri.description = "Challenging. A mix of neutral and inimical planets. Harder to reach quick agreements.";
  } else {
    scoreBreakdown.maitri.secured = 0;
    scoreBreakdown.maitri.description = "Incompatible. Inimical planetary lords (e.g. Sun and Saturn). High likelihood of ego conflicts.";
  }

  // 6. Gana (Temperament/Behavioral alignment)
  // Deva (Divine), Manushya (Human), Rakshasa (Demon)
  if (boyNak.gana === girlNak.gana) {
    scoreBreakdown.gana.secured = 6;
    scoreBreakdown.gana.description = "Perfect. Identical temperaments leading to natural alignment in lifestyle and values.";
  } else if (
    (boyNak.gana === "Deva" && girlNak.gana === "Manushya") || 
    (boyNak.gana === "Manushya" && girlNak.gana === "Deva")
  ) {
    scoreBreakdown.gana.secured = 5;
    scoreBreakdown.gana.description = "Excellent. Gentle compatibility of a divine and a human temperament.";
  } else if (boyNak.gana === "Deva" && girlNak.gana === "Rakshasa") {
    scoreBreakdown.gana.secured = 1;
    scoreBreakdown.gana.description = "Difficult. High sensitivity (Deva) clashed with intense nature (Rakshasa). Needs compromise.";
  } else if (boyNak.gana === "Manushya" && girlNak.gana === "Rakshasa") {
    scoreBreakdown.gana.secured = 3;
    scoreBreakdown.gana.description = "Average. Practical human adjustment can match the intense demon energy over time.";
  } else {
    scoreBreakdown.gana.secured = 0;
    scoreBreakdown.gana.description = "Highly Challenging. Complete mismatch of Ganas (Deva-Rakshasa or vice versa), causing arguments.";
  }

  // 7. Bhakoot (Emotional/Heart Connection)
  // Relative houses of Moon Signs: e.g. 1-1, 3-11, 4-10, 5-9 are auspicious.
  // 2-12 (Dwirdwadashe), 6-8 (Shadastak), 7-7 (Saptak) can be inauspicious.
  const rashiDiff = (girlProfile.moonSign.rashiIndex - boyProfile.moonSign.rashiIndex + 12) % 12 + 1;
  const auspiciousDiffs = [1, 3, 4, 5, 9, 10, 11];
  
  if (auspiciousDiffs.includes(rashiDiff)) {
    scoreBreakdown.bhakoot.secured = 7;
    scoreBreakdown.bhakoot.description = "Perfect. Auspicious Moon positioning, ensuring high emotional bonding and financial growth.";
  } else if (rashiDiff === 7) {
    // 7-7 is neutral or friendly depending on sign lords
    scoreBreakdown.bhakoot.secured = 7; 
    scoreBreakdown.bhakoot.description = "Good. Mutual opposition (7-7) represents strong pull and deep magnetism.";
  } else {
    scoreBreakdown.bhakoot.secured = 0;
    scoreBreakdown.bhakoot.description = "Bhakoot Dosha. Inauspicious sign configuration (6-8 or 2-12), indicating potential financial stress or emotional gaps.";
  }

  // 8. Nadi (Genetic Health / Offspring compatibility)
  // Adi, Madhya, Antya. Must not be same (else Nadi Dosha, except if certain Nakshatra exceptions apply)
  if (boyNak.nadi !== girlNak.nadi) {
    scoreBreakdown.nadi.secured = 8;
    scoreBreakdown.nadi.description = "Perfect. Different Nadis ensure excellent genetic compatibility, health, and healthy progeny.";
  } else {
    // Nadi Dosha
    // Check exceptions (same Nakshatra but different quarters/padas, or specific nakshatras)
    if (boyProfile.nakshatra.index === girlProfile.nakshatra.index && boyProfile.nakshatra.pada !== girlProfile.nakshatra.pada) {
      scoreBreakdown.nadi.secured = 8;
      scoreBreakdown.nadi.description = "Auspicious. Same Nakshatra but different padas (quarters) neutralizes the Nadi Dosha.";
    } else {
      scoreBreakdown.nadi.secured = 0;
      scoreBreakdown.nadi.description = "Nadi Dosha. Same Nadi type (both " + boyNak.nadi + "). Could suggest psychological mismatch or child-bearing friction.";
    }
  }

  // Tally total
  for (const k in scoreBreakdown) {
    totalScore += scoreBreakdown[k].secured;
  }

  return {
    totalScore,
    breakdown: scoreBreakdown,
    summary: getMatchSummary(totalScore)
  };
}

function getMatchSummary(score) {
  if (score >= 28) return "Incredibly Auspicious (Highly Recommended). Divine match with supreme compatibility.";
  if (score >= 22) return "Very Good Match. Strongly recommended. High emotional and mental resonance.";
  if (score >= 18) return "Good Match. Standard compatibility. Suitable for long-term alliance with mutual adjustments.";
  if (score >= 15) return "Below Average. Moderate compatibility. Minor friction in health or temperaments; remedies suggested.";
  return "Challenging Match (Not Recommended). High risk of conflict, Doshas present. Needs deep consultation and remedies.";
}

/**
 * Calculates current Panchang details
 */
function calculateTodayPanchang(date) {
  const d = date || new Date();
  
  // Calculate sun and moon positions for today noon
  const pos = calculatePlanetaryPositions(d, 12);
  const moonLong = pos["Moon"];
  const sunLong = pos["Sun"];
  
  // 1. Nakshatra
  const nakIdx = getNakshatraIndex(moonLong);
  const nakshatraName = NAKSHATRAS[nakIdx].name;

  // 2. Tithi (Moon - Sun angle)
  let tithiAngle = (moonLong - sunLong) % 360;
  if (tithiAngle < 0) tithiAngle += 360;
  const tithiIdx = Math.floor(tithiAngle / 12) + 1;
  
  let tithiName = "";
  let paksha = tithiIdx <= 15 ? "Shukla Paksha (Waxing)" : "Krishna Paksha (Waning)";
  const tithiNames = ["Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shastika", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"];
  
  const innerIdx = (tithiIdx - 1) % 15;
  if (tithiIdx === 15) tithiName = "Purnima (Full Moon)";
  else if (tithiIdx === 30) tithiName = "Amavasya (New Moon)";
  else tithiName = tithiNames[innerIdx];

  // 3. Yoga (Sun + Moon angle)
  const yogaAngle = (sunLong + moonLong) % 360;
  const yogaIdx = Math.floor(yogaAngle / 13.333) + 1;
  const yogaNames = [
    "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", 
    "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", 
    "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
  ];
  const yogaName = yogaNames[(yogaIdx - 1) % 27];

  // 4. Karana (Half of Tithi)
  const karanaIdx = Math.floor(tithiAngle / 6) + 1;
  const karanaNames = [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti (Bhadra)", 
    "Shakuni", "Chatushpada", "Naga", "Kintughna"
  ];
  let karanaName = "";
  if (tithiIdx === 1) karanaName = "Kintughna";
  else if (tithiIdx >= 58) {
    // Fixed Karanas at the end of lunar month
    if (karanaIdx === 58) karanaName = "Shakuni";
    else if (karanaIdx === 59) karanaName = "Chatushpada";
    else karanaName = "Naga";
  } else {
    // Repeating Karanas
    karanaName = karanaNames[(karanaIdx - 2) % 7];
  }

  // 5. Vara (Weekday)
  const weekdays = ["Sunday (Ravivara)", "Monday (Somavara)", "Tuesday (Mangalavara)", "Wednesday (Budhavara)", "Thursday (Guruvara)", "Friday (Shukravara)", "Saturday (Shanivara)"];
  const weekdayName = weekdays[d.getDay()];

  // Rahu Kaal and Abhijit Muhurta approximations based on Sunrise (approx 6 AM) and Sunset (approx 6 PM)
  // Rahu Kaal varies by weekday:
  // Sun: 16:30 - 18:00, Mon: 07:30 - 09:00, Tue: 15:00 - 16:30, Wed: 12:00 - 13:30, Thu: 13:30 - 15:00, Fri: 10:30 - 12:00, Sat: 09:00 - 10:30
  const rahuKaals = [
    "16:30 - 18:00", // Sun
    "07:30 - 09:00", // Mon
    "15:00 - 16:30", // Tue
    "12:00 - 13:30", // Wed
    "13:30 - 15:00", // Thu
    "10:30 - 12:00", // Fri
    "09:00 - 10:30"  // Sat
  ];
  const rahuKaal = rahuKaals[d.getDay()];
  const abhijitMuhurta = "11:40 - 12:30"; // Auspicious midday period

  return {
    date: d.toDateString(),
    weekday: weekdayName,
    tithi: `${tithiName} (${paksha})`,
    nakshatra: nakshatraName,
    yoga: yogaName,
    karana: karanaName,
    rahuKaal,
    abhijitMuhurta,
    sunSign: RASHIS[getRashiIndex(sunLong)].name,
    moonSign: RASHIS[getRashiIndex(moonLong)].name
  };
}

// ----------------------------------------------------------------------
// ADVANCED VEDIC ASTROLOGY ENGINE EXTENSIONS (Astrosage-grade accuracy)
// ----------------------------------------------------------------------

// Classical Sign Lords (0 = Aries, ..., 11 = Pisces)
const SIGN_LORDS = [
  "Mars",    // 0: Mesha
  "Venus",   // 1: Vrishabha
  "Mercury", // 2: Mithuna
  "Moon",    // 3: Karka
  "Sun",     // 4: Simha
  "Mercury", // 5: Kanya
  "Venus",   // 6: Tula
  "Mars",    // 7: Vrishchika
  "Jupiter", // 8: Dhanu
  "Saturn",  // 9: Makara
  "Saturn",  // 10: Kumbha
  "Jupiter"  // 11: Meena
];

// Planetary Dignities & Rulerships (0-indexed sign indices)
const PLANETARY_DIGNITIES = {
  "Sun": { exaltSign: 0, debilitSign: 6, ownSigns: [4], exaltDegree: 10, debilitDegree: 10, karaka: "Soul, Authority, Father, Vitality" },
  "Moon": { exaltSign: 1, debilitSign: 7, ownSigns: [3], exaltDegree: 3, debilitDegree: 3, karaka: "Mind, Emotions, Mother, Intuition" },
  "Mars": { exaltSign: 9, debilitSign: 3, ownSigns: [0, 7], exaltDegree: 28, debilitDegree: 28, karaka: "Energy, Courage, Property, Siblings" },
  "Mercury": { exaltSign: 5, debilitSign: 11, ownSigns: [2, 5], exaltDegree: 15, debilitDegree: 15, karaka: "Intellect, Communication, Commerce, Logic" },
  "Jupiter": { exaltSign: 3, debilitSign: 9, ownSigns: [8, 11], exaltDegree: 5, debilitDegree: 5, karaka: "Wisdom, Fortune, Guru, Wealth, Children" },
  "Venus": { exaltSign: 11, debilitSign: 5, ownSigns: [1, 6], exaltDegree: 27, debilitDegree: 27, karaka: "Love, Marriage, Luxury, Arts, Vehicles" },
  "Saturn": { exaltSign: 6, debilitSign: 0, ownSigns: [9, 10], exaltDegree: 20, debilitDegree: 20, karaka: "Karma, Discipline, Career, Longevity" },
  "Rahu": { exaltSign: 1, debilitSign: 7, ownSigns: [10], exaltDegree: 20, debilitDegree: 20, karaka: "Ambition, Foreign Travel, Maya, Unconventional Paths" },
  "Ketu": { exaltSign: 7, debilitSign: 1, ownSigns: [7], exaltDegree: 20, debilitDegree: 20, karaka: "Moksha, Spirituality, Liberation, Detachment" }
};

// Vimshottari 120-Year Dasha Cycle
const DASHA_LORDS = [
  { planet: "Ketu", years: 7, color: "#94A3B8" },
  { planet: "Venus", years: 20, color: "#EC4899" },
  { planet: "Sun", years: 6, color: "#F59E0B" },
  { planet: "Moon", years: 10, color: "#E0E7FF" },
  { planet: "Mars", years: 7, color: "#EF4444" },
  { planet: "Rahu", years: 18, color: "#8B5CF6" },
  { planet: "Jupiter", years: 16, color: "#FBBF24" },
  { planet: "Saturn", years: 19, color: "#3B82F6" },
  { planet: "Mercury", years: 17, color: "#10B981" }
];

// Special Vishesha Drishti (Planetary Aspect Offsets in houses)
// Every planet casts 7th house aspect. These are special additional aspects:
const PLANET_ASPECT_OFFSETS = {
  "Sun": [7],
  "Moon": [7],
  "Mars": [4, 7, 8],
  "Mercury": [7],
  "Jupiter": [5, 7, 9],
  "Venus": [7],
  "Saturn": [3, 7, 10],
  "Rahu": [5, 7, 9],
  "Ketu": [5, 7, 9]
};

// 27 Nakshatras Pada Syllables and Karmic Themes
const PADA_THEMES = [
  { purushartha: "Dharma", theme: "Spiritual initiative, pioneering courage, pure intent." },
  { purushartha: "Artha", theme: "Material consolidation, perseverance, resource stewardship." },
  { purushartha: "Kama", theme: "Intellectual expression, social connection, desire fulfillment." },
  { purushartha: "Moksha", theme: "Emotional dissolution, surrender, transcendent wisdom." }
];

/**
 * Calculates Nakshatra Pada, Navamsha sign, Purushartha, and Karmic Themes for any longitude
 */
function getNakshatraPadaDetail(longitude) {
  const nakIdx = getNakshatraIndex(longitude);
  const nak = NAKSHATRAS[nakIdx];
  const degInNak = longitude % (13 + 1/3);
  const pada = Math.floor(degInNak / (3 + 1/3)) + 1; // 1 to 4
  const navRashiIdx = getNavamshaRashiIndex(longitude);
  const navRashi = RASHIS[navRashiIdx];
  const padaInfo = PADA_THEMES[pada - 1];

  // Specific Pada Aksharas (Naming syllables)
  const aksharas = [
    ["Chu", "Che", "Cho", "La"],       // Ashwini
    ["Li", "Lu", "Le", "Lo"],          // Bharani
    ["A", "Ee", "U", "Ea"],            // Krittika
    ["O", "Va", "Vi", "Vu"],           // Rohini
    ["Ve", "Vo", "Ka", "Kee"],         // Mrigashira
    ["Ku", "Gha", "Nga", "Chha"],      // Ardra
    ["Ke", "Ko", "Ha", "Hee"],         // Punarvasu
    ["Hu", "He", "Ho", "Da"],          // Pushya
    ["Dee", "Du", "De", "Do"],         // Ashlesha
    ["Ma", "Mee", "Mu", "Me"],         // Magha
    ["Mo", "Ta", "Tee", "Tu"],         // Purva Phalguni
    ["Te", "To", "Pa", "Pee"],         // Uttara Phalguni
    ["Pu", "Sha", "Na", "Tha"],        // Hasta
    ["Pe", "Po", "Ra", "Ree"],         // Chitra
    ["Ru", "Re", "Ro", "Taa"],         // Swati
    ["Tee", "Tue", "Tei", "To"],       // Vishakha
    ["Na", "Nee", "Nu", "Ne"],         // Anuradha
    ["No", "Ya", "Yee", "Yu"],         // Jyeshtha
    ["Ye", "Yo", "Bha", "Bhee"],       // Mula
    ["Bhu", "Dha", "Pha", "Dha"],      // Purva Ashadha
    ["Bhe", "Bho", "Ja", "Jee"],       // Uttara Ashadha
    ["Ju", "Je", "Jo", "Gha"],         // Shravana
    ["Ga", "Gee", "Gu", "Ge"],         // Dhanishta
    ["Go", "Sa", "See", "Su"],         // Shatabhisha
    ["Se", "So", "Da", "Dee"],         // Purva Bhadrapada
    ["Du", "Tha", "Jna", "Da"],        // Uttara Bhadrapada
    ["De", "Do", "Cha", "Chee"]        // Revati
  ];

  const akshara = (aksharas[nakIdx] && aksharas[nakIdx][pada - 1]) || "Om";

  return {
    nakshatraName: nak.name,
    nakshatraLord: nak.lord,
    pada,
    navamshaSign: navRashi.name,
    navamshaRuler: navRashi.ruler,
    purushartha: padaInfo.purushartha,
    akshara,
    animal: nak.animal,
    gana: nak.gana,
    nadi: nak.nadi,
    karmicTheme: padaInfo.theme,
    description: `Pada ${pada} resonates with ${padaInfo.purushartha} energy in the Navamsha of ${navRashi.name}. Governed by ${navRashi.ruler}, it indicates: ${padaInfo.theme}`
  };
}

/**
 * Computes all Astrological Connections (Drishti, Lordships, Conjunctions, Rashi Drishti)
 * Frontend renders lines ONLY from this computed data.
 */
function getComputedConnections(profile, chartType = "lagna") {
  const p = profile;
  let startSignIndex = p.lagna.rashiIndex;
  let activeHouses = p.planetHouses;

  if (chartType === "chandra") {
    startSignIndex = p.moonSign.rashiIndex;
    activeHouses = p.chandraHouses;
  } else if (chartType === "navamsha") {
    startSignIndex = p.lagna.navRashiIndex;
    activeHouses = p.navamshaHouses;
  }

  // Structure per house
  const houseData = {};
  for (let h = 1; h <= 12; h++) {
    const signIdx = (startSignIndex + h - 1) % 12;
    const sign = RASHIS[signIdx];
    const lord = SIGN_LORDS[signIdx];
    const lordPlacementHouse = activeHouses[lord] || h;
    
    // Occupants
    const occupants = [];
    for (const pl in activeHouses) {
      if (activeHouses[pl] === h) occupants.push(pl);
    }

    houseData[h] = {
      house: h,
      signIndex: signIdx,
      signName: sign.name,
      element: sign.element,
      lord,
      lordPlacementHouse,
      occupants,
      aspectsReceived: [],
      connectedHouses: new Set()
    };
  }

  const connections = [];

  // 1. Lordships (House -> Lord's placement house)
  for (let h = 1; h <= 12; h++) {
    const hd = houseData[h];
    hd.connectedHouses.add(hd.lordPlacementHouse);
    connections.push({
      id: `lordship_h${h}_to_h${hd.lordPlacementHouse}`,
      type: "Lordship",
      subType: "lordship",
      strokeStyle: "dotted",
      source: { type: "house", id: `h${h}`, houseNum: h, label: `House ${h}` },
      target: { type: "planet", id: hd.lord, houseNum: hd.lordPlacementHouse, label: `${hd.lord} in H${hd.lordPlacementHouse}` },
      targetHouseNum: hd.lordPlacementHouse,
      title: `House ${h} Lord (${hd.lord}) placed in House ${hd.lordPlacementHouse}`,
      meaning: `${hd.lord} rules House ${h} (${hd.signName.split(" ")[0]}) and resides in House ${hd.lordPlacementHouse}, channeling ${h}th-house themes into the ${hd.lordPlacementHouse}th house.`,
      color: "var(--accent-purple)"
    });
  }

  // 2. Conjunctions (Planets in same house)
  for (let h = 1; h <= 12; h++) {
    const occ = houseData[h].occupants;
    if (occ.length > 1) {
      for (let i = 0; i < occ.length; i++) {
        for (let j = i + 1; j < occ.length; j++) {
          const p1 = occ[i];
          const p2 = occ[j];
          connections.push({
            id: `conj_${p1}_${p2}_h${h}`,
            type: "Conjunction",
            subType: "conjunction",
            strokeStyle: "solid",
            source: { type: "planet", id: p1, houseNum: h, label: p1 },
            target: { type: "planet", id: p2, houseNum: h, label: p2 },
            targetHouseNum: h,
            title: `${p1} ☌ ${p2} Conjunction in House ${h}`,
            meaning: `${p1} and ${p2} coalesce their cosmic energies within House ${h} (${houseData[h].signName.split(" ")[0]}), creating a mutual yogic blending.`,
            color: "var(--gold-primary)"
          });
        }
      }
    }
  }

  // 3. Graha Drishti (Planetary Aspects)
  for (const planet in activeHouses) {
    const sourceHouse = activeHouses[planet];
    const offsets = PLANET_ASPECT_OFFSETS[planet] || [7];

    offsets.forEach(offset => {
      let targetHouse = (sourceHouse + offset - 1) % 12;
      if (targetHouse === 0) targetHouse = 12;

      houseData[targetHouse].aspectsReceived.push({ planet, offset });
      houseData[sourceHouse].connectedHouses.add(targetHouse);

      const targetOccupants = houseData[targetHouse].occupants;
      const targetOccText = targetOccupants.length > 0 ? ` (influencing ${targetOccupants.join(", ")})` : "";

      connections.push({
        id: `aspect_${planet}_h${sourceHouse}_to_h${targetHouse}`,
        type: "Graha Drishti",
        subType: "aspect",
        strokeStyle: "dashed",
        source: { type: "planet", id: planet, houseNum: sourceHouse, label: planet },
        target: { type: "house", id: `h${targetHouse}`, houseNum: targetHouse, label: `House ${targetHouse}` },
        targetHouseNum: targetHouse,
        title: `${planet} casts ${offset}th Aspect on House ${targetHouse}`,
        meaning: `${planet} from House ${sourceHouse} casts full ${offset}th-house Graha Drishti onto House ${targetHouse}${targetOccText}, activating and elevating its results.`,
        color: "var(--accent-indigo)"
      });
    });
  }

  // 4. Jaimini Rashi Drishti (Sign Aspects)
  // Movable (1,4,7,10) aspect Fixed (2,5,8,11) except adjacent
  // Fixed (2,5,8,11) aspect Movable (1,4,7,10) except adjacent
  // Dual (3,6,9,12) aspect all other Dual signs
  const signNature = ["Movable", "Fixed", "Dual", "Movable", "Fixed", "Dual", "Movable", "Fixed", "Dual", "Movable", "Fixed", "Dual"];
  for (let h = 1; h <= 12; h++) {
    const sIdx = houseData[h].signIndex;
    const nature = signNature[sIdx];

    for (let targetH = 1; targetH <= 12; targetH++) {
      if (targetH === h) continue;
      const tSignIdx = houseData[targetH].signIndex;
      const tNature = signNature[tSignIdx];

      let isAspecting = false;
      if (nature === "Movable" && tNature === "Fixed") {
        // Exclude adjacent sign
        if (Math.abs(sIdx - tSignIdx) !== 1 && Math.abs(sIdx - tSignIdx) !== 11) isAspecting = true;
      } else if (nature === "Fixed" && tNature === "Movable") {
        if (Math.abs(sIdx - tSignIdx) !== 1 && Math.abs(sIdx - tSignIdx) !== 11) isAspecting = true;
      } else if (nature === "Dual" && tNature === "Dual") {
        isAspecting = true;
      }

      if (isAspecting && houseData[h].occupants.length > 0) {
        connections.push({
          id: `rashi_drishti_h${h}_to_h${targetH}`,
          type: "Rashi Drishti",
          subType: "rashi_drishti",
          strokeStyle: "dotted",
          source: { type: "house", id: `h${h}`, houseNum: h, label: `H${h} (${houseData[h].signName.split(" ")[0]})` },
          target: { type: "house", id: `h${targetH}`, houseNum: targetH, label: `H${targetH} (${houseData[targetH].signName.split(" ")[0]})` },
          targetHouseNum: targetH,
          title: `Rashi Drishti: ${houseData[h].signName.split(" ")[0]} aspects ${houseData[targetH].signName.split(" ")[0]}`,
          meaning: `As per Jaimini Sutras, ${houseData[h].signName.split(" ")[0]} (${nature}) projects direct sign aspect upon ${houseData[targetH].signName.split(" ")[0]} (${tNature}).`,
          color: "rgba(251, 191, 36, 0.6)"
        });
      }
    }
  }

  // Convert connected houses sets to arrays
  for (const h in houseData) {
    houseData[h].connectedHouses = Array.from(houseData[h].connectedHouses);
  }

  return {
    houseData,
    connections,
    activeHouses,
    startSignIndex
  };
}

/**
 * Authentic Classical Yoga Detection Engine
 * Scans real computed planetary data for major Vedic Yogas
 */
function detectYogas(profile) {
  const p = profile;
  const h = p.planetHouses;
  const signs = p.planetSigns;
  const yogas = [];

  const startSignIdx = p.lagna.rashiIndex;
  const houseLords = {};
  for (let i = 1; i <= 12; i++) {
    const sIdx = (startSignIdx + i - 1) % 12;
    houseLords[i] = SIGN_LORDS[sIdx];
  }

  // 1. Gajakesari Yoga (Jupiter in Kendra 1, 4, 7, 10 from Moon)
  if (h["Jupiter"] && h["Moon"]) {
    const dist = (h["Jupiter"] - h["Moon"] + 12) % 12 + 1;
    if ([1, 4, 7, 10].includes(dist)) {
      yogas.push({
        id: "gajakesari",
        name: "Gajakesari Yoga",
        sanskrit: "गजकेसरी योग",
        category: "Raj Yoga",
        planets: ["Jupiter", "Moon"],
        houses: [h["Jupiter"], h["Moon"]],
        meaning: "Jupiter stands in an auspicious angular Kendra (House " + dist + ") from Moon.",
        description: "Bestows supreme wisdom, enduring fame, ethical leadership, prosperity, and protection from adversity.",
        strength: "High"
      });
    }
  }

  // 2. Budhaditya Yoga (Sun + Mercury conjunct in same house)
  if (h["Sun"] && h["Mercury"] && h["Sun"] === h["Mercury"]) {
    yogas.push({
      id: "budhaditya",
      name: "Budhaditya Yoga",
      sanskrit: "बुधादित्य योग",
      category: "Dhana / Vidya Yoga",
      planets: ["Sun", "Mercury"],
      houses: [h["Sun"]],
      meaning: "Sun and Mercury are conjunct in House " + h["Sun"] + " (" + signs["Sun"] + ").",
      description: "Sharp analytical brilliance, administrative prowess, eloquence, and intellectual mastery.",
      strength: "High"
    });
  }

  // 3. Pancha Mahapurusha Yogas (Mars, Mercury, Jupiter, Venus, Saturn in Kendra and in Own or Exalted sign)
  const kendras = [1, 4, 7, 10];
  const mahapurushas = [
    { planet: "Mars", name: "Ruchaka Yoga", sanskrit: "रुचक योग", own: ["Mesha", "Vrishchika"], exalt: "Makara", desc: "Supreme bravery, commander attributes, physical strength, real-estate dominance." },
    { planet: "Mercury", name: "Bhadra Yoga", sanskrit: "भद्र योग", own: ["Mithuna", "Kanya"], exalt: "Kanya", desc: "Oratorical prowess, deep mathematical aptitude, longevity, commercial supremacy." },
    { planet: "Jupiter", name: "Hamsa Yoga", sanskrit: "हंस योग", own: ["Dhanu", "Meena"], exalt: "Karka", desc: "Saintly character, spiritual wisdom, respected by society and rulers, righteous wealth." },
    { planet: "Venus", name: "Malavya Yoga", sanskrit: "मालव्य योग", own: ["Vrishabha", "Tula"], exalt: "Meena", desc: "Artistic refinement, luxurious vehicles, magnetic attraction, happy domestic life." },
    { planet: "Saturn", name: "Shasha Yoga", sanskrit: "शश योग", own: ["Makara", "Kumbha"], exalt: "Tula", desc: "Command over masses, enduring authority, unshakeable perseverance, mastery over land." }
  ];

  mahapurushas.forEach(mp => {
    const plHouse = h[mp.planet];
    const plSign = signs[mp.planet];
    if (kendras.includes(plHouse) && (mp.own.includes(plSign) || mp.exalt === plSign)) {
      yogas.push({
        id: mp.name.toLowerCase().replace(/\s+/g, "_"),
        name: mp.name,
        sanskrit: mp.sanskrit,
        category: "Pancha Mahapurusha",
        planets: [mp.planet],
        houses: [plHouse],
        meaning: `${mp.planet} occupies Kendra House ${plHouse} in its exalted/own sign (${plSign}).`,
        description: mp.desc,
        strength: "Very High"
      });
    }
  });

  // 4. Dharma-Karmadhipati Yoga (9th Lord & 10th Lord association)
  const lord9 = houseLords[9];
  const lord10 = houseLords[10];
  if (lord9 && lord10 && lord9 !== lord10) {
    const h9 = h[lord9];
    const h10 = h[lord10];
    const isConjunct = (h9 === h10);
    const isMutualAspect = ((h9 - h10 + 12) % 12 + 1 === 7);
    const isExchange = (h9 === 10 && h10 === 9);

    if (isConjunct || isMutualAspect || isExchange) {
      yogas.push({
        id: "dharma_karmadhipati",
        name: "Dharma-Karmadhipati Yoga",
        sanskrit: "धर्मकर्माधिपति योग",
        category: "Maha Raj Yoga",
        planets: [lord9, lord10],
        houses: [h9, h10],
        meaning: `Lord of 9th (${lord9}) and Lord of 10th (${lord10}) form auspicious union.`,
        description: "Crown jewel of Raj Yogas: synthesizes noble duty (Dharma) with worldly achievement (Karma), assuring high executive status.",
        strength: "Supreme"
      });
    }
  }

  // 5. Kendra-Trikona Raj Yogas
  // Kendra lords: 1, 4, 7, 10. Trikona lords: 1, 5, 9.
  const trikonaLords = [houseLords[1], houseLords[5], houseLords[9]];
  const kendraLords = [houseLords[1], houseLords[4], houseLords[7], houseLords[10]];
  for (const tLord of trikonaLords) {
    for (const kLord of kendraLords) {
      if (tLord && kLord && tLord !== kLord) {
        if (h[tLord] === h[kLord]) {
          const already = yogas.some(y => y.id === `raj_yoga_${tLord}_${kLord}` || y.id === `raj_yoga_${kLord}_${tLord}`);
          if (!already) {
            yogas.push({
              id: `raj_yoga_${tLord}_${kLord}`,
              name: `Kendra-Trikona Raj Yoga (${tLord} & ${kLord})`,
              sanskrit: "राजयोग",
              category: "Raj Yoga",
              planets: [tLord, kLord],
              houses: [h[tLord]],
              meaning: `Trikona Lord ${tLord} and Kendra Lord ${kLord} conjunct in House ${h[tLord]}.`,
              description: "Blesses the native with prosperity, public honor, professional elevation, and divine support.",
              strength: "High"
            });
          }
        }
      }
    }
  }

  // 6. Dhana Yoga (Lords of 1, 2, 5, 9, 11 connected)
  const wealthLords = [houseLords[1], houseLords[2], houseLords[5], houseLords[9], houseLords[11]];
  if (h[houseLords[2]] && h[houseLords[11]] && (h[houseLords[2]] === h[houseLords[11]] || [1, 2, 5, 9, 11].includes(h[houseLords[2]]))) {
    yogas.push({
      id: "dhana_yoga",
      name: "Lakshmi Dhana Yoga",
      sanskrit: "धन योग",
      category: "Dhana Yoga",
      planets: [houseLords[2], houseLords[11]],
      houses: [h[houseLords[2]], h[houseLords[11]]],
      meaning: `2nd Lord (${houseLords[2]}) and 11th Lord (${houseLords[11]}) form potent wealth axis.`,
      description: "Steady influx of wealth, asset accumulation, financial resilience, and multi-stream earnings.",
      strength: "High"
    });
  }

  // 7. Vipreet Raj Yogas (Lords of 6, 8, 12 in Dusthana houses 6, 8, 12)
  const dusthanaHouses = [6, 8, 12];
  const lord6 = houseLords[6];
  const lord8 = houseLords[8];
  const lord12 = houseLords[12];

  if (dusthanaHouses.includes(h[lord6])) {
    yogas.push({
      id: "harsha_yoga",
      name: "Harsha Vipreet Raj Yoga",
      sanskrit: "हर्ष विपरीत राजयोग",
      category: "Vipreet Raj",
      planets: [lord6],
      houses: [h[lord6]],
      meaning: `6th Lord (${lord6}) situated in Dusthana House ${h[lord6]}.`,
      description: "Victory over enemies, robust immunity, triumph through adversity, financial resurgence after crisis.",
      strength: "Moderate"
    });
  }
  if (dusthanaHouses.includes(h[lord8])) {
    yogas.push({
      id: "sarala_yoga",
      name: "Sarala Vipreet Raj Yoga",
      sanskrit: "सरल विपरीत राजयोग",
      category: "Vipreet Raj",
      planets: [lord8],
      houses: [h[lord8]],
      meaning: `8th Lord (${lord8}) situated in Dusthana House ${h[lord8]}.`,
      description: "Fearless disposition, unexpected inheritances, scholarly depth, long life and spiritual resolve.",
      strength: "Moderate"
    });
  }
  if (dusthanaHouses.includes(h[lord12])) {
    yogas.push({
      id: "vimala_yoga",
      name: "Vimala Vipreet Raj Yoga",
      sanskrit: "विमल विपरीत राजयोग",
      category: "Vipreet Raj",
      planets: [lord12],
      houses: [h[lord12]],
      meaning: `12th Lord (${lord12}) situated in Dusthana House ${h[lord12]}.`,
      description: "Independent noble conduct, prudent financial stewardship, happiness abroad, spiritual peace.",
      strength: "Moderate"
    });
  }

  // 8. Neecha Bhanga Raj Yoga (Cancellation of Debilitation into Royal Elevation)
  for (const pl in PLANETARY_DIGNITIES) {
    const dig = PLANETARY_DIGNITIES[pl];
    const plSignIdx = getRashiIndex(p.planets[pl]);
    if (plSignIdx === dig.debilitSign) {
      // Planet is debilitated. Check if dispositor or exaltation lord is in Kendra from Lagna or Moon
      const dispositor = SIGN_LORDS[dig.debilitSign];
      const exaltLord = SIGN_LORDS[dig.exaltSign];
      const dispHouse = h[dispositor];
      const exaltLordHouse = h[exaltLord];

      if (kendras.includes(dispHouse) || kendras.includes(exaltLordHouse)) {
        yogas.push({
          id: `neechabhanga_${pl.toLowerCase()}`,
          name: `Neecha Bhanga Raj Yoga (${pl})`,
          sanskrit: "नीचभंग राजयोग",
          category: "Raj Yoga",
          planets: [pl, dispositor],
          houses: [h[pl], dispHouse],
          meaning: `Debilitated ${pl} has its debility cancelled by dispositor ${dispositor} in Kendra House ${dispHouse}.`,
          description: "Converts early life struggles into remarkable success, exceptional grit, and eventual authority.",
          strength: "High"
        });
      }
    }
  }

  // 9. Chandra-Mangala Yoga (Moon and Mars conjunct or mutual aspect)
  if (h["Moon"] && h["Mars"]) {
    const dist = (h["Mars"] - h["Moon"] + 12) % 12 + 1;
    if (dist === 1 || dist === 7) {
      yogas.push({
        id: "chandra_mangala",
        name: "Chandra-Mangala Yoga",
        sanskrit: "चन्द्र-मङ्गल योग",
        category: "Dhana Yoga",
        planets: ["Moon", "Mars"],
        houses: [h["Moon"], h["Mars"]],
        meaning: `Moon and Mars form direct ${dist === 1 ? 'conjunction' : 'mutual 7th aspect'} in House ${h["Moon"]}.`,
        description: "Dynamic commercial instincts, drive for enterprise, self-earned wealth, and courageous temperament.",
        strength: "High"
      });
    }
  }

  // 10. Amala Yoga (Benefics in 10th from Lagna or Moon)
  const benefics = ["Jupiter", "Venus", "Mercury"];
  benefics.forEach(ben => {
    if (h[ben] === 10) {
      yogas.push({
        id: `amala_${ben.toLowerCase()}`,
        name: `Amala Yoga (${ben})`,
        sanskrit: "अमला योग",
        category: "Auspicious",
        planets: [ben],
        houses: [10],
        meaning: `Benefic planet ${ben} presides in the 10th House of Career and Karma.`,
        description: "Spotless professional reputation, philanthropic inclination, lasting legacy, and high standing.",
        strength: "High"
      });
    }
  });

  // 11. Saraswati Yoga (Mercury, Jupiter, Venus in Kendra, Trikona, or 2nd)
  const auspiciousP = [1, 2, 4, 5, 7, 9, 10];
  if (auspiciousP.includes(h["Mercury"]) && auspiciousP.includes(h["Jupiter"]) && auspiciousP.includes(h["Venus"])) {
    yogas.push({
      id: "saraswati_yoga",
      name: "Saraswati Yoga",
      sanskrit: "सरस्वती योग",
      category: "Vidya / Wisdom",
      planets: ["Mercury", "Jupiter", "Venus"],
      houses: [h["Mercury"], h["Jupiter"], h["Venus"]],
      meaning: "Mercury, Jupiter, and Venus all grace Kendra, Trikona, or 2nd houses.",
      description: "Blessed by Goddess Saraswati: exceptional academic mastery, literary talent, musical/artistic genius.",
      strength: "Supreme"
    });
  }

  return yogas;
}

/**
 * Vimshottari Dasha Engine (120-Year Full Cycle)
 * Calculates Mahadashas, Antardashas, and Pratyantardashas with live period detection.
 */
function calculateVimshottariDasha(profile, targetDate = new Date()) {
  const p = profile;
  const moonLong = p.planets["Moon"];
  const nakIdx = getNakshatraIndex(moonLong);
  const startDashaIdx = nakIdx % 9;

  // Degrees traversed within current nakshatra (each nakshatra = 13°20' = 13.333333°)
  const nakLength = 13 + 1/3;
  const degInNak = moonLong % nakLength;
  const fractionTraversed = degInNak / nakLength;

  const startLord = DASHA_LORDS[startDashaIdx];
  const balanceAtBirthYears = (1 - fractionTraversed) * startLord.years;

  const [bYear, bMonth, bDay] = p.dob.split("-").map(Number);
  const [bHour, bMin] = (p.tob || "12:00").split(":").map(Number);
  const birthTimeMs = new Date(Date.UTC(bYear, bMonth - 1, bDay, bHour, bMin)).getTime();

  const msPerYear = 365.2425 * 24 * 60 * 60 * 1000;
  const nowMs = targetDate instanceof Date ? targetDate.getTime() : new Date(targetDate).getTime();

  const mahadashas = [];
  let currentCursorMs = birthTimeMs;
  let activePeriod = null;

  for (let cycle = 0; cycle < 18; cycle++) {
    const lordIdx = (startDashaIdx + cycle) % 9;
    const lord = DASHA_LORDS[lordIdx];
    const durationYears = (cycle === 0) ? balanceAtBirthYears : lord.years;
    const durationMs = durationYears * msPerYear;
    const startMs = currentCursorMs;
    const endMs = startMs + durationMs;

    const mDasha = {
      planet: lord.planet,
      color: lord.color,
      totalYears: lord.years,
      durationYears: Math.round(durationYears * 100) / 100,
      startDate: new Date(startMs).toISOString().split("T")[0],
      endDate: new Date(endMs).toISOString().split("T")[0],
      isCurrent: (nowMs >= startMs && nowMs < endMs),
      housePlaced: p.planetHouses[lord.planet] || 1,
      housesRuled: [],
      housesAspected: (PLANET_ASPECT_OFFSETS[lord.planet] || [7]).map(off => {
        let t = (p.planetHouses[lord.planet] + off - 1) % 12;
        return t === 0 ? 12 : t;
      }),
      antardashas: []
    };

    // Calculate houses ruled by this Mahadasha lord
    const startSignIdx = p.lagna.rashiIndex;
    for (let h = 1; h <= 12; h++) {
      const sIdx = (startSignIdx + h - 1) % 12;
      if (SIGN_LORDS[sIdx] === lord.planet) mDasha.housesRuled.push(h);
    }

    // Build 9 Antardashas within this Mahadasha
    let adCursorMs = startMs;
    for (let adCount = 0; adCount < 9; adCount++) {
      const adLordIdx = (lordIdx + adCount) % 9;
      const adLord = DASHA_LORDS[adLordIdx];
      // Proportionate sub-period
      const adDurationYears = (durationYears * adLord.years) / 120;
      const adDurationMs = adDurationYears * msPerYear;
      const adStartMs = adCursorMs;
      const adEndMs = adStartMs + adDurationMs;

      const adItem = {
        planet: adLord.planet,
        color: adLord.color,
        durationYears: Math.round(adDurationYears * 100) / 100,
        startDate: new Date(adStartMs).toISOString().split("T")[0],
        endDate: new Date(adEndMs).toISOString().split("T")[0],
        isCurrent: (nowMs >= adStartMs && nowMs < adEndMs),
        housePlaced: p.planetHouses[adLord.planet] || 1,
        pratyantardashas: []
      };

      // Build 9 Pratyantardashas within this Antardasha
      let pdCursorMs = adStartMs;
      for (let pdCount = 0; pdCount < 9; pdCount++) {
        const pdLordIdx = (adLordIdx + pdCount) % 9;
        const pdLord = DASHA_LORDS[pdLordIdx];
        const pdDurationYears = (adDurationYears * pdLord.years) / 120;
        const pdDurationMs = pdDurationYears * msPerYear;
        const pdStartMs = pdCursorMs;
        const pdEndMs = pdStartMs + pdDurationMs;

        const pdItem = {
          planet: pdLord.planet,
          color: pdLord.color,
          startDate: new Date(pdStartMs).toISOString().split("T")[0],
          endDate: new Date(pdEndMs).toISOString().split("T")[0],
          isCurrent: (nowMs >= pdStartMs && nowMs < pdEndMs)
        };

        adItem.pratyantardashas.push(pdItem);

        if (pdItem.isCurrent) {
          activePeriod = {
            mahadasha: mDasha.planet,
            antardasha: adItem.planet,
            pratyantar: pdItem.planet,
            startDate: pdItem.startDate,
            endDate: pdItem.endDate,
            mDashaEnd: mDasha.endDate,
            adDashaEnd: adItem.endDate,
            housePlaced: mDasha.housePlaced,
            housesRuled: mDasha.housesRuled,
            housesAspected: mDasha.housesAspected,
            connectedChain: [mDasha.housePlaced, ...mDasha.housesRuled, ...mDasha.housesAspected].filter((v, i, a) => a.indexOf(v) === i)
          };
        }

        pdCursorMs = pdEndMs;
      }

      mDasha.antardashas.push(adItem);
      adCursorMs = adEndMs;
    }

    mahadashas.push(mDasha);
    currentCursorMs = endMs;

    // Stop after covering up to age 100
    if ((endMs - birthTimeMs) / msPerYear > 105) break;
  }

  return {
    mahadashas,
    activePeriod,
    birthNakshatra: NAKSHATRAS[nakIdx].name,
    balanceAtBirth: `${Math.floor(balanceAtBirthYears)}y ${Math.round((balanceAtBirthYears % 1) * 12)}m of ${startLord.planet}`
  };
}

/**
 * Gochar (Current Planetary Transits) Engine
 * Positions current planets and calculates live Gochar aspects relative to Natal Chart
 */
function getTransitPositions(targetDate = new Date(), natalProfile) {
  const d = targetDate instanceof Date ? targetDate : new Date(targetDate);
  const positions = calculatePlanetaryPositions(d, 12);
  const natalLagnaRashiIdx = natalProfile.lagna.rashiIndex;
  const natalMoonRashiIdx = natalProfile.moonSign.rashiIndex;

  const transits = {};
  const transitHouses = {};
  const chandraTransitHouses = {};

  for (const pl in positions) {
    const long = positions[pl];
    const rIdx = getRashiIndex(long);
    const signName = RASHIS[rIdx].name.split(" ")[0];

    // House relative to Natal Lagna
    let house = rIdx - natalLagnaRashiIdx + 1;
    if (house <= 0) house += 12;

    // House relative to Natal Moon (Chandra Gochar)
    let cHouse = rIdx - natalMoonRashiIdx + 1;
    if (cHouse <= 0) cHouse += 12;

    transitHouses[pl] = house;
    chandraTransitHouses[pl] = cHouse;

    transits[pl] = {
      planet: pl,
      longitude: long,
      signIndex: rIdx,
      signName,
      house,
      chandraHouse: cHouse,
      aspectsToNatalHouses: (PLANET_ASPECT_OFFSETS[pl] || [7]).map(off => {
        let t = (house + off - 1) % 12;
        return t === 0 ? 12 : t;
      })
    };
  }

  // Sade Sati Detection (Saturn in 12th, 1st, or 2nd from Natal Moon)
  const saturnChandraH = chandraTransitHouses["Saturn"];
  let sadeSati = { active: false, phase: "None", description: "Saturn is not currently transiting adjacent to your Moon." };
  if (saturnChandraH === 12) {
    sadeSati = { active: true, phase: "Rising (1st Phase)", description: "Transit Saturn is in the 12th from Moon. Heightened expenditure, mental contemplation, and lifestyle shifts." };
  } else if (saturnChandraH === 1) {
    sadeSati = { active: true, phase: "Peak (2nd Phase)", description: "Transit Saturn sits directly over Natal Moon. Major psychological maturing, patience testing, and heavy responsibilities." };
  } else if (saturnChandraH === 2) {
    sadeSati = { active: true, phase: "Setting (3rd Phase)", description: "Transit Saturn is in the 2nd from Moon. Financial restructuring, family consolidation, and rewards for hard work." };
  }

  return {
    date: d.toDateString(),
    transits,
    transitHouses,
    chandraTransitHouses,
    sadeSati
  };
}

/**
 * Life Area Lens Lookup & Analyzer
 * Configurable theme-to-house mapping table
 */
const LIFE_AREA_CONFIG = {
  career: {
    title: "Career & Profession",
    icon: "💼",
    houses: [10, 2, 6, 11],
    karakas: ["Sun", "Saturn", "Mercury"],
    meaning: "House 10 (Karma/Status), House 2 (Earnings), House 6 (Work/Service), House 11 (Gains & Network). Karakas: Sun (authority) and Saturn (vocation)."
  },
  marriage: {
    title: "Marriage & Relationships",
    icon: "💍",
    houses: [7, 2, 4, 8],
    karakas: ["Venus", "Jupiter", "Mars"],
    meaning: "House 7 (Spouse & Partnerships), House 2 (Family Harmony), House 4 (Domestic Bliss), House 8 (Marital Stability). Karakas: Venus (romance) and Jupiter (sanctity)."
  },
  finance: {
    title: "Wealth & Finance",
    icon: "💰",
    houses: [2, 11, 5, 9],
    karakas: ["Jupiter", "Venus", "Mercury"],
    meaning: "House 2 (Accumulated Dhana), House 11 (Revenue Inflows), House 5 (Speculative gains), House 9 (Bhagya/Fortune). Karaka: Jupiter (prosperity)."
  },
  health: {
    title: "Health & Vitality",
    icon: "🌿",
    houses: [1, 6, 8, 12],
    karakas: ["Sun", "Mars", "Saturn"],
    meaning: "House 1 (Physical Constitution), House 6 (Diseases & Immunity), House 8 (Longevity & Recovery), House 12 (Hospitalization). Karakas: Sun (vitality) and Mars (blood)."
  },
  education: {
    title: "Education & Intellect",
    icon: "📚",
    houses: [4, 5, 9],
    karakas: ["Mercury", "Jupiter"],
    meaning: "House 4 (Foundational Education), House 5 (Higher Learning & Intelligence), House 9 (Higher Philosophy & Guru). Karakas: Mercury (logic) and Jupiter (wisdom)."
  },
  spirituality: {
    title: "Spirituality & Moksha",
    icon: "🕉️",
    houses: [9, 12, 8, 4],
    karakas: ["Ketu", "Jupiter", "Sun"],
    meaning: "House 9 (Dharma & Faith), House 12 (Moksha & Meditation), House 8 (Occult Insight), House 4 (Inner Serenity). Karakas: Ketu (liberation) and Jupiter (guru)."
  },
  property: {
    title: "Property & Vehicles",
    icon: "🏠",
    houses: [4, 1],
    karakas: ["Mars", "Venus"],
    meaning: "House 4 (Real Estate, Land, Vehicles, Mother), House 1 (Self-Ownership). Karakas: Mars (Bhumi/land) and Venus (conveyances & luxury homes)."
  }
};

/**
 * Analyzes a Life Area for a given natal profile
 */
function analyzeLifeArea(areaKey, profile, detectedYogas = []) {
  const config = LIFE_AREA_CONFIG[areaKey];
  if (!config) return null;

  const p = profile;
  const houses = config.houses;
  const karakas = config.karakas;
  const startSignIdx = p.lagna.rashiIndex;

  const houseBreakdown = houses.map(h => {
    const sIdx = (startSignIdx + h - 1) % 12;
    const lord = SIGN_LORDS[sIdx];
    const lordHouse = p.planetHouses[lord];
    const occupants = [];
    for (const pl in p.planetHouses) {
      if (p.planetHouses[pl] === h) occupants.push(pl);
    }
    return {
      house: h,
      sign: RASHIS[sIdx].name.split(" ")[0],
      lord,
      lordPlacement: lordHouse,
      occupants
    };
  });

  const karakaBreakdown = karakas.map(k => {
    return {
      karaka: k,
      house: p.planetHouses[k],
      sign: p.planetSigns[k]
    };
  });

  // Filter yogas connected to these houses or karakas
  const relevantYogas = (detectedYogas || []).filter(y => {
    const housesMatch = y.houses && y.houses.some(yh => houses.includes(yh));
    const planetsMatch = y.planets && y.planets.some(yp => karakas.includes(yp));
    return housesMatch || planetsMatch;
  });

  return {
    key: areaKey,
    title: config.title,
    icon: config.icon,
    meaning: config.meaning,
    houses,
    karakas,
    houseBreakdown,
    karakaBreakdown,
    relevantYogas
  };
}

/**
 * Synastry & Compatibility Cross-Chart Engine
 * Calculates inter-chart aspects and conjunctions between two partners
 */
function calculateSynastryConnections(chartA, chartB) {
  const connections = [];
  const pA = chartA.planetHouses;
  const pB = chartB.planetHouses;
  const signsA = chartA.planetSigns;
  const signsB = chartB.planetSigns;

  // 1. Cross-chart Conjunctions (Planet in A in same sign as Planet in B)
  for (const plA in signsA) {
    for (const plB in signsB) {
      if (signsA[plA] === signsB[plB]) {
        connections.push({
          type: "Cross Conjunction",
          source: { chart: "A", planet: plA, house: pA[plA] },
          target: { chart: "B", planet: plB, house: pB[plB] },
          sign: signsA[plA],
          title: `Mutual Union in ${signsA[plA]} (${plA} ☌ ${plB})`,
          meaning: `Partner 1's ${plA} and Partner 2's ${plB} meet in ${signsA[plA]}, producing profound emotional resonance and shared soul priorities.`
        });
      }
    }
  }

  // 2. Cross-chart Aspects (e.g. Mars/Jupiter in A aspecting Moon/Venus in B)
  for (const plA in pA) {
    const offsets = PLANET_ASPECT_OFFSETS[plA] || [7];
    const houseA = pA[plA];

    offsets.forEach(off => {
      let targetH = (houseA + off - 1) % 12;
      if (targetH === 0) targetH = 12;

      for (const plB in pB) {
        if (pB[plB] === targetH) {
          connections.push({
            type: "Cross Aspect",
            source: { chart: "A", planet: plA, house: houseA },
            target: { chart: "B", planet: plB, house: targetH },
            title: `Partner 1's ${plA} aspects Partner 2's ${plB} (H${targetH})`,
            meaning: `Partner 1's ${plA} projects its ${off}th aspect onto Partner 2's ${plB}, creating magnetic attraction and mutual stimulation.`
          });
        }
      }
    });
  }

  return connections;
}

/**
 * Traditional Astrological Remedies (Educational & Non-Prescriptive)
 */
const TRADITIONAL_REMEDIES = {
  "Sun": {
    gemstone: "Ruby (Manikya) in gold on ring finger",
    mantra: "Om Hram Hreem Hroum Sah Suryaya Namah (108 times)",
    day: "Sunday morning at sunrise",
    deity: "Lord Surya / Gayatri Devi",
    charity: "Wheat, copper vessels, jaggery to elders",
    rudraksha: "1 Mukhi or 12 Mukhi Rudraksha"
  },
  "Moon": {
    gemstone: "Natural Pearl (Moti) in silver on little finger",
    mantra: "Om Shram Shreem Shroum Sah Chandraya Namah (108 times)",
    day: "Monday evening",
    deity: "Lord Shiva / Chandra Deva",
    charity: "Milk, rice, white garments, silver to mothers or monks",
    rudraksha: "2 Mukhi Rudraksha"
  },
  "Mars": {
    gemstone: "Red Coral (Moonga) in copper or gold on ring finger",
    mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah (108 times)",
    day: "Tuesday morning",
    deity: "Lord Hanuman / Kartikeya (Murugan)",
    charity: "Red lentils (Masoor dal), blood donation, feeding monkeys",
    rudraksha: "3 Mukhi Rudraksha"
  },
  "Mercury": {
    gemstone: "Emerald (Panna) in gold or bronze on little finger",
    mantra: "Om Bram Breem Broum Sah Budhaya Namah (108 times)",
    day: "Wednesday morning",
    deity: "Lord Ganesha / Vishnu",
    charity: "Green moong dal, green clothes, feeding cows green grass",
    rudraksha: "4 Mukhi or 10 Mukhi Rudraksha"
  },
  "Jupiter": {
    gemstone: "Yellow Sapphire (Pukhraj) in gold on index finger",
    mantra: "Om Gram Greem Groum Sah Gurave Namah (108 times)",
    day: "Thursday morning",
    deity: "Lord Brihaspati / Lord Vishnu / Dakshinamurthy",
    charity: "Chana dal, turmeric, yellow sweets, supporting education of students",
    rudraksha: "5 Mukhi Rudraksha"
  },
  "Venus": {
    gemstone: "Diamond or White Zircon in platinum/silver on middle or little finger",
    mantra: "Om Dram Dreem Droum Sah Shukraya Namah (108 times)",
    day: "Friday morning",
    deity: "Goddess Maha Lakshmi",
    charity: "Ghee, white sweets, perfume, honoring women and artists",
    rudraksha: "6 Mukhi Rudraksha"
  },
  "Saturn": {
    gemstone: "Blue Sapphire (Neelam) or Amethyst in panchdhatu/iron on middle finger (test first)",
    mantra: "Om Pram Preem Proum Sah Shanaishcharaya Namah (108 times)",
    day: "Saturday twilight",
    deity: "Lord Shani / Lord Shiva / Hanuman",
    charity: "Black sesame seeds, mustard oil lamp under peepal tree, footwear to laborers",
    rudraksha: "7 Mukhi or 14 Mukhi Rudraksha"
  },
  "Rahu": {
    gemstone: "Hessonite (Gomed) in silver on middle finger",
    mantra: "Om Bhram Bhreem Bhroum Sah Rahave Namah (108 times)",
    day: "Saturday night",
    deity: "Goddess Durga / Bhairava",
    charity: "Black blankets, feeding stray dogs, donating to leprosy centers",
    rudraksha: "8 Mukhi Rudraksha"
  },
  "Ketu": {
    gemstone: "Cat's Eye (Lehsunia) in panchdhatu on little finger",
    mantra: "Om Stram Streem Stroum Sah Ketave Namah (108 times)",
    day: "Tuesday or Thursday midnight",
    deity: "Lord Ganesha / Matsya Avatar",
    charity: "Multi-colored blankets, feeding street dogs, visiting holy hermitages",
    rudraksha: "9 Mukhi Rudraksha"
  }
};

function getTraditionalRemedies(planetName) {
  const rem = TRADITIONAL_REMEDIES[planetName];
  if (!rem) return null;
  return {
    planet: planetName,
    ...rem,
    disclaimer: "Disclaimer: Astrological remedies are presented solely for cultural and educational enrichment. They are traditional practices and should not be construed as financial, medical, or legal directives."
  };
}

// Export expanded functions to window for browser access
window.VedasyncEngine = {
  getBirthProfile,
  calculateCompatibility,
  calculateTodayPanchang,
  getNakshatraPadaDetail,
  getComputedConnections,
  detectYogas,
  calculateVimshottariDasha,
  getTransitPositions,
  analyzeLifeArea,
  calculateSynastryConnections,
  getTraditionalRemedies,
  LIFE_AREA_CONFIG,
  NAKSHATRAS,
  RASHIS,
  SIGN_LORDS,
  PLANETARY_DIGNITIES,
  DASHA_LORDS
};

