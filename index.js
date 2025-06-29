import express from "express"
import { generateText } from "ai"
import { openrouter, createOpenRouter } from "@openrouter/ai-sdk-provider"
import NodeCache from "node-cache"
import "dotenv/config"

const modelsCache = new NodeCache({stdTTL: 500})

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
    const freeOnly = req.headers["free"] === "true"
    const idOnly = req.headers["only-id"] === "true"
    const inputModality = req.headers["input-type"]
    const outputModality = req.headers["output-type"]


    try {
        let models = modelsCache.get("models")

        if(!models){
            console.log("fetching data")
            const response = await fetch("https://openrouter.ai/api/v1/models", {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
                }
            })
    
            const data = await response.json()
            models = data.data

            modelsCache.set("models", models)
        }


        if (freeOnly) {
            // Filter for free models (pricing.prompt = "0")
            console.log("free")
            models = models.filter(model =>
                model.pricing.prompt === "0" || model.pricing.prompt === 0
            )
        }


        // filter for input type
        if (inputModality) {
            const requiredModalities = inputModality.split(",").map(m => m.trim());

            models = models.filter(model => {
                const modelModalities = model.architecture.input_modalities;
                return requiredModalities.every(required =>
                    modelModalities.includes(required)
                );
            });
        }

        // filter for output type. openrouter only has text output models :C
        if (outputModality) {
            console.log("input model: ", outputModality)
            models = models.filter(model => {
                const modalities = model.architecture.output_modalities;

                if (outputModality === "text") {
                    return modalities.includes("text");
                } else if (outputModality === "image") {
                    return modalities.includes("image");
                } else if (outputModality === "both") {
                    return modalities.includes("text") && modalities.includes("image");
                }

                return true;
            });
        }


        // filter for only id
        if (idOnly) {
            console.log("only id")
            models = models.map((model) => model.id)
        }

        res.send(models)

    } catch (error) {
        console.error(`Model filtering error: ${error}`)
        res.status(500).json({
            error: "failed to fetch or filter models",
            details: error.message
        })
    }
})

app.listen(process.env.PORT || 3000)

export default app

// const {text} = await generateText({
//     model: client(model),
//     prompt: "hi",
// })

// console.log(text)