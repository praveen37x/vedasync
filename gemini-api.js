/**
 * Vedasync Gemini API Client
 * Manages chat interactions, prompt building, and simulated responses.
 */

const ASTROLOGERS_METADATA = {
  "Acharya Vashishta": {
    specialty: "Vedic Astrology & Kundli",
    experience: "18 years",
    style: "traditional, deeply mathematical, using Nakshatra placements and Shastras. Focuses on traditional remedies like mantra chanting and charity.",
    tone: "serene, scholarly, respectful, using Sanskrit terms like 'Shanti', 'Karma', 'Dharma'."
  },
  "Yogini Maitreyi": {
    specialty: "Tarot & Spiritual Guidance",
    experience: "10 years",
    style: "intuitive, connecting birth chart with Tarot cards (Major and Minor Arcana) and energy chakras. Focuses on mindfulness and meditation.",
    tone: "compassionate, modern, highly encouraging, using spiritual guidance terms like 'Energy', 'Intuition', 'Transformation'."
  },
  "Dr. Radhakrishnan": {
    specialty: "Numerology & Lal Kitab",
    experience: "15 years",
    style: "Lal Kitab remedies and mathematical Numerology (Life Path numbers, Destiny numbers). Focuses on practical house remedies and metal tokens.",
    tone: "direct, analytical, highly practical, focusing on numbers and actions."
  },
  "Guru Kripacharya": {
    specialty: "Vastu & KP System",
    experience: "20 years",
    style: "Vastu Shastra directions and Krishnamurti Paddhati (KP) sub-lords for precise timing of events.",
    tone: "authoritative, precise, direct, focusing on spatial alignment and exact timing."
  },
  "Aura Shruti": {
    specialty: "Palmistry & Face Reading",
    experience: "7 years",
    style: "interpreting palm lines (Life, Heart, Head lines) and facial symmetry relative to birth chart houses.",
    tone: "friendly, warm, conversational, focusing on personal traits and future potentials."
  },
  "Acharya Aditya": {
    specialty: "AI Vedic Astrologer & Jyotishi",
    experience: "Continuous",
    style: "traditional Vedic Jyotish shastras and planetary house calculations.",
    tone: "wise, encouraging, peaceful, traditional."
  }
};

const SYSTEM_INSTRUCTION = `You are "{ASTROLOGER_NAME}", a wise, compassionate, and highly skilled expert in {ASTROLOGER_SPECIALTY}. 
You provide guidance to the user using your {ASTROLOGER_EXPERIENCE} of experience.
Your reading style is: {ASTROLOGER_STYLE}
Your speaking tone is: {ASTROLOGER_TONE}

You have access to the user's birth profile:
{BIRTH_PROFILE}

Guidelines:
1. ALWAYS maintain your specified persona and tone. Start or end with warm expressions like "Namaste" or "Blessings upon you".
2. Use their computed Nakshatra, Moon Sign (Rashi), Sun Sign, and Ascendant (Lagna) details to ground your advice. Mention specific houses and lords when relevant.
3. Be realistic and practical. Avoid toxic positivity but focus on constructive solutions, remedial measures (like meditation, gemstone guidance, fasting, or charity), and spiritual growth.
4. Keep your responses structured, using markdown headers and bullet points for readability.
5. If the user asks questions unrelated to astrology, life path, personality, or guidance, gently steer the conversation back to their cosmic chart and planetary alignments.
6. Readings must include a disclaimer that they are for guidance and spiritual purposes only.`;

