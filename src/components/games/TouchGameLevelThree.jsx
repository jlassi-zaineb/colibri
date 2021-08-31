import React, { useCallback, useEffect, useRef, useState } from 'react'
import Countdown from 'react-countdown'
import { Button } from 'react-bootstrap'
import '../styles/StyleTouchGame.css'
import { useParams } from 'react-router-dom'


function TouchGameLevelThree() {
  const level = 3
  const params = useParams()
  const reset = () => {
    setSize(0)
    setMousePosition({ x: null, y: null })
    setMouseDown(false)
    setGameOver(false)
    setDcrb({ x: null, y: null })
  }
  const [mouseAction, setMouseAction] = useState({}) //capte le click sur la zone Jaune
  const BLACK_BOARD_SIZE = (window.innerWidth * 1)
  const blackboard = useRef(null)
  const [size, setSize] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: null, y: null })
  const [dcrb, setDcrb] = useState({ x: null, y: null })
  const [mouseDown, setMouseDown] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [timeOutId, setTimeOutId] = useState()

  const startAutomatically = useCallback(() => {
    if (!timeOutId) {
      const newTimeOutId = setTimeout(reset, 5000)
      setTimeOutId(newTimeOutId)
    }
  }, [setTimeOutId, reset, timeOutId])

  const endGame = useCallback(() => {
    console.log("GAME OVER")
    setGameOver(true)
    startAutomatically()
  }, [setGameOver, startAutomatically])

  const stopStartAutomatically = useCallback(() => {
    clearTimeout(timeOutId);
  }, [timeOutId, clearTimeout])

  // const buttonStopTimeout = useCallback(() => {
  //   reset()
  //   stopStartAutomatically()
  // }, [reset, stopStartAutomatically])

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

  const log = useCallback((status, duration) => {
    console.log(status)
    const url = (`/api/history?student=${params.id}`)
    fetch(url,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          student: params.id,
          duration, status, level
        })
      })
      .catch(err => console.log(err))
  }, [params])


  const logMouseUp = useCallback((event) => {
    setMouseDown(false)
    const zone = event.target.getAttribute('id')
    const time = Date.now()
    const duration = Math.abs(time - mouseAction.time);

    console.log(zone, gameOver)
    switch (zone) {

      case "black":
        if (mouseAction.size === 0) {
          if (gameOver) {
            log('SUCCESS', duration

            )
          } else {
            log('PARTIAL', duration)
          }

        } else {
          log('FAILED', duration)
        }
        break;

      case "blue":
        if (gameOver === false) {
          log('PARTIAL', duration)
        } else {
          log('SUCCESS', duration)
        }
        break;

      case "yellow":
        log('FAILED', duration)
        break;

      default: console.log("cas non géré !!")
        break;
    }

  }, [mouseAction, log, gameOver])


  const logMouseDown = useCallback((event) => {
    console.log("down")
    console.info(event.target.getAttribute('id'))
    setMouseAction({
      zone: event.target.getAttribute('id'),
      time: Date.now(),
      size
    })

  }, [setMouseAction, size])

  return (
    <>
      <div className="yellow-board"
        onMouseUp={logMouseUp}
        onMouseDown={logMouseDown}

        id="yellow">
        <div
          className="black-board"
          onMouseDown={initDot}
          ref={blackboard}
          style={{ width: BLACK_BOARD_SIZE }}
          id="black"
        >
          <div
            className="dot"
            onMouseDown={() => { setMouseDown(true) }}
            style={{
              top: mousePosition.y - size / 2,
              left: mousePosition.x - size / 2,
              width: size,
              height: size,
            }}
            id="blue">
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
        <Countdown date={Date.now() + 5000} renderer={countdownRenderer} />
      </>}
    </>
  )
}

export default TouchGameLevelThree