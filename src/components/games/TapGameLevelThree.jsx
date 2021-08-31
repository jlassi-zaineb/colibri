import React, { useCallback, useEffect, useRef, useState } from 'react'
import Countdown from 'react-countdown'
import { Button } from 'react-bootstrap'
import '../styles/StyleTouchGame.css'


function TapGameLevelOne() {

  const stageRef = React.createRef()
  const BLACK_BOARD_SIZE = (window.innerWidth * 0.4)
  const blackboard = useRef(null)
  const [size, setSize] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: null, y: null })
  const [dcrb, setDcrb] = useState({ x: null, y: null })
  const [mouseDown, setMouseDown] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [timeOutId, setTimeOutId] = useState()
  const [nbrClick, setNbrClick] = useState(0)

  const reset = () => {
    setSize(0)
    setMousePosition({ x: null, y: null })
    setMouseDown(false)
    setGameOver(false)
    setNbrClick(1)
    setTimeOutId(null)
  }

  const startAutomatically = useCallback(() => {
    if (!timeOutId) {
    const newTimeOutId = setTimeout(reset, 5000)
    setTimeOutId(newTimeOutId)
    }
  }, [setTimeOutId, reset, timeOutId])

  const endGame = useCallback(() => {
    setGameOver(true)
    startAutomatically()
  }, [setGameOver, startAutomatically])

  const stopStartAutomatically = useCallback(() => {
    clearTimeout(timeOutId);
  }, [timeOutId,clearTimeout])

  const buttonStopTimeout = useCallback(() => {
    reset()
    stopStartAutomatically()
  }, [reset, stopStartAutomatically])


  const getDotBigger = useCallback(() => {
    setNbrClick(nbrClick + 1)
    const documentCenterX = window.innerWidth / 2
    const documentCenterY = window.innerHeight / 2
    const board = document.getElementsByClassName('black-board')[0]
    const dimensions = board.getBoundingClientRect()
    const documentCenterXreferentialBackboad = documentCenterX - dimensions.x
    const documentCenterYreferentialBackboad = documentCenterY - dimensions.y
    setDcrb({ x: documentCenterXreferentialBackboad, y: documentCenterYreferentialBackboad })
    const calculX = documentCenterXreferentialBackboad - mousePosition.x
    const calculY = documentCenterYreferentialBackboad - mousePosition.y
    const distance = Math.sqrt((calculX * calculX) + (calculY * calculY))
    const rayonMax = distance + BLACK_BOARD_SIZE / 2
    setSize(BLACK_BOARD_SIZE * nbrClick / 7)

  }, [setSize, size, endGame, mousePosition, BLACK_BOARD_SIZE])

  useEffect(() => {
    const board = document.getElementsByClassName('black-board')[0]
    const dimensions = board.getBoundingClientRect()
    if (size > dimensions.x) {
      endGame()
    }
  }, [size, endGame])

  const initDot = useCallback((event) => {
    if (mousePosition.x === null) {
      const board = document.getElementsByClassName('black-board')[0]
      const dimensions = board.getBoundingClientRect()
      setMousePosition({
        x: event.clientX - dimensions.x,
        y: event.clientY - dimensions.y,
      })
      setMouseDown(true)
    }
    getDotBigger()
  }, [mousePosition, setMousePosition, getDotBigger, setMouseDown])



  return (
    <>
      <div className="yellow-board">
        <div ref={stageRef}
          className="black-board"
          onMouseDown={(e) => { initDot(e) }}
          style={{ width: BLACK_BOARD_SIZE }}
        >
          <div
            className="dot"
            onMouseDown={() => { setMouseDown(true) }}
            onMouseUp={() => setMouseDown(false)}
            style={{
              top: dcrb.y - size / 2,
              left: dcrb.x - size / 2,
              width: size,
              height: size,
            }}>
          </div>
        </div>
      </div>
      {gameOver ? <Button id="restartbtn" variant="outline-light" size="sm" type="button" onClick={buttonStopTimeout} >Redémarrer</Button> : null}
      ({gameOver ?
        <Countdown date={Date.now() + 5000} className="countdown" >
        </Countdown> : null}
      ),
    </>
  )
}

export default TapGameLevelOne