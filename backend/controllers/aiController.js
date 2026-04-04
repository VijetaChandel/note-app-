const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const processNoteWithAI = async (req, res) => {
  try {
    const { noteContent, action } = req.body; // action can be 'summarize', 'tags', etc.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    if (action === "summarize") {
      prompt = `Summarize this note in 3 bullet points: ${noteContent}`;
    } else if (action === "tags") {
      prompt = `Give me 3 short professional tags for this note: ${noteContent}`;
    } else {
      prompt = `Improve the grammar of this note: ${noteContent}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ success: true, aiResponse: text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI processing failed" });
  }
};

module.exports = { processNoteWithAI };