const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateTopicsForText(text) {
    const prompt = `Based on the following text from a lecture note, identify and list the main topics. Return a numbered list of topics.\n\nText: "${text.substring(0, 4000)}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const topicsText = response.text();
    return topicsText.split('\n').map(t => t.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
}

async function generateQuizForTopic(topic, context) {
    const prompt = `Create a multiple-choice quiz with 5 questions about "${topic}". Use the following context. For each question, provide 4 options (A, B, C, D) and indicate the correct answer's letter. Return the data as a JSON array like this: [{"question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "answer": "A"}].\n\nContext: "${context.substring(0, 4000)}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
}

async function generateFlashcardsForTopic(topic, context) {
    const prompt = `Create 5 flashcards for the topic "${topic}". Use the following context. Each flashcard should have a 'question' and an 'answer'. Return the data as a JSON array like this: [{"question": "...", "answer": "..."}].\n\nContext: "${context.substring(0, 4000)}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
}

async function answerQuestionFromDocument(question, context) {
    const prompt = `Answer the following question based on the provided document content. If the answer is not in the text, say so.\n\nQuestion: "${question}"\n\nDocument: "${context.substring(0, 8000)}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

module.exports = {
    generateTopicsForText,
    generateQuizForTopic,
    generateFlashcardsForTopic,
    answerQuestionFromDocument
};