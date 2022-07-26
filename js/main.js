import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getColorElementList,
  getColorListElement,
  getColorListInactiveElement,
  getPlayAgainButton,
} from './selectors.js'
import {
  createTimer,
  getRandomColorPairs,
  hidePlayAgainButton,
  setTimerText,
  showPlayAgainButton,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
const timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleSecondChange,
  onFinish: handleSecondFinish,
})

function handleSecondChange(second) {
  setTimerText(second)
}

function handleSecondFinish() {
  setTimerText('YOU LOSE!')
  gameStatus = GAME_STATUS.FINISHED
  showPlayAgainButton()
}

function initColorElement() {
  // get 8 color pairs
  const colorPairs = getRandomColorPairs(PAIRS_COUNT)

  // add color to overlay class
  const colorElementList = getColorElementList()

  colorElementList.forEach((liColorELement, idx) => {
    const overlayElement = liColorELement.querySelector('.overlay')
    liColorELement.dataset.color = colorPairs[idx]
    overlayElement.style.backgroundColor = colorPairs[idx]
  })
}

function checkWin() {
  //check all element is selected
  const liInactiveElementList = getColorListInactiveElement()
  return liInactiveElementList.length === 0
}

function handleClickLiColorElement(liElement) {
  const shoudlBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const isClicked = liElement.classList.contains('active')

  if (!liElement || isClicked || shoudlBlockClick) return

  liElement.classList.add('active')
  selections.push(liElement)

  if (selections.length < 2) return

  const isMatch = selections[0].dataset.color === selections[1].dataset.color

  if (isMatch) {
    const isWin = checkWin()

    if (isWin) {
      gameStatus = GAME_STATUS.FINISHED
      //show replay
      showPlayAgainButton()
      //show you win
      setTimerText('YOU WIN!')
      //clear count down
      timer.clear()
    }
    selections = []
    return
  }

  gameStatus = GAME_STATUS.BLOCKING //needToWaitForResetList
  // not match
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    selections = []
    console.log(gameStatus)
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)
}

function attachEventForColorList() {
  // get ul tag of color list

  const ulColorElement = getColorListElement()

  if (!ulColorElement) return

  ulColorElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return // just add active in li tag not add active in overlay

    handleClickLiColorElement(event.target)
  })
}

function handleClickLReplayButton() {
  resetGame('')
  startTimer()
}

function attachEventForReplayButton() {
  const playAgainButton = getPlayAgainButton()

  if (!playAgainButton) return

  playAgainButton.addEventListener('click', () => {
    handleClickLReplayButton()
  })
}

function resetGame(text) {
  selections = []
  gameStatus = GAME_STATUS.PLAYING

  const colorElementList = getColorElementList()

  colorElementList.forEach((liColorELement) => {
    liColorELement.classList.remove('active')
  })

  initColorElement()
  hidePlayAgainButton()
  setTimerText(text)
}

function startTimer() {
  timer.start()
}

;(() => {
  initColorElement()
  attachEventForColorList()
  attachEventForReplayButton()
  startTimer()
})()

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click
