// testcafe chrome/firefox/edge tests/accountTests.js
// if any tests fail add :headless after the browser as this is more efficient.
// i have done for all tests as my laptop is rubbish
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
const logoutButton = Selector('#logout')
const chillChat = Selector('#sideBarContainer li').withText('chillX')
//const login = Selector('#saveButton')
//const newChatLI = Selector('#sideBarContainer li').withText('New Chat')
const saveChat = Selector('#sideBarContainer li').withText('save chat testX')
const deleteChatButton = Selector('#sideBarContainer button').withText("X")


const alph = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let testEmail = Array(10).join().split(',').map(function() { return alph.charAt(Math.floor(Math.random() * alph.length)); }).join('');

const url = 'https://moodymusic.pythonanywhere.com/'

// async refresh () {
//     await ClientFunction(() => {
//       document.location.reload();
//     })();
//   }
fixture('UI Account Tests')
    .page(url);

test("Create Account post state validation",async t =>{
    // deletion combined into this test as i dont want 
    // loads of accounts being created.
    const N = 6
    const randomCharsForEmail = Array(N).join().split(',').map(function() { return alph.charAt(Math.floor(Math.random() * alph.length)); }).join('');
    await t
        .maximizeWindow()
        .click(loginToggle)
        .click(newAccountBtn)
        .typeText(emailField, testEmail + "@gmail.com")
        //.debug()
        .typeText(firstPasswordField,"wjefnwjkefnwjfew")
        .typeText(confirmPasswordField,"wjefnwjkefnwjfew")
        .click(createAccountButton)
        .click(pastChatsP)
        .expect(pastChatsUl.child(0).innerText).eql("New Chat")
        .expect(loginToggle.filterVisible().exists).notOk()
        .expect(deleteAccountButton.filterVisible().exists).ok()
        .expect(saveButton.filterVisible().exists).ok()
        
       // .setNativeDialogHandler(() => true) 
        // .click(deleteAccountButton)
        // .expect(saveButton.filterVisible().exists).notOk()
})      

test('Test Login and Logout', async t => {
    // done as firefox does not logout the users 
    // when a new test starts whereas as chrome does
    await t
        .wait(1000)
    if(await logoutButton.filterVisible().exists){
        await t 
            .click(logoutButton)
            .wait(1000)
    }
    await t
    .maximizeWindow()
    .click(loginToggle)
    .typeText(emailField, testEmail + "@gmail.com")
    .typeText(firstPasswordField,"wjefnwjkefnwjfew")
    //.wait(500)
    .click(loginButton)
    //.click(loginButton)
    .wait(500)
    await t.eval(() => location.reload(true))
    await t 
    .expect(loginToggle.filterVisible().exists).notOk()
   .expect(deleteAccountButton.filterVisible().exists).ok()
    .expect(saveButton.exists).ok()
    .click(logoutButton)
    .expect(loginToggle.exists).ok()
    .expect(deleteAccountButton.filterVisible().exists).notOk()
    .expect(saveButton.exists).notOk()
})


let savedChatResponse = ""
test('Test saving chat', async t =>{
    // https://testcafe.io/documentation/402684/reference/test-api/testcontroller/setnativedialoghandler
    const wordToType = "hi"
    await t
    .wait(1000)
    if(await logoutButton.filterVisible().exists){
        await t 
            .click(logoutButton)
            .wait(1000)
    }
    await t
        .maximizeWindow()
        .click(loginToggle)
        .typeText(emailField, testEmail + "@gmail.com")
        .typeText(firstPasswordField,"wjefnwjkefnwjfew")
        .click(loginButton)
        .expect(loginToggle.filterVisible().exists).notOk()
        .expect(deleteAccountButton.filterVisible().exists).ok()
        .expect(saveButton.filterVisible().exists).ok()
        .wait(5000)
        .typeText(textInput,wordToType)
        .click(enterButton)
        .setNativeDialogHandler((type, text) => {
            switch (type) {
            case 'prompt':
                return "save chat test";
            default:
                throw 'An alert was invoked!';
            }})
            savedChatResponse = await chatBotResponseSpan.innerText;  
    await t
        .click(saveButton)
       
    // await t
    //     .click(pastChatsP)
    //     .click(chillChat)
    //     //.expect()
    //     .expect(chatBotResponseSpan.child(0).innerText).eql("Nice! I've got a few chill options below for you.")
})

// the test above needs to run before. 
test("reloading a chat", async t =>{
    await t
    .wait(1000)
    if(await logoutButton.filterVisible().exists){
        await t 
            .click(logoutButton)
            .wait(1000)
    }
    //const potentialResponses = getResponses("hi")
    await t
        .maximizeWindow()
        .click(loginToggle)
        .typeText(emailField, testEmail + "@gmail.com")
        .typeText(firstPasswordField,"wjefnwjkefnwjfew")
        .click(loginButton)
        //.click(loginButton)
        .wait(5000)
        .click(pastChatsP)
        .click(pastChatsUl.child(1))
        .wait(500)
        .expect(userMessageSpan.innerText).eql("hi")
        .expect(chatBotResponseSpan.innerText).eql(savedChatResponse)
    
} )

test("Deleting a chat", async t =>{
    await t
    .wait(1000)
    if(await logoutButton.filterVisible().exists){
        await t 
            .click(logoutButton)
            .wait(1000)
    }
    await t
        .maximizeWindow()
        .click(loginToggle)
        .typeText(emailField, testEmail + "@gmail.com")
        .typeText(firstPasswordField,"wjefnwjkefnwjfew")
        .click(loginButton)
        .wait(1000)
        .click(pastChatsP)
        .click(pastChatsUl.child(1))
        .setNativeDialogHandler(() => true) 
        .click(deleteChatButton)
    await t.eval(() => location.reload(true))
    await t.expect(pastChatsUl.child(1).exists).notOk()
         
} )


test("Deleting account", async t =>{
    await t
    .wait(1000)
    if(await logoutButton.filterVisible().exists){
        await t 
            .click(logoutButton)
            .wait(1000)
    }
    await t
        .maximizeWindow()
        .click(loginToggle)
        .typeText(emailField, testEmail + "@gmail.com")
        .typeText(firstPasswordField,"wjefnwjkefnwjfew")
        .click(loginButton)
        .wait(1000)
        .setNativeDialogHandler(() => true) 
        .click(deleteAccountButton)
    await t.eval(() => location.reload(true))
    await t 
    .click(loginToggle)
    .typeText(emailField, testEmail + "@gmail.com")
    .typeText(firstPasswordField,"wjefnwjkefnwjfew")
    .click(loginButton)
    .expect(responseFromLoginSection.innerText).eql("Firebase: Error (auth/invalid-credential).")        
} )