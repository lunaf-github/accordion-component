import {fireEvent, getByTestId} from "@testing-library/dom"
import { dirname } from 'path';
import "@testing-library/jest-dom"
import {JSDOM} from "jsdom"
import path from "path"
import { fileURLToPath } from "url";

/* 
ES6 Modules do not have __filename and __dirname variables. They are only available 
in CommonJS modules. So I found this work around to create my own dirname using the 
path module and url module
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE = path.resolve(__dirname, "./src")

/* 
make the DOM and body element globally available. That way, I can use the beforeEach hook
to reset the DOM before each test
*/
let dom, body;

const mockLocalStorage = function() {
    let store = {};

    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        removeItem(key) {
            delete store[key];
        },
        clear() {
            store = {};
        }
    }
};

describe("accordion test", function () {
    beforeEach(async () => {
        // The fromFile static method returns a promise, make sure to use async-await
        dom = await JSDOM.fromFile(path.join(BASE, '/index.html'), {

            // allow the use of scripts
            runScripts: "dangerously",

            // Alows the use exteran resources such ase <script src="url/"></script>
            resources: "usable",

            // This allows JSDOM to simulate rendering the DOM
            pretendToBeVisual: true,

        })
        /* 
        Because we are running our tests outside the browser, we need to mock up our
        own localStorage. It seems that the current localStorage property is not available
        for us to use. So we need to overwrite that property with our own. But, the problem 
        is that this property is read-only. So, we need to use the Object.defineProperty to
        bypass this restriction. Make sure to add the local storage before the javascript 
        is loaded because you want to make sure the localStorage is availabe beforehand. If
        it is not available, you will get the 
        [SecurityError: localStorage is not available for opaque origins] error
        */

       Object.defineProperty(dom.window, 'localStorage', {
           value: mockLocalStorage(),
        });
        
        // Make sure my scripts and other resources are parsed before I start testing
        await loadDom(dom);

        // makes it easier to grab the body DOM object
        body = dom.window.document.body;
    })

    it('shows the 1st item description expanded by default', async function () {
        /*
            getByTestingId is an API from @testing-library/dom. The developers of the library
            what us to develop tests in the perspective the the user. So, this means that 
            it is best to grab elements based on the text contents such as labels - what 
            the user looks for when interacting with the UI. However, there are cases that
            it is not possible to add labels or texts, so we can create testId data attributes
            and use that to test dom elements. The getByTestId serves as an excape hatch, and 
            allows us to grab dom elements best of the testId data attributes. 
        */
        const accordion1 = getByTestId(body, '1')
        const description1 = accordion1.querySelector('.description')

        /* 
            To be visible is an API from @testing-library/jest-dom which extends the jest library
            by adding more assertions such as toBeVisible and toHaveTextContent.
        */
        expect(description1).toBeVisible()

        const ids = ['2', '3', '4', '5']
        for (const id of ids) {
            const accordion = getByTestId(body, id)
            const description = accordion.querySelector('.description')
            expect(description).not.toBeVisible()
        }
    })

    it('expands the item description when clicking on a title of collapsed element', async function () {
        const ids = ['2', '3', '4', '5']

        for (const id of ids) {
            const accordion = getByTestId(body, id)
            const title = accordion.querySelector('.title')
            let description = accordion.querySelector('.description')
            expect(description).not.toBeVisible()

            await fireEvent.click(title)

            description = accordion.querySelector('.description')
            expect(description).toBeVisible()
        }
    })

    it('shows expand icon when item is collapsed', async function () {

        const accordion = getByTestId(body, '1')
        const titleSection = accordion.querySelector('.title-section')
        const title = titleSection.querySelector('.title')
        let collapseIcon = titleSection.querySelector('.collapse-icon')
        let expandIcon = titleSection.querySelector('.expand-icon')

        expect(collapseIcon).toBeVisible()
        expect(expandIcon).not.toBeVisible()

        await fireEvent.click(title)

        collapseIcon = titleSection.querySelector('.collapse-icon')
        expandIcon = titleSection.querySelector('.expand-icon')

        expect(collapseIcon).not.toBeVisible()
        expect(expandIcon).toBeVisible()
    })

    it('shows collapse icon when item is expanded', async function () {

        const ids = ['2', '3', '4', '5']

        for (const id of ids) {
            const accordion = getByTestId(body, id)
            const titleSection = accordion.querySelector('.title-section')
            const title = titleSection.querySelector('.title')
            let collapseIcon = titleSection.querySelector('.collapse-icon')
            let expandIcon = titleSection.querySelector('.expand-icon')

            expect(collapseIcon).not.toBeVisible()
            expect(expandIcon).toBeVisible()

            await fireEvent.click(title)

            collapseIcon = titleSection.querySelector('.collapse-icon')
            expandIcon = titleSection.querySelector('.expand-icon')

            expect(collapseIcon).toBeVisible()
            expect(expandIcon).not.toBeVisible()
        }
    })

    it('collapses the item description when clicking on title of expanded item', async function () {

        const accordion = getByTestId(body, '1')
        const title = accordion.querySelector('.title')

        let description = accordion.querySelector('.description')
        expect(description).toBeVisible()

        await fireEvent.click(title)

        description = accordion.querySelector('.description')
        expect(description).not.toBeVisible()
    })

    it('collapses all expanded elements when expanding an another item', async function () {

        const accordion1 = getByTestId(body, '1')

        let description1 = accordion1.querySelector('.description')
        expect(description1).toBeVisible()

        const accordion2 = getByTestId(body, '2')
        const title2 = accordion2.querySelector('.title')

        let description2 = accordion2.querySelector('.description')
        expect(description2).not.toBeVisible()

        await fireEvent.click(title2)

        description1 = accordion1.querySelector('.description')
        description2 = accordion2.querySelector('.description')

        expect(description2).toBeVisible()
        expect(description1).not.toBeVisible()
    })

    it('expands more than one item if multi-select is enabled', async function() {

        const multiSelect = getByTestId(body, 'multiselect')
        const accordion1 = getByTestId(body, '1')

        let description1 = accordion1.querySelector('.description')
        expect(description1).toBeVisible()

        fireEvent.click(multiSelect)

        const accordion2 = getByTestId(body, '2')
        const accordion3 = getByTestId(body, '3')
        const title2 = accordion2.querySelector('.title')
        const title3 = accordion3.querySelector('.title')

        let description2 = accordion2.querySelector('.description')
        let description3 = accordion2.querySelector('.description')
        expect(description2).not.toBeVisible()
        expect(description3).not.toBeVisible()

        await fireEvent.click(title2)
        await fireEvent.click(title3)

        description1 = accordion1.querySelector('.description')
        description2 = accordion2.querySelector('.description')
        description3 = accordion3.querySelector('.description')

        expect(description1).toBeVisible()
        expect(description2).toBeVisible()
        expect(description3).toBeVisible()
    });

    it('collapses all other items when expanding an item after multi-select has beem disabled', async function() {

        const multiSelect = getByTestId(body, 'multiselect')
        const accordion1 = getByTestId(body, '1')

        let description1 = accordion1.querySelector('.description')
        expect(description1).toBeVisible()

        fireEvent.click(multiSelect)

        const accordion2 = getByTestId(body, '2')
        const accordion3 = getByTestId(body, '3')
        const title2 = accordion2.querySelector('.title')
        const title3 = accordion3.querySelector('.title')

        let description2 = accordion2.querySelector('.description')
        let description3 = accordion2.querySelector('.description')
        expect(description2).not.toBeVisible()
        expect(description3).not.toBeVisible()

        await fireEvent.click(title2)
        await fireEvent.click(title3)

        description1 = accordion1.querySelector('.description')
        description2 = accordion2.querySelector('.description')
        description3 = accordion3.querySelector('.description')

        expect(description1).toBeVisible()
        expect(description2).toBeVisible()
        expect(description3).toBeVisible()

        fireEvent.click(multiSelect)

        const accordion4 = getByTestId(body, '4')
        const title4 = accordion4.querySelector('.title')
        let description4 = accordion4.querySelector('.description')

        expect(description4).not.toBeVisible()
        fireEvent.click(title4)

        description1 = accordion1.querySelector('.description')
        description2 = accordion2.querySelector('.description')
        description3 = accordion3.querySelector('.description')
        description4 = accordion4.querySelector('.description')

        expect(description1).not.toBeVisible()
        expect(description2).not.toBeVisible()
        expect(description3).not.toBeVisible()
        expect(description4).toBeVisible()
    });
})

function loadDom(dom) {
    return new Promise((resolve, _) => {
        dom.window.addEventListener("DOMContentLoaded", () => {
            console.log("DOM Loaded");
            resolve(dom);
        });
    });
}