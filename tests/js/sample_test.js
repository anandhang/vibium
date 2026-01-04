const { test, describe } = require('node:test');
const assert = require('node:assert');
const { browserSync } = require('../../clients/javascript/dist');

describe('Sample Test', () => {
    test('Navigate to example.com', () => {
        console.log('Launching browser...');
        const vibe = browserSync.launch({ headless: true });
        try {
            console.log('Navigating to example.com...');
            vibe.go('https://example.com');
            console.log('Evaluating title...');
            const title = vibe.evaluate('return document.title');
            console.log('Title:', title);
            assert.ok(title.includes('Example Domain'), 'Title should match');
        } finally {
            console.log('Quitting browser...');
            vibe.quit();
        }
    });
});
