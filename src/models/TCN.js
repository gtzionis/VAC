const mongoose = require('mongoose')

const TCN = mongoose.model('TCN', {
    agentUri:{type:String},
    subjectIri:{type:String},
    agentId:{type:String},
    Name:{type:String},
    Gender:{type:String},
    Nationality:{type:String},
    LccGenderPreference:{type:String},
    LccNationPreference:{type:String},
    LessonId:{type:String},
    AssessmentScore:{type:Number},
    ReadingScore:{type:Number},
    WritingScore:{type:Number},
    ListeningScore:{type:Number},
    VocabularyScore:{type:Number}
})

module.exports = TCN