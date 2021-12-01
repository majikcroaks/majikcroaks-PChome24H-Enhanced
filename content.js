console.log("Enhancing PChome.");

// PChome's default class name for hiding elements.
let keyword = "unblock";

// Create text inputs.
let priceFrom = document.createElement("input");
// Set attributes.
priceFrom.setAttribute("type", "text");
priceFrom.setAttribute("placeholder", "From");
priceFrom.setAttribute("id", "priceFrom");
// Create text inputs.
let priceTo = document.createElement("input");
// Set attributes.
priceTo.setAttribute("type", "text");
priceTo.setAttribute("placeholder", "To");
priceTo.setAttribute("id", "priceTo");
// Select #CmContainer.
let nodeToInject = document.querySelector("#CmContainer");
// Prepend inputs into #CmContainer
nodeToInject.prepend(priceTo);
nodeToInject.prepend(priceFrom);
// Store inputs.
let priceInputs = nodeToInject.querySelectorAll("input[id^='price']");

// Get the DOM needed.
let listView = document.getElementById("ProdListContainer");
let gridView = document.getElementById("ProdGridContainer");

// Get price bound.
let priceFromVal = parseInt(document.getElementById("priceFrom").value);
let priceToVal = parseInt(document.getElementById("priceTo").value);

// Debounce function.
const debounce = (fn, delay = 1000) => {
    //  Declare a timer.
    let timer;
    // Returns a function and takes the argument to be executed.
    return function (...args) {
        // Clears the timeout if exists.
        clearTimeout(timer);
        // The function passed in will be executed in "delay" ms.
        timer = setTimeout(() => fn(...args), delay);
    };
};

// Price filter function.
const priceFilter = function (eventTarget) {
    console.log(eventTarget);
    // Get the prices of listed items.
    let itemPrices = listView.querySelectorAll(
        `li:not([class=${keyword}]) > .price > .value`
    );
    // Clean the previous result if any.
    let result;
    if (result) {
        let items = listView.querySelectorAll(".col3f");
        items.forEach((item) => item.classList.remove(keyword));
        console.log("Cleaned!");
        result = false; // Set to false after clean.
    }
    // Get value of price bound.
    let priceFromVal = parseInt(document.getElementById("priceFrom").value);
    let priceToVal = parseInt(document.getElementById("priceTo").value);
    console.log(`From ${priceFromVal} to ${priceToVal}.`);
    // Iterate through item prices.
    itemPrices.forEach((itemPrice) => {
        // Parse price value of item.
        let itemPriceVal = parseInt(itemPrice.innerText);
        if (itemPriceVal < priceFromVal) {
            // If price is smaller than lower bound.
            console.log(`Remove those price is under ${priceFromVal}`);
            itemPrice.closest(".col3f").classList.add(keyword); // Hide item that is the parent node of price.
        } else if (itemPriceVal > priceToVal) {
            // If price is greater than upper bound.
            console.log(`Remove those price is above ${priceToVal}`);
            itemPrice.closest(".col3f").classList.add(keyword); // Hide item that is the parent node of price.
        }
    });
    result = true; // Set to true after hiding elements.
};

// Config the mutation type to be observed.
const config = {
    attributes: true,
    attributeFilter: ["class"],
};
// Set what to do when a change is observed.
const filterItems = (theNode, observers) => {
    for (const mutation of theNode) {
        if (mutation.target.classList.contains(keyword)) {
            return;
        }
        debounce(priceFilter(mutation.target));
    }
};
// Declare an instance of MutationObserver.
const observer = new MutationObserver(filterItems);
// Passing the target and config into the observer.
observer.observe(listView, config);

// Event listener for the input.
// callback debounce(function, delay) and pass in a function to be executed in delayed time.
priceInputs.forEach((priceInput) => {
    priceInput.addEventListener(
        "keyup",
        debounce((event) => {
            priceFilter(event.target);
        })
    );
});

// Force list view.
let checkReadyState = setInterval(function () {
    let readyState = document.readyState;
    if (readyState == "complete") {
        document
            .querySelector(
                "#StyleContainer > dd > ul > li.list > label > input[type=radio]"
            )
            .click();
        clearInterval(checkReadyState);
    }
}, 0);
