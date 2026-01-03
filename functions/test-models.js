const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyCilYVHIHtHZNWiKkYkED1X8ae5MJvpmdg";

async function testModels() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  const modelsToTest = [
    "gemini-pro",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "models/gemini-pro",
    "models/gemini-1.5-flash"
  ];
  
  console.log("Testing models with your API key...\n");
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello");
      const response = await result.response;
      console.log(`  ✅ SUCCESS - ${modelName} works!`);
      console.log(`  Response: ${response.text().substring(0, 50)}...\n`);
    } catch (error) {
      console.log(`  ❌ FAILED - ${modelName}`);
      console.log(`  Error: ${error.message}\n`);
    }
  }
}

testModels();
