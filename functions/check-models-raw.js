const https = require('https');

const API_KEY = "AIzaSyCilYVHIHtHZNWiKkYkED1X8ae5MJvpmdg";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log(`Querying: ${url.replace(API_KEY, 'HIDDEN_KEY')}`);

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.error) {
          console.error("\n❌ API Error:");
          console.error(JSON.stringify(json.error, null, 2));
      } else if (json.models) {
          console.log("\n✅ AVAILABLE MODELS for your Key:");
          console.log("=================================");
          json.models.forEach(m => {
              // We are looking for models that support 'generateContent'
              if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                  console.log(`Name: ${m.name}`);
                  console.log(`Display: ${m.displayName}`);
                  console.log(`---------------------------------`);
              }
          });
      } else {
          console.log("\n⚠️ Response OK but no 'models' list found:");
          console.log(JSON.stringify(json, null, 2));
      }
    } catch (e) {
      console.error("\n❌ Error parsing response:", e.message);
      console.log("Raw response start:", data.substring(0, 200));
    }
  });

}).on("error", (err) => {
  console.error("\n❌ Network Error:", err.message);
});