// Simulated readings database to use when no API key is provided
const SIMULATED_READINGS = {
  intro: (p) => `Namaste ${p.name || "seeker"} 🙏

I have cast your Vedic birth chart (Lagna Kundli) based on your birth details. 

Here are the cosmic coordinates of your soul's incarnation:
• **Ascendant (Lagna):** ${p.lagna.rashi} at ${p.lagna.degrees}°
• **Moon Sign (Rashi):** ${p.moonSign.name} (ruled by ${p.moonSign.ruler})
• **Birth Star (Nakshatra):** ${p.nakshatra.name}, Pada ${p.nakshatra.pada} (ruled by ${p.nakshatra.lord})
• **Sun Sign:** ${p.sunSign}

The Moon in **${p.nakshatra.name}** indicates that your mind is shaped by the energy of its ruling deity and planet, **${p.nakshatra.lord}**. Since your Nakshatra animal is the **${p.nakshatra.animal}** and your temperament (Gana) is **${p.nakshatra.gana}**, you possess a distinct mix of ${p.nakshatra.gana === "Deva" ? "gentleness, spiritual inclinations, and refinement" : p.nakshatra.gana === "Manushya" ? "practicality, human connection, and goal-oriented focus" : "intensity, sharp focus, and protective instincts"}.

What specific guidance do you seek today? You may ask about your **career**, **relationships & love**, **health**, or your **general life purpose**.`,

  career: (p) => `### 💼 Career and Financial Path

In your chart, the **Ascendant is ${p.lagna.rashi}** and your **Moon Sign is ${p.moonSign.name}**. 
Your Nakshatra **${p.nakshatra.name}** is ruled by **${p.nakshatra.lord}**. This configuration reveals valuable insights about your professional destiny:

1. **Natural Talents:** The influence of **${p.nakshatra.lord}** grants you ${
    p.nakshatra.lord === "Ketu" ? "a sharp analytical mind, intuitive problem-solving abilities, and a knack for spiritual or research-oriented work." :
    p.nakshatra.lord === "Venus" ? "a strong creative drive, appreciation for aesthetics, charm, and success in public-facing, luxury, or design sectors." :
    p.nakshatra.lord === "Sun" ? "natural authority, leadership capabilities, a desire for public recognition, and success in government or managerial roles." :
    p.nakshatra.lord === "Moon" ? "deep emotional intelligence, nurturing capabilities, adaptability, and suitability for psychology, hospitality, or creative arts." :
    p.nakshatra.lord === "Mars" ? "dynamic energy, courage, competitive spirit, and success in engineering, technology, sports, or executive execution." :
    p.nakshatra.lord === "Rahu" ? "unconventional thinking, a draw to cutting-edge technology, foreign travel/trade, and success in media, research, or complex analysis." :
    p.nakshatra.lord === "Jupiter" ? "wisdom, counseling abilities, teaching skills, and success in law, finance, education, or spiritual mentorship." :
    p.nakshatra.lord === "Saturn" ? "discipline, patience, capacity for hard work, structure, and success in long-term engineering, project management, or public service." :
    "a versatile intellect, excellent communication skills, and success in writing, media, marketing, or business ventures." // Mercury
  }
  
2. **Astrological House Influence:** 
   Your Sun is placed in **${p.planetSigns["Sun"]}** (House ${p.planetHouses["Sun"]}). This indicates that your core vitality and career status shine brightest when you focus on activities relating to the significations of the **${p.planetHouses["Sun"]} House** (e.g., ${
     p.planetHouses["Sun"] === 1 ? "self-development, leadership, and personal branding" :
     p.planetHouses["Sun"] === 2 ? "family wealth, voice, finance, and asset management" :
     p.planetHouses["Sun"] === 3 ? "communication, technology, entrepreneurial ventures, and writing" :
     p.planetHouses["Sun"] === 4 ? "real estate, home-based businesses, education, and vehicle trade" :
     p.planetHouses["Sun"] === 5 ? "intellectual creation, speculative markets, counseling, and education" :
     p.planetHouses["Sun"] === 6 ? "service, health care, problem solving, and administrative disputes" :
     p.planetHouses["Sun"] === 7 ? "business partnerships, public relations, trade, and legal relations" :
     p.planetHouses["Sun"] === 8 ? "research, occult sciences, insurance, mining, or joint finance" :
     p.planetHouses["Sun"] === 9 ? "higher philosophy, long-distance travel, publishing, or higher education" :
     p.planetHouses["Sun"] === 10 ? "mainstream public authority, corporate management, and career leadership" :
     p.planetHouses["Sun"] === 11 ? "large organizations, social networks, liquid cash gains, and community goals" :
     "foreign operations, import-export, spiritual retreats, or creative behind-the-scenes work" // 12
   }).

3. **Remedial Guidance:**
   To align your career energy, worship or pay gratitude to your Nakshatra Lord **${p.nakshatra.lord}**. Practicing clarity of intent on Wednesdays and Sundays will strengthen your planetary alignment. Keep a gold or bronze token on your desk to enhance the Solar leadership energy in your chart.`,

  relationship: (p) => `### 💖 Relationships and Compatibility

Looking at your chart from a Vedic relationship perspective:
• **Moon Sign (Rashi):** ${p.moonSign.name}
• **Nakshatra:** ${p.nakshatra.name} (Pada ${p.nakshatra.pada})
• **Nakshatra Animal (Yoni):** ${p.nakshatra.animal}
• **Temperament (Gana):** ${p.nakshatra.gana}

Astrological Analysis:
1. **Emotional Needs:** With your Moon in **${p.nakshatra.name}**, your emotional foundation is highly sensitive. You need a partner who respects your **${p.nakshatra.animal}** nature—which values ${
    p.nakshatra.animal === "Horse" ? "freedom, swift movement, and space" :
    p.nakshatra.animal === "Elephant" ? "strength, loyalty, family-oriented safety, and slow trust building" :
    p.nakshatra.animal === "Sheep" ? "warmth, community safety, gentle care, and peaceful surroundings" :
    p.nakshatra.animal === "Serpent" ? "mystery, deep intimacy, transformation, and protective boundaries" :
    p.nakshatra.animal === "Dog" ? "faithfulness, protective companionship, active dialogue, and playfulness" :
    p.nakshatra.animal === "Cat" ? "independence, clean aesthetic surroundings, curiosity, and selective intimacy" :
    p.nakshatra.animal === "Rat" ? "shrewd coordination, resource accumulation, attention to detail, and cozy comfort" :
    p.nakshatra.animal === "Cow" ? "stability, peace, gentle routine, domestic comfort, and simple truths" :
    p.nakshatra.animal === "Buffalo" ? "steadfast perseverance, quiet loyalty, heavy dedication, and comfort" :
    p.nakshatra.animal === "Tiger" ? "passion, fierce independence, respect for strength, and privacy" :
    p.nakshatra.animal === "Hare" ? "gentleness, sensitivity, safety-first environment, and playful conversation" :
    p.nakshatra.animal === "Monkey" ? "wit, playful mischief, intellectual agility, and constant expression" :
    p.nakshatra.animal === "Lion" ? "grand respect, royalty, central attention, protection, and fierce devotion" :
    "singular independence, analytical depth, self-protection, and deep mental alignment" // Mongoose
  }.
  
2. **The 7th House (Partnership house):**
   In your chart, the 7th house (starting from Lagna) is **${RASHIS[(p.lagna.rashiIndex + 6) % 12].name.split(" ")[0]}**, which is ruled by **${RASHIS[(p.lagna.rashiIndex + 6) % 12].ruler}**. 
   This indicates that you will be drawn to partners who embody the characteristics of **${RASHIS[(p.lagna.rashiIndex + 6) % 12].ruler}**—seeking ${
     RASHIS[(p.lagna.rashiIndex + 6) % 12].ruler === "Mars" ? "courageous, dynamic, active, and direct partners who can match your passion." :
     RASHIS[(p.lagna.rashiIndex + 6) % 12].ruler === "Venus" ? "refined, beautiful, artistic, and peaceful partners who value harmony and romance." :
     RASHIS[(p.lagna.rashiIndex + 6) % 12].ruler === "Mercury" ? "intelligent, talkative, witty, and business-minded partners who enjoy mental exchange." :
     RASHIS[(p.lagna.rashiIndex + 6) % 12].ruler === "Moon" ? "nurturing, sensitive, home-loving, and emotionally receptive partners." :
     RASHIS[(p.lagna.rashiIndex + 6) % 12].ruler === "Sun" ? "strong, reputable, confident, and noble partners who can stand as pillars of strength." :
     RASHIS[(p.lagna.rashiIndex + 6) % 12].ruler === "Jupiter" ? "wise, spiritual, educational, and morally upright partners who act as guides." :
     "mature, disciplined, serious, and older/established partners who value stability above all." // Saturn
   }

3. **Remedies for Relationship Harmony:**
   To clear obstacles in partnerships, lighting a small ghee lamp in the evening on Fridays or chanting the mantra of your 7th lord is highly recommended. For specific compatibilities, use the **Kundli Milan** tool to run a 36-point check.`,

  health: (p) => `### 🌿 Health and Wellness (Vedic View)

According to Ayurvedic and Astrological principles, your physical template is guided by your Lagna **${p.lagna.rashi}** and Moon Sign **${p.moonSign.name}**.

1. **Element Constitution (Dosha Tendencies):**
   - Your Moon Sign belongs to the **${p.moonSign.element}** element. 
   - ${
     p.moonSign.element === "Fire" ? "This indicates a predominance of **Pitta Dosha**. You may be prone to heat-related issues, skin sensitivity, hyperacidity, or inflammation. It is important to eat cooling foods and avoid extreme spices." :
     p.moonSign.element === "Earth" ? "This indicates a predominance of **Kapha Dosha**. You have strong endurance and structure, but can be prone to sluggishness, fluid retention, or slow digestion. Focus on warm, light meals and active exercise." :
     p.moonSign.element === "Air" ? "This indicates a predominance of **Vata Dosha**. You have a highly active nervous system, but may suffer from anxiety, dry skin, joint pains, or bloating. Regular routines, warm soups, and grounding yoga are best." :
     "This indicates a predominance of **Pitta/Kapha (Water Dosha)**. You are emotionally deep but can be prone to congestion, emotional eating, and slow metabolism. Regular cardio exercise and detoxifying herbs are recommended." // Water
   }
   
2. **Planetary Placement:**
   Your Lagna lord is **${RASHIS[p.lagna.rashiIndex].ruler}**. When this planet is well-placed, your immunity remains strong. Currently, we look at House 6 (the house of obstacles and illness), which in your chart corresponds to the sign **${RASHIS[(p.lagna.rashiIndex + 5) % 12].name.split(" ")[0]}**. Staying disciplined in diet during the planetary transits affecting this sign is key.

3. **Remedial Practices:**
   - Practicing **Pranayama (breath control)** daily will harmonize the Vata (Air) flow in your system.
   - Drink water from a copper vessel in the morning to balance the elemental energies of your Ascendant.`,

  general: (p) => `### 🌟 Your Vedic Soul Profile

Let us explore the core spiritual blueprint of your chart:

• **Ascendant (Lagna) in ${p.lagna.rashi}**: This is your physical incarnation and how you project yourself to the world. It dictates your overall vitality, appearance, and immediate approach to life.
• **Moon in ${p.moonSign.name} (${p.nakshatra.name} Nakshatra)**: The Moon rules your mind, subconscious patterns, and emotional security. You process reality through the lens of **${p.nakshatra.lord}**'s qualities.
• **Sun in House ${p.planetHouses["Sun"]}**: The Sun represents your soul's core purpose, your ego, and your relationship with authority and father figures. Being in House ${p.planetHouses["Sun"]} highlights that you seek self-actualization through ${
    p.planetHouses["Sun"] === 1 ? "developing personal authority and physical presence." :
    p.planetHouses["Sun"] === 2 ? "securing family assets, voice, and values." :
    p.planetHouses["Sun"] === 3 ? "exerting willpower, writing, and communication." :
    p.planetHouses["Sun"] === 4 ? "nurturing emotional roots, home, and inner happiness." :
    p.planetHouses["Sun"] === 5 ? "creative intelligence, education, and children." :
    p.planetHouses["Sun"] === 6 ? "daily discipline, overcoming obstacles, and helping others." :
    p.planetHouses["Sun"] === 7 ? "creating partnerships, harmony, and dealing with the public." :
    p.planetHouses["Sun"] === 8 ? "exploring mysteries, spiritual transformation, and deep research." :
    p.planetHouses["Sun"] === 9 ? "philosophical searching, religious devotion, and higher wisdom." :
    p.planetHouses["Sun"] === 10 ? "achieving professional recognition and societal influence." :
    p.planetHouses["Sun"] === 11 ? "connecting with communities, liquid gains, and elder siblings." :
    "meditation, isolation, and exploring the subconscious realms." // 12
  }

If you have a specific question about your transit cycles (Dashas) or want to analyze your compatibility with another birth chart, please let me know!`
};

