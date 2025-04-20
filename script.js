const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies";

const dropdowns = document.querySelectorAll("select"); // Select both dropdowns
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

dropdowns.forEach((select) => {
    select.innerHTML = ""; // Clear existing options

    for (let currency in countryList) {
        let option = document.createElement("option");
        option.value = currency;
        option.innerText = currency;
        select.appendChild(option);
    }
});

document.getElementById("fromCurrency").value = "USD";
document.getElementById("toCurrency").value = "INR";

document.getElementById("fromCurrency").addEventListener("change", function () {
    document.getElementById("fromFlag").src = `https://flagsapi.com/${countryList[this.value]}/flat/64.png`;
});

document.getElementById("toCurrency").addEventListener("change", function () {
    document.getElementById("toFlag").src = `https://flagsapi.com/${countryList[this.value]}/flat/64.png`;
});

btn.addEventListener("click", async (event) => {  
    event.preventDefault(); 

    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value); 
    console.log(amtVal);

    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    async function exchangeMoney(amount, from, to) {
        try {
            console.log(`Converting ${amount} ${from} to ${to}`);
    
            let response = await fetch(`${BASE_URL}/${from.toLowerCase()}.json`);
            
            if (!response.ok) {
                throw new Error("Failed to fetch exchange rates");
            }
    
            let data = await response.json();
            
            if (!data[from] || !data[from][to]) {
                throw new Error(`Exchange rate for ${from} to ${to} not found`);
            }
    
            let rate = data[from][to];
            return amount * rate;
        } catch (error) {
            console.error(error.message);
            return null; // Return null in case of an error
        }
    }

    // Call exchangeMoney() and update the UI
    let finalAmount = await exchangeMoney(amtVal, fromCurr.value.toLowerCase(), toCurr.value.toLowerCase());

    if (finalAmount !== null) {
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } else {
        msg.innerText = "Error fetching exchange rate.";
    }
});
