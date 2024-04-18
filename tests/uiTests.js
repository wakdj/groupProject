// testcafe chrome tests/uiTests.js

import { Selector } from 'testcafe';

const textInput = Selector('#textInput');
const enterButton = Selector('#predictButton')
const userMessageSpan = Selector("#userMessage span")

fixture('Getting Started')
    .page('https://moodymusic.pythonanywhere.com/');

test('Asserting value submitted to chatbot is displayed in the correct area', async t => {
    await t
        .typeText(textInput,'hi')
        .click(enterButton)
        .expect(userMessageSpan.innerText).eql("hi")
});