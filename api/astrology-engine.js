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
 * Computes Ascendant (Lagna) based on sun position and birth time
 * Lagna moves 15 degrees per hour starting from Sun's longitude at Sunrise (approx 6:00 AM local)
 */
function calculateLagna(sunLongitude, timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const birthTimeDecimal = hours + minutes / 60;
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
 * Calculates complete birth details
 */
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
  const birthDate = new Date(dobString);
  const [hrs, mins] = tobString.split(":").map(Number);
  
  const planets = calculatePlanetaryPositions(birthDate, hrs + mins/60);
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

// Export functions to window for browser access
window.VedasyncEngine = {
  getBirthProfile,
  calculateCompatibility,
  calculateTodayPanchang,
  NAKSHATRAS,
  RASHIS
};