/**
 * Generates a simulated response based on the message content and user profile
 */
function generateSimulatedResponse(message, profile, astrologerName = "Acharya Aditya") {
  const query = message.toLowerCase();
  const guru = ASTROLOGERS_METADATA[astrologerName] || ASTROLOGERS_METADATA["Acharya Aditya"];
  
  let reading = "";
  if (query.includes("career") || query.includes("job") || query.includes("work") || query.includes("money") || query.includes("finance") || query.includes("business") || query.includes("wealth")) {
    reading = SIMULATED_READINGS.career(profile);
  } else if (query.includes("relationship") || query.includes("love") || query.includes("marriage") || query.includes("husband") || query.includes("wife") || query.includes("partner") || query.includes("compat")) {
    reading = SIMULATED_READINGS.relationship(profile);
  } else if (query.includes("health") || query.includes("disease") || query.includes("body") || query.includes("diet") || query.includes("sick") || query.includes("mental")) {
    reading = SIMULATED_READINGS.health(profile);
  } else {
    reading = SIMULATED_READINGS.general(profile);
  }
  
  // Add customized guru details
  let introPrefix = `**[Consultation with ${astrologerName} - ${guru.specialty}]**\n\n`;
  let customInsight = "";
  
  if (astrologerName === "Yogini Maitreyi") {
    customInsight = `\n\n*Tarot Card pull for your query:* **The Wheel of Fortune (Reversed)**. This card combined with your Moon position indicates that transits are pushing you to adapt. Aligning your energy flows will help you navigate this transition.`;
  } else if (astrologerName === "Dr. Radhakrishnan") {
    customInsight = `\n\n*Numerological Insight:* Your birth details indicate a strong resonance with number **7** for decision-making. Focus on grounding actions on days linked to this number.`;
  } else if (astrologerName === "Guru Kripacharya") {
    customInsight = `\n\n*Vastu Alignment:* Ensure the Northeast section of your workspace remains uncluttered to allow the positive flow of energy.`;
  } else if (astrologerName === "Aura Shruti") {
    customInsight = `\n\n*Palmistry Note:* The clear curve of your Head Line matches the creative flexibility in your Moon sign, pointing to success in communications.`;
  }
  
  return introPrefix + reading + customInsight + `\n\n*Blessings upon you,*\n**${astrologerName}**\n\n*Note: This is a simulated response. Provide a Gemini API key in Settings to connect to real-time LLM consultations.*`;
}

