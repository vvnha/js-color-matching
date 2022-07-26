import { getPlayAgainButton, getTimerElement } from './selectors.js'

function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length < 3) return arr

  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i)

    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

  return arr
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList = []
  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome']

  for (let i = 0; i < count; i++) {
    const color = randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    })
    colorList.push(color)
  }

  const fullColorList = [...colorList, ...colorList]

  shuffle(fullColorList)

  return fullColorList
}

export function showPlayAgainButton() {
  const replayButton = getPlayAgainButton()

  if (!replayButton) return

  replayButton.classList.add('show')
}

export function hidePlayAgainButton() {
  const replayButton = getPlayAgainButton()

  if (!replayButton) return

  replayButton.classList.remove('show')
}

export function setTimerText(text) {
  const timerTextElement = getTimerElement()

  if (!timerTextElement) return

  timerTextElement.textContent = text
}

export function createTimer({ seconds, onChange, onFinish }) {
  let timer

  function start() {
    clear()

    let currenSecond = seconds
    timer = setInterval(() => {
      onChange?.(currenSecond)
      currenSecond--

      if (currenSecond < 0) {
        clear()
        onFinish?.()
      }
    }, 1000)
  }

  function clear() {
    clearInterval(timer)
  }

  return {
    start,
    clear,
  }
}
