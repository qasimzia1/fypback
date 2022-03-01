const { getDiseaseFromDT, getSymptomsFromFile } = require("../utils/trainDT");
const History = require("../models/History");

exports.getSymptoms = (req, res, next) => {
  console.log("get Symptoms");
  res.status(200).json({
    success: true,
    result: getSymptomsFromFile(),
  });
};

exports.getDisease = (req, res, next) => {
  const { symptoms, email } = req.body;
  console.log("symptoms :", symptoms);
  const predict = getDiseaseFromDT(symptoms);

  if(!email) {
    res.status(200).json({
      success: true,
      result: predict,
    });
    return;
  }

  const date = new Date();
  const newHistory = new History({
    date: date.toDateString(),
    email: email,
    symptoms: symptoms.join(", "),
    disease: predict,
  });
  newHistory.save();
  res.status(200).json({
    success: true,
    result: predict,
  });
};

exports.getHistory = (req, res, next) => {
  const { email } = req.body;
  if(email) {
    History.find({ email: email }).then((history) => {
      res.status(200).json({
        success: true,
        result: history,
      });
    });
    return;
  }
  res.status(200).json({
    success: false,
    result: null
  })
};
