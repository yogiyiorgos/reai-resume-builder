const { Configuration, OpenAIApi } = require('openai')
const express = require('express')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const fs = require('fs')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))

// Create a route in the app to access uploaded files -> Serve the static contents of the 'uploads' folder
app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.use(cors())

const generateID = () => Math.random().toString(36).substring(2, 10)

// Set up a storage object for the uploaded files
const storage = multer.diskStorage({
  // Tell where to store the file -> 'uploads' folder
  destination: (req, file, cb) => {
    cd(null, 'uploads')
  },
  // Create  aunique aem for the file based on the current date and the original file name
  filename: (req, file, cb) => {
    cd(null, Date.now() + path.extname(file.originalname))
  },
})

// Middleware function that will handle the actual file uploads
const upload = multer({
  storage: storage,
  limits: { filesize: 1024 * 1024 * 5 }
})

const configuration = new Configuration({
  apiKey: process.env.OPENAIAPI,
})

const openai = new OpenAIApi(configuration)

let database = []

const GPTFunction = async (text) => {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: text,
    temperature: 0.6,
    max_tokens: 250,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  })
  return response.data.choices[0].text
}

app.post('/resume/create', upload.single('avatar'), async (req, res) => {
  const {
    fullName,
    currentPosition,
    currentLength,
    currentTechnologies,
    workHistory,
  } = req.body

  const workArray = JSON.parse(workHistory)

  console.log(req.body)
  // Job description prompt
  const prompt1 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I use the following technology stack: ${currentTechnologies}. \n Write a 100 word CV introduction description, in the first person writing`

  // Job responsibilities prompt
  const prompt2 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I use the following technology stack: ${currentTechnologies}. \n Write 10 things that I am good at.`

  // Loop through the items in the workingArray and convert them to a string
  const remainderText = () => {
    let stringText = ''
    for (let i = 0;i < workArray.length;i++) {
      stringText += ` ${workArray[i].name} as a ${workArray[i].position}.`
    }
    return stringText
  }

  // Job achievements prompt
  const prompt3 = `I am writing a resume, my details are \n name: ${fullName} \n role: ${currentPosition} (${currentLength} years). \n I use the following technology stack: ${currentTechnologies}. \n During my years I worked at ${workArray.length} companies. ${remainderText()} \n Write 50 word for each company seperated in numbers of succession in the company, write in first person.`

  // Generate a GPT-3 result
  const objective = await GPTFunction(prompt1)
  const keypoints = await GPTFunction(prompt2)
  const jobResponsibilities = await GPTFunction(prompt3)

  const chatgptData = { objective, keypoints, jobResponsibilities }

  const data = { ...newEntry, ...chatgptData }
  database.push(data)

  req.json({
    message: 'Request successful',
    data,
  })
})

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello World'
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`)
})