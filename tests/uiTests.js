// testcafe chrome tests/uiTests.js

import { Selector } from 'testcafe';
const textInput = Selector('#textInput');
const enterButton = Selector('#predictButton')
const userMessageSpan = Selector("#userMessage span")
const chatBotResponseSpan = Selector('#outputArea span')

fixture('Getting Started')
    .page('https://moodymusic.pythonanywhere.com/');

test('Asserting value submitted to chatbot is displayed in the correct area', async t => {
    const randomWords = ['behavior','side','abstract','Sunday','pavement','direct'
                    ,'hypothesis','chicken','ceiling','influence']
    const r = Math.floor(Math.random() * randomWords.length)
    const wordToType = randomWords[r]
    await t
        .maximizeWindow()
        .typeText(textInput,wordToType)
        .click(enterButton)
        .expect(userMessageSpan.innerText).eql(wordToType)
});

test('Asserting greeting response', async t => {
    const wordToType = "hi"
    const potentialResponses = ["Hey :-)",
    "Hello, thanks for visiting",
    "Hi there, what can I do for you?",
    "Hi there, how can I help?"]
    await t
        .maximizeWindow()
        .typeText(textInput,wordToType)
        .click(enterButton)
        const chatbotResponse = await chatBotResponseSpan.innerText;
        if (
            potentialResponses.includes(chatbotResponse)
        ) {
            await t.expect(true).ok();
        } else {
            await t.expect(false).ok();
        }
}); 

test('Asserting fallback response', async t => {
    const randomWords = ['behavior','side','abstract','Sunday','pavement','direct'
                    ,'hypothesis','chicken','ceiling','influence']
    const fallbackResponse = "Sorry, I cannot understand you yet."
    const r = Math.floor(Math.random() * randomWords.length)
    const wordToType = randomWords[r]
    await t
        .maximizeWindow()
        .typeText(textInput,wordToType)
        .click(enterButton)
        .expect(chatBotResponseSpan.innerText).eql(fallbackResponse)
}); 