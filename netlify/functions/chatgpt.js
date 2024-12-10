const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Parse the incoming request body (the user's message)
  const body = JSON.parse(event.body || "{}");
  const userMessage = body.message || "";

  // Check if a message was provided
  if (!userMessage) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No message provided" })
    };
  }

  // Call OpenAI API
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();

    // Extract the assistant's reply
    const assistantReply = data.choices?.[0]?.message?.content || "No response from AI";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: assistantReply })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
