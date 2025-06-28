import express from "express"
import { generateText } from "ai"
import { openrouter, createOpenRouter } from "@openrouter/ai-sdk-provider"
import "dotenv/config"

const client = createOpenRouter({ apiKey: process.env.apiKey })

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

app.get("/models", async (req, res) => {
    const freeOnly = req.headers["free"]
    const idOnly = req.headers["onlyID"]


    const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        }
    })

    const data = await response.json()
    let models = []

    if (freeOnly) {
        // Filter for free models (pricing.prompt = "0")
        models = data.data.filter(model =>
            model.pricing.prompt === "0" || model.pricing.prompt === 0
        )
    } else {
        models = data.data
    }

    // continue working from here tomorrow. need another if statement for onlyID
    const modelids = models.map((model) => model.id)

    res.send(modelids)
})

app.listen(3000)

// const {text} = await generateText({
//     model: client(model),
//     prompt: "hi",
// })

// console.log(text)