let Survey = require('../models/Survey');
let Answer = require('../models/Answer');

let baseFields = '_id name amountOfParticipants pazePoints'

let getById = (id, callback) => {
    Survey.findOne({ _id: id }, (err, survey) => {
        if (err) console.error(err);
        if (typeof callback == typeof Function)
            callback(err, survey);
    })
}

let save = (survey, callback) => {
    new Survey(survey).save((err, savedSurvey) => {
        if (err) console.error(err);
        else
            console.log(`survey ${savedSurvey.name} saved`);
        if (typeof callback == typeof Function)
            callback(err, savedSurvey);
    });
}

let getPublisherSurveys = (publisherId, callback) => {
    Survey.find({ publisherId: publisherId }, baseFields, (err, surveys) => {
        if (err) console.error(err);

        if (typeof callback == typeof Function) {
            surveys.sort(compareByPazePoints);
            callback(err, surveys);
        }

    })
}

let getParticipantSurveys = (participantId, callback) => {
    Answer.find({ participantId: participantId }, 'surveyId answers publisherId')
        .lean().populate('surveyId publisherId', baseFields).exec((err, surveys) => {
            if (err) console.error(err);
            if (typeof callback == typeof Function) {
                surveys.sort(compareByPazePoints);
                callback(err, surveys);
            }
        })
}

function compareByPazePoints(a, b) {
    if (a.surveyId.pazePoints < b.surveyId.pazePoints)
        return 1;
    if (a.surveyId.pazePoints > b.surveyId.pazePoints)
        return -1;
    return 0;
}

module.exports = {
    getById: getById,
    save: save,
    getPublisherSurveys: getPublisherSurveys,
    getParticipantSurveys: getParticipantSurveys
};