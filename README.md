# AI Router

## A router for AI models from openrouter

instructions to use:
- clone the repo `git clone https://github.com/Theolin-Nadasen/AI-Router.git`
- install npm packages `npm install`
- create `.env` file and put openrouter api key inside `apiKey=YOUR_API_KEY`
- run with `npm start`

## This router uses headers for filtering

these are the available headers:
```
free : true     // only returns free models
only-id : true  // only gives model ids
input-type: text    // can be text or image or file or a comma separated list eg text,image
output-type: text   // open router only supports text for now
```

you can also use multiple filters
