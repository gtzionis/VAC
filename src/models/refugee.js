const mongoose = require('mongoose')

const aObject = new mongoose.Schema({
          ActivityNo:{type: String},        
          CompleteActivity:{type: String},
          ScoreAchieved:{type: Number},
          NumberOfAttempts:{type: Number},
          NumberOfTriesUntilRightAnswer:{type: Number},
          Time:{type:String},
          arr2:[{type: String}],
})

const Refugee = mongoose.model('Refugee', {
   // data:[
    //{
        Name:{type:String},
        Gender:{type: String},
        Age:{type: Number},
        Nationality:{type: String},
        EducationLevel:{type: String},
        MotherTongue:{type: String},
        ModulesCompleted:{type: Number},
        TimeSinceRegistrationTo1RS:{type: Number},
        TimePlayedOnTheApp:{type: Number},
        DurationOfStayInCountry:{type: Number},
        ResidentStatus:{type: String},
        FAQ:{type: String},
        DateArrival:{type: String},
        LegalStatus:{type: String},
        ExperienceWithTechnology:{type: String},
        Tutorial:{type: String},
        PreviousLanguageSpoken:{type: String},
        Activities:[aObject],
        EvolutionOfNumberOfTriesUntilRightAnswer:{type: String},
        MunicipalityOfResidence:{type: String},
        NumberOfTimesThatTheTCNLogin:{type: String},
        Class:{type:String},
        SessionTime:{type:String},
        arr:[{type: String}],
        tade:[{tade2:{type:String}}]
    //}
  //]
})

module.exports = Refugee