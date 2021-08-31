import React, { useCallback, useEffect, useRef, useState } from 'react'
import Countdown from 'react-countdown'
import { Button } from 'react-bootstrap'
import '../styles/StyleTouchGame.css'

function TouchGameLevelOne () {

  const biggerScreenSide = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight
  const BLACK_BOARD_SIZE = biggerScreenSide * 1.19
  const blackboard = useRef(null)
  const [size, setSize] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: null, y: null })
  const [dcrb, setDcrb] = useState({ x: null, y: null })
  const [mouseDown, setMouseDown] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const reset = useCallback(() => {
    setSize(0)
    setMousePosition({ x: null, y: null })
    setMouseDown(false)
    setGameOver(false)
  }, [setSize, setMousePosition, setMouseDown, setGameOver])

  const endGame = useCallback(() => {
    setGameOver(true)
  }, [setGameOver])

  const getDotBigger = useCallback(() => {
    const documentCenterX = window.innerWidth / 2
    const documentCenterY = window.innerHeight / 2
    const b = blackboard.current.getBoundingClientRect()
    const documentCenterXreferentialBackboad = documentCenterX - b.x
    const documentCenterYreferentialBackboad = documentCenterY - b.y
    setDcrb({ x: documentCenterXreferentialBackboad, y: documentCenterYreferentialBackboad })
    const calculX = documentCenterXreferentialBackboad - mousePosition.x
    const calculY = documentCenterYreferentialBackboad - mousePosition.y
    const distance = Math.sqrt((calculX * calculX) + (calculY * calculY))
    const rayonMax = distance + BLACK_BOARD_SIZE / 2
    setSize(size + 80)

    if (size > rayonMax * 2) {
      endGame()
    }
  }, [setSize, size, endGame, mousePosition, BLACK_BOARD_SIZE])

  const initDot = useCallback((event) => {
    if (mousePosition.x === null) {
      const b = blackboard.current.getBoundingClientRect()
      setMousePosition({
        x: event.clientX - b.x,
        y: event.clientY - b.y,
      })
      getDotBigger()
      setMouseDown(true)
    }
  }, [mousePosition, setMousePosition, getDotBigger, setMouseDown])

  useEffect(() => {
    const interval = setInterval(() => {
      if (mouseDown) {
        getDotBigger()
      }
    }, 300)
    return () => clearInterval(interval)
  }, [mouseDown, getDotBigger])

  const countdownRenderer = useCallback(({ hours, minutes, seconds, completed }) => {
    if (completed) {
      reset()
      return null
    } else {
      return <div className="countdown">{seconds} secondes</div>
    }
  }, [reset])

  const logEvent = useCallback((event) => {
    console.info(event.target.getAttribute('id'))
  }, [])

  return (
    <>
      <div className="yellow-board"
           onMouseUp={() => setMouseDown(false)}
           onMouseDown={logEvent}
           id="yellow"
      >
        <div
          className="black-board"
          onMouseDown={initDot}
          ref={blackboard}
          style={{ width: BLACK_BOARD_SIZE }}
          id="black"
        >
          <div
            className="dot"
            id="blue"
            onMouseDown={() => { setMouseDown(true) }}
            style={{
              top: mousePosition.y - size / 2,
              left: mousePosition.x - size / 2,
              width: size,
              height: size,
            }}>
          </div>
        </div>
      </div>
      {gameOver && <>
        <Button
          id="restartbtn"
          variant="outline-light"
          size="sm"
          type="button"
          onClick={reset}
        >
          Redémarrer
        </Button>
        <Countdown date={Date.now() + 5000} renderer={countdownRenderer}/>
      </>}

    </>
  )
}

export default TouchGameLevelOne