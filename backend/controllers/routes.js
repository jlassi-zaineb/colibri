const express = require('express')
const router = express.Router();
const { Student, History } = require('../model/Schemas.js')
const mongoose = require('mongoose')

// ROUTE DISPLAY + ADD + DELETE STUDENTS
router.route('/api/students')

    .get(async (req, res) => {
        try {
            const students_list = await Student.find({})
            console.log(students_list)
            res.json(students_list)
        } catch (error) {
            res.json({ success: false, payload: error.message })
        }
    })
    .post(async (req, res) => {
        try {
            const bodyRequest = req.body
            const newStudent = new Student(bodyRequest)
            const student = await newStudent.save();
            res.json({ success: true, payload: `${student} is added to Students' Collection` })
        } catch (error) {
            if (error.code === 11000) {
                res.json({ success: false, payload: 'Student exists' })
            } else {
                res.json({ success: false, payload: error.message })
            }
        }
    })

router.delete('/api/students/:id', async (req, res) => {
    try {
        const studentToDelete = req.params.id
        await Student.deleteOne({ _id: studentToDelete }).exec()
        await History.deleteMany({ student: studentToDelete }).exec()
        res.json({ success: true, payload: `${studentToDelete} Got a DELETE request !` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, payload: error.message })
    }
})

//Spécial Dashbord.jsx : récupère les noms des enfants
router.get('/api/students/:id', async (req, res) => {
    try {
        const students_list = await Student.findById(req.params.id)
        console.log(students_list)
        res.json(students_list)
    } catch (error) {
        res.json({ success: false, payload: error.message })
    }
})

// POST HISTORY AND GET HISTORY
router.route('/api/history')
    .get(async (req, res) => {
        try {
            //const { student } = req.query // const student = req.query.student

            const data = await History.find(req.query).populate('student').exec()
            res.json({ success: true, payload: data })
        } catch (error) {
            res.json({ success: false, payload: error.message })
        }
    })
    .post(async (req, res) => {
        try {
            const getGameData = req.body
            const newGameData = new History(getGameData)
            const gameData = await newGameData.save();
            res.json({ success: true, payload: `${gameData} is added to Histories` })
        } catch (error) {
            res.json({ success: false, payload: error.message })
        }
    })

router.route('/api/history/byDate')
    .get(async (req, res) => {
        try {
            const { student } = req.query
            const data = await History.aggregate([
                { '$match': { student: mongoose.Types.ObjectId(student) } },
                {
                    '$group': {
                        '_id': {
                            'month': { '$month': '$created' },
                            'day': { '$dayOfMonth': '$created' },
                            'year': { '$year': '$created' },
                        },
                        'histories': {
                            '$push': {
                                'created': '$created',
                                'duration': '$duration',
                                'level': '$level',
                                'status': '$status',
                            },
                        },
                    },
                },
            ]).exec()
            res.json({ success: true, payload: data })
        } catch (error) {
            res.json({ success: false, payload: error.message })
        }
    })


module.exports = router