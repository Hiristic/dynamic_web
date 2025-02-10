import express from 'express'
import OpenAI from 'openai'

const app = express()
const port = 3000

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

app.get('/api/generate-content', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du är en innehållsskapare som genererar intressanta artiklar i HTML-format."
        },
        {
          role: "user",
          content: "Skapa en kort artikel om ett intressant ämne."
        }
      ]
    })

    res.json({ content: completion.choices[0].message.content })
  } catch (error) {
    console.error('Fel vid API-anrop:', error)
    res.status(500).json({ error: 'Kunde inte generera innehåll' })
  }
})

app.listen(port, () => {
  console.log(`Server körs på port ${port}`)
}) 