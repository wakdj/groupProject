// testcafe chrome tests/uiTests.js

import { Selector } from 'testcafe';
const textInput = Selector('#textInput');
const enterButton = Selector('#predictButton')
const userMessageSpan = Selector("#userMessage span")
const chatBotResponseSpan = Selector('#outputArea span')
const loginToggle = Selector('#loginToggle')
const newAccountBtn = Selector('#newAccount')
const emailField = Selector('#emailField')
const firstPasswordField = Selector('#firstPassword')
const confirmPasswordField = Selector('#confirmPasswordField')
const createAccountButton = Selector('#createAccount')
const responseFromLoginSection = Selector("div .response p")
const pastChatsP = Selector('#pastChats')
const pastChatsUl = Selector('.past-chat ul')

const alph = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

fixture('Getting Started')
    .page('https://moodymusic.pythonanywhere.com/');

    function getInputsAndResponses(emotion){
        let potentialInputs = []
        let potentialResponses = []
        switch (emotion){
            case "greeting":
                potentialInputs = ["Hi",
                "Hey",
                "How are you",
                "Is anyone there?",
                "Hello",
                "Good day"]
                potentialResponses = [
                    "Hey :-)",
                    "Hello, thanks for visiting",
                    "Hi there, what can I do for you?",
                    "Hi there, how can I help?"
                  ]
                break;
            case "goodbye":
                potentialInputs = ["Bye", "See you later", "Goodbye"];
                potentialResponses = ["See you later, thanks for visiting",
                "Have a nice day"]
        }
        return [potentialInputs, potentialResponses]
    }

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
    const potentialInputs = getInputsAndResponses("greeting")[0]
    const potentialResponses = getInputsAndResponses("greeting")[1]
    const r = Math.floor(Math.random() * potentialInputs.length)
    const wordToType = potentialInputs[r]
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
 


test('Asserting function works', async t=>{
    let potentialInputs = getInputsAndResponses("greeting")[0]
    let potentialResponses = getInputsAndResponses("greeting")[1]
    const r = Math.floor(Math.random() * potentialInputs.length)
    const wordToType = potentialInputs[r]
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

})
test('Asserting emotion (sad) response', async t => {
    let potentialInputs = [ "sad",
    "unhappy",
    "shit",
    "heartbroken",
    "I'm feeling sad",
    "I'm feeling down",
    "I'm feeling blue",
    "I am very melancholy",
    "I am feeling sad",
    "I am feeling down",
    "I am feeling blue"]
    const potentialResponses = [ "Oh diddums, here's a few options for you to pick from.",
    "If you're not feeling so great, please pick one of the options below and I'll recommend a song for you."]
    const r = Math.floor(Math.random() * potentialInputs.length)
    const wordToType = potentialInputs[r]
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


test('Assert invalid email response',async t => {
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const N = 10
    const randomCharsForEmail = Array(N).join().split(',').map(function() { return alph.charAt(Math.floor(Math.random() * alph.length)); }).join('');
    const randomCharsForPasswords = Array(N).join().split(',').map(function() { return alph.charAt(Math.floor(Math.random() * alph.length)); }).join('');

    await t
        .maximizeWindow()
        .click(loginToggle)
        .click(newAccountBtn)
        .typeText(emailField, randomCharsForEmail)
        .typeText(firstPasswordField,randomCharsForPasswords)
        .typeText(confirmPasswordField,randomCharsForPasswords)
        .click(createAccountButton)
        .expect(responseFromLoginSection.innerText).eql("Invalid email")

})


test('Assert mismatched password response',async t => {
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const N = 10
    const randomCharsForEmail = Array(N).join().split(',').map(function() { return alph.charAt(Math.floor(Math.random() * alph.length)); }).join('');
    const randomCharsForPasswords = Array(N).join().split(',').map(function() { return alph.charAt(Math.floor(Math.random() * alph.length)); }).join('');

    await t
        .maximizeWindow()
        .click(loginToggle)
        .click(newAccountBtn)
        .typeText(emailField, randomCharsForEmail + "@gmail.com")
        .typeText(firstPasswordField,randomCharsForEmail)
        .typeText(confirmPasswordField,randomCharsForPasswords)
        .click(createAccountButton)
        .expect(responseFromLoginSection.innerText).eql("Passwords do not match")
})


test('Assert mismatched password not long enough',async t => {
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const N = 6
    const randomCharsForEmail = Array(N).join().split(',').map(function() { return alph.charAt(Math.floor(Math.random() * alph.length)); }).join('');
    const randomCharsForPasswords = Array(N).join().split(',').map(function() { return alph.charAt(Math.floor(Math.random() * alph.length)); }).join('');

    await t
        .maximizeWindow()
        .click(loginToggle)
        .click(newAccountBtn)
        .typeText(emailField, randomCharsForEmail + "@gmail.com")
        .typeText(firstPasswordField,randomCharsForEmail)
        .typeText(confirmPasswordField,randomCharsForPasswords)
        .click(createAccountButton)
        .expect(responseFromLoginSection.innerText).eql("Password is not long enough")
})


test('Assert past chats response when not logged int',async t => {
    await t
        .maximizeWindow()
        .click(pastChatsP)
        .expect(pastChatsUl.child(0).innerText).eql("You are not logged in")
})


