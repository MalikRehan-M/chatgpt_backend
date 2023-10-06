const axios = require("axios");
const readlineSync = require("readline-sync");
require("dotenv").config();

(async () => {
  const apiKey = process.env.OPENAI_API_KEY;
  const apiUrl = "https://api.openai.com/v1/chat/completions"; 

  const history = [];

  while (true) {
    const user_input = readlineSync.question("Your input: ");

    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: user_input,
      },
    ];

    try {
      const response = await axios.post(
        apiUrl,
        {
          model: "gpt-3.5-turbo", 
          messages: messages,
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const completion_text = response.data.choices[0].message.content;
      console.log(completion_text);

      history.push([user_input, completion_text]);

      const user_input_again = readlineSync.question(
        "\nWould you like to continue the conversation? (Y/N)"
      );
      if (user_input_again.toUpperCase() === "N") {
        return;
      } else if (user_input_again.toUpperCase() !== "Y") {
        console.log("Invalid input. Please enter 'Y' or 'N'.");
        return;
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  }
})();
