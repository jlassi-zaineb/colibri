const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// LES NOMS ET LES NIVEAUX DE JEU
const gameSchema = Schema({
    name: String,
    levelMax: Number,
    created: {
        type: Date,
        default: Date.now
    }
})

// MODEL HISTORIQUE JEU PAR ENFANT
const historySchema = Schema({
    game_id: Object, // le jeu auquel appartient l'historique
    level: Number, // le level du jeu joué
    student: { // l'élève concerné
        type: Schema.Types.ObjectId,
        ref: 'student'
    },
    duration: Number, // le temps de jeu
    status: { // le score
        type: String,
        enum: ['SUCCESS', 'FAILED', 'PARTIAL']
    },
    created: { // la date de création de l'historique
        type: Date,
        default: Date.now
    }
})

// MODEL PAR ENFANT + REF A SON HISTORIQUE
const studentSchema = Schema({
    name: String,
    created: {
        type: Date,
        default: Date.now
    }
})


const Student = mongoose.model('student', studentSchema);
const Game = mongoose.model("game", gameSchema)
const History = mongoose.model("history", historySchema)


module.exports = { Student, Game, History }