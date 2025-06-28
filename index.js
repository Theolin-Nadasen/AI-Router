import express from "express"
import { generateText } from "ai"
import { openrouter, createOpenRouter } from "@openrouter/ai-sdk-provider"
import "dotenv/config"

const client = createOpenRouter({ apiKey: process.env.apiKey })

// test for getting models

const response = await fetch("https://openrouter.ai/api/v1/models", {
    headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
    }
});

const data = await response.json();

// Filter for free models (pricing.prompt = "0")
const freeModels = data.data.filter(model =>
    model.pricing.prompt === "0" || model.pricing.prompt === 0
);

freeModels.map((model) => {
    console.log(model.id)
})

// end test for getting models


const app = express()

app.get("/", async (req, res) => {
    const prompt = req.headers['prompt']
    const model = req.headers['model'] || "mistralai/mistral-small-3.2-24b-instruct:free"

    if (prompt) {

        try {
            const { text } = await generateText({
                model: client(model),
                prompt: prompt
            })

            console.log(text)
            res.send(text)
        } catch (error) {
            res.status(500).send(`Error : ${error.message}`)
        }

    } else {
        res.status(400).send("please include a prompt header")
    }
})

app.listen(3000)

// const {text} = await generateText({
//     model: client(model),
//     prompt: "hi",
// })

// console.log(text)