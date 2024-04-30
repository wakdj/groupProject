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
const loginButton = Selector('#submitLogin')
const deleteAccountButton = Selector('#deleteAccount')
const saveButton = Selector('#saveButton')
//const newChatLI = Selector('#sideBarContainer li').withText('New Chat')

const alph = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const url = 'https://moodymusic.pythonanywhere.com/'
fixture('UI Tests')
    .page(url);

    function getResponses(emotion){
        let potentialResponses = []
        switch (emotion){
            case "greeting":
                potentialResponses = [
                    "Hey :-)",
                    "Hello, thanks for visiting",
                    "Hi there, what can I do for you?",
                    "Hi there, how can I help?"
                  ]
                break;
            case "goodbye":
                potentialResponses = ["See you later, thanks for visiting",
                "Have a nice day"]
                break;
            case "thanks":
                potentialResponses = ["Happy to help!", "Any time!", "My pleasure"]
                break;
            case "happy":
                potentialResponses = [
                    "That's super. Pick an option from below and I'll find you a song",
                    "I've got a few songs in mind. Please pick one of the options, and I'll do all the work."
                  ]
                  break;
                case "sad":
                    potentialResponses = [
                        "Oh diddums, here's a few options for you to pick from.",
                        "If you're not feeling so great, please pick one of the options below and I'll recommend a song for you."
                      ]
                      break;
                case "relaxed":
                    potentialResponses = [
                        "Nice! I've got a few chill options below for you."
                      ]
                    break;
                case "energetic":
                    potentialResponses = [
                        "I've got a few options that you'll like",
                        "PICK ONE OF THE OPTIONS BELOW!"
                      ]
                    break;
                case "funnny":
                    potentialResponses = [
                        "Why did the hipster burn his mouth? He drank the coffee before it was cool.",
                        "What did the buffalo say when his son left for college? Bison."
                      ]

        }
        return potentialResponses
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


test('Asserting response (greeting)', async t => {
    const potentialResponses = getResponses("greeting")
    const wordToType = "hi"
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

test('Asserting response (goodbye)', async t => {
    const potentialResponses = getResponses("goodbye")
    const wordToType = "bye"
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

test('Asserting response (sad)', async t => {
    const potentialResponses = getResponses("sad")
    const wordToType = "gimme a sad song"
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

test('Asserting response (happy)', async t => {
    const potentialResponses = getResponses("happy")
    const wordToType = "i feel great"
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


test('Asserting response (relaxed)', async t => {
    const potentialResponses = getResponses("relaxed")
    const wordToType = "i am chill"
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

test('Asserting response (energetic)', async t => {
    const potentialResponses = getResponses("energetic")
    const wordToType = "i am pumped up"
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

test('Invalid credentails', async t=>{
    const N = 10
    const randomCharsForEmail = Array(N).join().split(',').map(function() { return alph.charAt(Math.floor(Math.random() * alph.length)); }).join('');
    const randomCharsForPasswords = Array(N).join().split(',').map(function() { return alph.charAt(Math.floor(Math.random() * alph.length)); }).join('');
    await t
        .maximizeWindow()
        .click(loginToggle)
        .typeText(emailField, randomCharsForEmail + "@gmail.com")
        .typeText(firstPasswordField,randomCharsForEmail)
        .click(loginButton)
        .expect(responseFromLoginSection.innerText).eql("Firebase: Error (auth/invalid-credential).")

})

test.only("Create Account post state + deletion",async t =>{
    // deletion combined into this test as i dont want 
    // loads of accounts being created.
    const N = 6
    const randomCharsForEmail = Array(N).join().split(',').map(function() { return alph.charAt(Math.floor(Math.random() * alph.length)); }).join('');
    await t
        .maximizeWindow()
        .click(loginToggle)
        .click(newAccountBtn)
        .typeText(emailField, randomCharsForEmail + "@gmail.com")
        .debug()
        .typeText(firstPasswordField,"test_test")
        .typeText(confirmPasswordField,"test_test")
        .click(createAccountButton)
        .expect(loginToggle.filterVisible().exists).notOk()
        .expect(deleteAccountButton.filterVisible().exists).ok()
        .expect(saveButton.filterVisible().exists).ok()
        .click(pastChatsP)
        .expect(pastChatsUl.child(0).innerText).eql("New Chat")
        .setNativeDialogHandler(() => true) 
        .click(deleteAccountButton)
        .expect(saveButton.filterVisible().exists).notOk()
})      