/**
 * Communicates with the actual Gemini API
 * @param {Array} history - [{role: "user"|"model", parts: [{text: "..."}]}]
 * @param {Object} profile - User's birth profile
 * @param {string} astrologerName - Selected astrologer name
 * @returns {Promise<string>} response text
 */
async function sendMessageToGemini(history, profile, astrologerName = "Acharya Aditya") {
  const apiKey = localStorage.getItem("vedasync_gemini_key");
  const guru = ASTROLOGERS_METADATA[astrologerName] || ASTROLOGERS_METADATA["Acharya Aditya"];
  
  if (!apiKey) {
    // If no key, run fallback simulation on the LAST message sent
    const lastUserMsg = [...history].reverse().find(msg => msg.role === "user");
    const msgText = lastUserMsg ? lastUserMsg.parts[0].text : "";
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateSimulatedResponse(msgText, profile, astrologerName));
      }, 1200); // Add a small delay to simulate processing
    });
  }

  const profileStr = JSON.stringify({
    name: profile.name,
    dob: profile.dob,
    tob: profile.tob,
    pob: profile.pob,
    lagna: profile.lagna,
    moonSign: profile.moonSign,
    nakshatra: profile.nakshatra,
    sunSign: profile.sunSign,
    planetHouses: profile.planetHouses,
    planetSigns: profile.planetSigns
  }, null, 2);

  const systemInstructionText = SYSTEM_INSTRUCTION
    .replace("{ASTROLOGER_NAME}", astrologerName)
    .replace("{ASTROLOGER_SPECIALTY}", guru.specialty)
    .replace("{ASTROLOGER_EXPERIENCE}", guru.experience)
    .replace("{ASTROLOGER_STYLE}", guru.style)
    .replace("{ASTROLOGER_TONE}", guru.tone)
    .replace("{BIRTH_PROFILE}", profileStr);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: history,
        systemInstruction: {
          parts: [{ text: systemInstructionText }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    const modelReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!modelReply) {
      throw new Error("Empty response from Gemini API.");
    }
    return modelReply;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `⚠️ **Gemini API Error**: ${error.message}. Please double-check your API key in the settings modal or continue in Simulated Mode.`;
  }
}

// Export functions to window
window.VedasyncAPI = {
  getInitialGreeting: (profile) => SIMULATED_READINGS.intro(profile),
  sendMessageToGemini
};

