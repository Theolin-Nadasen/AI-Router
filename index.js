import express from "express"
import { generateText } from "ai"
import { openrouter, createOpenRouter } from "@openrouter/ai-sdk-provider"
import "dotenv/config"

const client = createOpenRouter({apiKey : process.env.apiKey})

const model = "mistralai/mistral-small-3.2-24b-instruct:free"

const {text} = await generateText({
    model: client(model),
    prompt: "hi",
})

console.log(text)