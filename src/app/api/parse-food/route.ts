import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const { text, constraints = [] } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("Using mock response because GROQ_API_KEY is not set.");
      if (text.toLowerCase().includes('dal chawal') && text.toLowerCase().includes('roti')) {
        return NextResponse.json({
          items: [
            { food: 'dal', protein: 9, calories: 180 },
            { food: 'rice (chawal)', protein: 4, calories: 200 },
            { food: 'roti (x2)', protein: 6, calories: 140 }
          ]
        });
      }
      
      return NextResponse.json({
        items: [
          { food: 'eggs (x2)', protein: 12, calories: 140 },
          { food: 'banana', protein: 1, calories: 105 }
        ]
      });
    }

    const groq = new Groq({ apiKey });

    // Inject user constraints if they exist
    const constraintsText = constraints.length > 0 
      ? `\nAdhere to the following user dietary constraints when interpreting ambiguity: ${constraints.join(', ')}.` 
      : '';

    const systemPrompt = `You are a nutrition parser.
Convert natural language food descriptions into JSON.
Estimate protein and calories using common household portions.${constraintsText}
Respond ONLY in valid JSON with exactly this output format without any markdown wrappers or preamble:
{
 "items":[
  {"food":"string", "quantity": "string", "protein":number,"calories":number}
 ]
}
Example: "5 roti" -> {"food": "roti", "quantity": "x5", "protein": 15, "calories": 350}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null,
    });

    let fullResponse = '';
    for await (const chunk of chatCompletion) {
      fullResponse += chunk.choices[0]?.delta?.content || '';
    }

    if (!fullResponse) throw new Error('No content returned from Groq');

    // Clean up any potential markdown wrappers that the reasoning model might still output despite instructions
    fullResponse = fullResponse.trim();
    if (fullResponse.startsWith('```json')) {
      fullResponse = fullResponse.replace(/^```json\n/, '').replace(/\n```$/, '');
    }

    const parsed = JSON.parse(fullResponse);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Error in parse-food API:', error);
    return NextResponse.json({ error: 'Failed to parse food input.' }, { status: 500 });
  }
}

