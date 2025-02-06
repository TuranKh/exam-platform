import OpenAI from "openai";

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
});

export const completion = async function () {
  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: "Write a haiku about recursion in programming.",
      },
    ],
    store: true,
  });
};
