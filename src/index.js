import drivers from './drivers'
import passports from './passports'

// Grab DOM elements
const finishedPopup = document.querySelector('.finished')
const finishedScore = document.querySelector('.finished__score')
const finishedRating = document.querySelector('.finished__rating')
const finishedButton = document.querySelector('.finished__again')
const teamsListEl = document.querySelector('.quiz__teams')
const answersListEl = document.querySelector('.quiz__answers')
const restartButton = document.querySelector('.quiz__restart')
const wrongCountEl = document.querySelector('.quiz__wrong-count')
const correctCountEl = document.querySelector('.quiz__correct-count')

// Wrong and correct counter
let wrongCount 
let correctCount

// Update wrong and correct elements
const updateCounters = () => {
    wrongCountEl.textContent = wrongCount
    correctCountEl.textContent = correctCount
}

// Generate random index nummer to pick a random element from an array
const generateIndex = array => Math.floor(Math.random() * array.length)

// Array with all driver names of passports that already have been asked in the current game. This is to avoid that the same passport will show up twice (or more) in one game, AND to avoid that a driver name whose passport already has been asked in the current game will show up among the possible answers for any of the following questions/passports
let askedPassports = []

// Find a passport for a question
const findPassport = () => {
    const index = generateIndex(passports)
    const driverName = passports[index].driver
    if (askedPassports.includes(driverName)) {
        return findPassport()
    } else {
        askedPassports.push(driverName)
        return passports[index]
    }
}

// Generate a new question
const generateQuestion = () => {
    const passport = findPassport()
    teamsListEl.innerHTML = ''
    generateTeamList(passport.teams)

    const answers = generateAnswers(passport.driver).sort()
    answersListEl.innerHTML = ''
    generateAnswersDOM(answers, passport.driver)
}

// Generate list of teams for question
const generateTeamList = array => {
    array.forEach(item => {
        const li = document.createElement('li')
        li.classList.add('quiz__team')
        li.textContent = item
        teamsListEl.appendChild(li)
    })
}

// Generate 4 possible answers
const generateAnswers = driver => {
    const answers = []
    answers.push(driver)

    while (answers.length < 4) {
        const index = generateIndex(drivers)
        const driverName = drivers[index]
        if (!answers.includes(driverName) && !askedPassports.includes(driverName)) {
            answers.push(driverName)
        }
    }

    return answers
}

// Generate DOM elements for 4 possible answers
const generateAnswersDOM = (array, driver) => {
    array.forEach(item => {
        const li = document.createElement('li')
        li.classList.add('quiz__answer')
        li.textContent = item
        answersListEl.appendChild(li)
        
        li.addEventListener('click', function() {
            if(item === driver) {
                li.style.backgroundColor = '#009900'
                correctCount++
            } else {
                li.style.backgroundColor = '#ff0000'
                wrongCount++
            }
            
            updateCounters()     
            const answersLi = document.querySelectorAll('.quiz__answer')
            answersLi.forEach(answerLi => {
                answerLi.style.pointerEvents = 'none'
                if(answerLi.textContent === driver) {
                    answerLi.style.backgroundColor = '#009900'
                }
            })

            if(correctCount + wrongCount < 10) {
                setTimeout(generateQuestion, 1250)
            } else {
                setTimeout(() => {
                    finishedPopup.style.opacity = '1'
                    finishedPopup.style.visibility = 'visible'

                    finishedScore.textContent = `Score: ${correctCount} goed, ${wrongCount} fout`

                    if (correctCount >= 9) finishedRating.textContent = 'Klasse! De topteams zullen wel voor je in de rij staan!'
                    else if (correctCount >= 7) finishedRating.textContent = 'Goed gedaan! Je hoort zeker thuis in de Formule 1!'
                    else if (correctCount === 6) finishedRating.textContent = 'Voldoende! Maar pas op voor je stoeltje, want de Formule 1 is een competitieve wereld!'
                    else if (correctCount === 5) finishedRating.textContent = 'Oeps! Dit kan wel eens te weinig zijn om je stoeltje te behouden!'
                    else if (correctCount === 4) finishedRating.textContent = 'Hmm, was je wel klaar voor de Formule 1?'
                    else if (correctCount <= 3) finishedRating.textContent = 'Helaas! Dat is ver buiten de 107%-regel!'

                    finishedButton.addEventListener('click', startGame)
                }, 1250)
            }
        })
    })
}

// Start the game
const startGame = () => {
    finishedPopup.style.opacity = '0'
    finishedPopup.style.visibility = 'hidden'
    wrongCount = 0
    correctCount = 0
    updateCounters()
    askedPassports = []
    generateQuestion()
}

// Restart Button
restartButton.addEventListener('click', startGame)

startGame()