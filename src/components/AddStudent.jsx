import React, { useState, useCallback } from 'react'
import { Col, Form, Button, } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { personAdd } from '../assets/icons'


function AddStudent() {
    const history = useHistory()
    const [studentName, setStudentName] = useState('')

    const sendStudent = useCallback(
        () => {
            const url = ('/api/students')
            fetch(url, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({ name: studentName }),
            })
                .then(res => res.json())
                .then(data => { console.log(data) })
                .catch(err => console.log(err))
            history.push('/Students')
        },
        [studentName, history]
    )

    return (
        <Col className="bg-light text-dark p-2 rounded">
            <h5>{personAdd} Nouvel élève</h5>

            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="text" name="name" onChange={(e) => setStudentName(e.target.value)} placeholder="Taper le prénom" />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={sendStudent}>
                    Ajouter
                </Button>
            </Form>
        </Col>
    )
}

export default AddStudent