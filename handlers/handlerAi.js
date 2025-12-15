const axios = require('axios');
const { API_KEY } = require('../config/private.json');

const handlerAi = async (API_KEY, messages, options = {}) => {
  const {
    model = 'openai/gpt-4o',
    siteUrl,
    siteTitle,
    temperature = 0.7,
    max_tokens = 500
  } = options;

  try {
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages,
        temperature,
        max_tokens
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          ...(siteUrl && { 'HTTP-Referer': siteUrl }),
          ...(siteTitle && { 'X-Title': siteTitle })
        }
      }
    );

    return res.data;
  } catch (err) {
    if (err.response) {
      throw new Error(
        `OpenRouter ${err.response.status}: ${JSON.stringify(err.response.data)}`
      );
    }
    throw err;
  }
};

module.exports = handlerAi;