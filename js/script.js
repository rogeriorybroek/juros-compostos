const form = document.querySelector('.form')
const spanMonthOrYear = document.querySelector('#spanMonthOrYear')
const spinner = document.querySelector('.spinner')

form.onsubmit = validacaoForm

async function validacaoForm(event) {
    //validation
    event.preventDefault()

    let temErro = false

    const validation = /[^\d,]+/g

    const inputName = document.forms['form']['name']
    if(!inputName.value) {
        temErro = true
        const span = inputName.nextSibling.nextSibling
        span.innerText = 'Digite o nome corretamente'
    } else {
        const span = inputName.nextSibling.nextSibling
        span.innerText = ''
    }

    const inputAmount = document.forms['form']['amount']
    const amountToNumber = parseFloat(inputAmount.value.replace(',', '.'))
    if(!inputAmount.value || inputAmount.value.match(validation)) {
        temErro = true
        const span = inputAmount.nextSibling.nextSibling
        span.innerText = 'Digite o aporte mensal corretamente'
    } else {
        const span = inputAmount.nextSibling.nextSibling
        span.innerText = ''
    }

    const inputTax = document.forms['form']['tax']
    const taxToNumber = parseFloat(inputTax.value.replace(',', '.'))
    if(!inputTax.value || inputTax.value.match(validation)) {
        temErro = true
        const span = inputTax.nextSibling.nextSibling
        span.innerText = 'Digite uma taxa de juros sem o "%"'
    } else {
        const span = inputTax.nextSibling.nextSibling
        span.innerText = ''
    }

    const inputTime = document.forms['form']['time-value']
    if(!inputTime.value) {
        temErro = true
        const span = inputTime.nextSibling.nextSibling
        span.innerText = 'Digite a quantidade de meses ou anos'
    } else {
        const span = inputTime.nextSibling.nextSibling
        span.innerText = ''
    }

    const radio = document.forms['form']['radio']
    if(!radio.value) {
        temErro = true
        spanMonthOrYear.innerText = 'escolha uma opção'
    } else {
        spanMonthOrYear.innerText = ''
    }
    
    if(temErro) {
        return
    }

    const secondPage = document.querySelector('.second-page')
    const firstPage = document.querySelector('.first-page')
    
    firstPage.classList.add('hidden')
    secondPage.classList.remove('hidden')
    spinner.classList.remove('hidden')



    //FETCH API
    const configs = {
        headers: { 
            "content-type": "aplication/json" 
        },
        method: 'POST',
        body: `
        {
            "expr": "${amountToNumber} * (((1 + ${taxToNumber / 100}) ^ ${radio.value === 'year'? (inputTime.value  * 12): inputTime.value} - 1) / ${taxToNumber / 100})"
        }
        `
    }
    
    function transformJson(response) {
        return response.json()
    }


    let monthOrYear 
    if(radio.value === 'month') {
        monthOrYear = 'meses'
    } else {
        monthOrYear = 'anos'
    }

    const resultDisplay = document.querySelector('.result-display')

    
    function constructData(response) {
        const finalResult = response.result

        setTimeout(() => {
            spinner.classList.add('hidden')
            resultDisplay.innerHTML = `
                <h1>
                    Olá ${inputName.value}, investindo R$ ${inputAmount.value} todo mês, você terá R$ ${parseFloat(finalResult).toFixed(2).replace('.', ',')} em ${inputTime.value} ${monthOrYear}
                </h1>
            `
        }, 2000)

        
    }

    function fetchError() {
        console.log('ERROR')
    }

    await fetch('http://api.mathjs.org/v4/', configs)
        .then(transformJson)
        .then(constructData)
        .catch(fetchError)
    
    
}  