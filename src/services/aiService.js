import axios from 'axios';
import { getAllSouthIndiaPlaces } from '../utils/southIndiaData';
import { formatCurrency } from '../utils/helpers';

const DESTINATION_TIPS = {
  beaches: 'Pack reef-safe sunscreen and visit early morning for fewer crowds.',
  mountains: 'Layer clothing and acclimatize for 24 hours at altitude.',
  waterfalls: 'Waterproof gear recommended; trails can be slippery.',
  adventure: 'Book guided activities and check insurance coverage.',
  nature: 'Respect wildlife distances and follow park regulations.',
};

export const generateAIResponse = async (message, context = {}) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey) {
    try {
      const allPlaces = getAllSouthIndiaPlaces();
      const dbContext = allPlaces.map(p => `- Name: "${p.name}", District: "${p.district}", State: "${p.state}", Category: "${p.category}", Rating: ${p.rating}, Budget: ${p.budget}, Season: "${p.bestSeason}"`).join('\n');

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const systemInstruction = `You are a premium AI travel planner for TravelSync. The user is asking: "${message}".
Current planning context:
- Destination: ${context.destination || 'South India'}
- Travelers: ${context.travelers || 2}
- Total Budget: ${context.budget || 3500}

Here is the exact list of available tourist destinations in our database. When suggesting trips or places in South India, prioritize recommending these specific spots by their exact names so the user can easily find and map them:
${dbContext}

Provide a helpful, highly accurate, and structured response using markdown formatting, bullet points, and practical advice.
Also provide exactly 3 quick-reply follow-up suggestions (1-3 words each) that the user might click next.
You must return your response as a JSON object adhering to this schema:
{
  "content": "Your markdown-formatted response string",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}`;

      const { data } = await axios.post(url, {
        contents: [
          {
            parts: [{ text: systemInstruction }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              content: { type: 'string' },
              suggestions: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['content', 'suggestions']
          }
        }
      }, {
        timeout: 10000
      });

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          role: 'assistant',
          content: parsed.content || 'Here is your travel suggestion.',
          suggestions: parsed.suggestions || ['Suggest hotels', 'Optimize budget', 'Plan itinerary']
        };
      }
    } catch (error) {
      console.warn('Gemini API call failed, falling back to mock travel agent:', error.message);
    }
  }

  // FALLBACK MOCK TRAVEL AGENT
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
  const lower = message.toLowerCase();

  if (lower.includes('budget') || lower.includes('cost')) {
    const total = context.budget || 3500;
    return {
      role: 'assistant',
      content: `Based on a ${context.travelers || 2}-traveler trip, I estimate **${formatCurrency(total)}** total:\n\n• Hotels: 40% (${formatCurrency(total * 0.4)})\n• Food: 20%\n• Activities: 25%\n• Transport: 10%\n• Shopping: 5%\n\nAdjust by choosing budget or luxury stays in the Planner.`,
      suggestions: ['Open budget planner', 'Find cheaper hotels', 'Optimize transport'],
    };
  }

  if (lower.includes('itinerary') || lower.includes('plan') || lower.includes('day')) {
    const dest = context.destination || 'your destination';
    return {
      role: 'assistant',
      content: `Here's a suggested 5-day itinerary for **${dest}**:\n\n**Day 1:** Arrival, check-in, evening city walk\n**Day 2:** Main landmarks & local cuisine tour\n**Day 3:** Nature/adventure activity\n**Day 4:** Cultural sites & shopping district\n**Day 5:** Relaxation & departure\n\nOpen the Planner to customize each day with activities and transport.`,
      suggestions: ['Add to planner', 'More adventure', 'Relaxing pace'],
    };
  }

  if (lower.includes('hotel') || lower.includes('restaurant') || lower.includes('food')) {
    return {
      role: 'assistant',
      content: `Top picks near ${context.destination || 'your trip'}:\n\n**Hotels:** Grand Horizon Resort, Boutique Stay Inn, Eco Lodge\n**Restaurants:** Ocean View Bistro, Local Spice Kitchen, Sunset Terrace\n\nSave favorites in Discover and attach them to your trip days in the Planner.`,
      suggestions: ['Show on map', 'Luxury options', 'Budget eats'],
    };
  }

  if (lower.includes('destination') || lower.includes('where') || lower.includes('suggest')) {
    const picks = getAllSouthIndiaPlaces().sort(() => 0.5 - Math.random()).slice(0, 3);
    return {
      role: 'assistant',
      content: `I recommend these destinations:\n\n${picks.map((p) => `• **${p.name}** (${p.district}) — ${p.rating}★ — from ${formatCurrency(p.budget)}`).join('\n')}\n\nEach offers unique experiences. Tap Discover to explore details.`,
      suggestions: picks.map((p) => `Explore ${p.name.split(' ')[0]}`),
    };
  }

  const category = Object.keys(DESTINATION_TIPS).find((k) => lower.includes(k));
  if (category) {
    return {
      role: 'assistant',
      content: DESTINATION_TIPS[category],
      suggestions: ['Find places', 'Build itinerary'],
    };
  }

  return {
    role: 'assistant',
    content: `I'm your TravelSync AI assistant! I can help with:\n\n• Destination recommendations\n• Day-by-day itineraries\n• Budget breakdowns\n• Hotels & restaurants\n• Trip optimization\n\nTry asking: "Suggest destinations for a beach trip" or "Plan a 5-day itinerary".`,
    suggestions: ['Suggest destinations', 'Plan my itinerary', 'Estimate budget'],
  };
};

export const getAISuggestedDestinations = () =>
  getAllSouthIndiaPlaces().slice(0, 4).map((p) => ({
    ...p,
    aiReason: 'Trending with travelers like you — great value & experiences.',
  }));
