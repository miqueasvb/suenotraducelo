import { Configuration, OpenAIApi } from "openai";

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const sueño = body.sueño;

    if (!sueño) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No se envió ningún sueño." }),
      };
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const prompt = `
Quiero que actúes como un intérprete de sueños.
Analizá este sueño dividiéndolo en tres partes:
1. Significado simbólico o tradicional.
2. Análisis emocional o psicológico posible.
3. Consejo personal simple.

Sueño: "${sueño}"
    `.trim();

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const respuesta = completion.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta }),
    };
  } catch (error) {
    console.error("Error interpretando el sueño:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hubo un problema al interpretar el sueño." }),
    };
  }
}
