const csv = require("csv-parser");
const fs = require("fs");
const DecisionTree = require("decision-tree");

var dataSetPath = "training.csv";
var severityPath = "symptom_severity.csv";
var testDataSet = "testing.csv";

var symptoms = [];
var severity = [];
var testData = [];
exports.trainModel = () => {
  readSymptoms();
  readTestData();
  // processData();
};

const readSymptoms = () => {
  symptoms = [];
  fs.createReadStream(dataSetPath)
    .pipe(csv())
    .on("data", (row) => {
      symptoms.push(row);
      //   console.log(row);
    })
    .on("end", () => {
      console.log("Symptoms read successfully");
      // console.log("symptoms ::", symptoms);
      // readTestData();
      // readSeverity();
    });
};
const readTestData = () => {
  fs.createReadStream(testDataSet)
    .pipe(csv())
    .on("data", (row) => {
      testData.push(row);
      //   console.log(row);
    })
    .on("end", () => {
      console.log("Test Data read successfully");
      // console.log("symptoms ::", symptoms);
      trainTree();
      // readSeverity();
    });
};
const readSeverity = () => {
  fs.createReadStream(severityPath)
    .pipe(csv())
    .on("data", (row) => {
      severity.push(row);
      //   console.log(row);
    })
    .on("end", () => {
      console.log("Severity read successfully");
      //   console.log("severity ::", severity.length, severity);
      processData();
    });
};

const processData = () => {
  const transformedSeverity = [];
  severity.map((symptom) => {
    transformedSeverity.push({ [symptom.Symptom]: +symptom.weight });
  });
  //   console.log("transformedSeverity ::", transformedSeverity);
  const transformedDataSet = [];
  symptoms.map((record) => {
    const temp = {};
    temp.Disease = record.Disease;
    severity.map((x) => {
      temp[x.Symptom] = 0;
    });
    Object.keys(record).map((key) => {
      if (key !== "Disease") {
      }
    });
  });
};

const trainTree = () => {
  const classes = Object.keys(symptoms[0]);
  console.log("classes :", classes);
  const target_class = classes[classes.length - 1];
  console.log("target_class :", target_class);
  const feature_classes = classes.slice(0, classes.length - 1);
  console.log("feature_classes :", feature_classes);

  var dt = new DecisionTree(target_class, feature_classes);
  console.log("Training ...");
  const transformed = symptoms.map((symptom) => {
    const newObject = {};
    Object.keys(symptom).map((key) => {
      if (key !== target_class) {
        newObject[key] = +symptom[key];
      } else {
        newObject[key] = symptom[key];
      }
    });
    return newObject;
  });
  dt.train(transformed);
  console.log("symptoms :", transformed);
  console.log("Testing ...");
  const testingTuple = {};
  Object.keys(testData[2]).map((key) => {
    testingTuple[key] = +testData[2][key];
  });
  const result = dt.predict(testingTuple);
  console.log("testingTuple :", testingTuple);
  console.log("result :", result);
  console.log("target_class :", target_class);

  const accuracy = dt.evaluate(testData);

  console.log("accuracy :", accuracy);

  // var treeJSON = dt.toJSON();
  // saveDTToFile(JSON.stringify(treeJSON));
};

const saveDTToFile = (treeJSON) => {
  fs.writeFile("jsonTree.json", treeJSON, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
};

exports.getSymptomsFromFile = () => {
  // readSymptoms();
  const classes = Object.keys(symptoms[0]);
  const feature_classes = classes.slice(0, classes.length - 1);
  return feature_classes;
};

exports.getDiseaseFromDT = (symptomsForPred) => {
  // readSymptoms();
  console.log("symptoms :", symptoms[0]);

  const classes = Object.keys(symptoms[0]);
  console.log("classes :", classes);
  const target_class = classes[classes.length - 1];
  console.log("target_class :", target_class);
  const feature_classes = classes.slice(0, classes.length - 1);
  console.log("feature_classes :", feature_classes);

  let rawdata = fs.readFileSync("jsonTree.json");
  let prevTrainedModel = JSON.parse(rawdata);
  console.log("prevTrainedModel :", prevTrainedModel);

  const preTrainedDT = new DecisionTree(prevTrainedModel);

  const objectForPred = {};
  feature_classes.map((feature_class) => {
    if (symptomsForPred.includes(feature_class)) {
      console.log("feature_class --------------- :", feature_class);
      objectForPred[feature_class] = 1;
    } else {
      objectForPred[feature_class] = 0;
    }
  });

  objectForPred["prognosis"] = "NaN";

  const prediction = preTrainedDT.predict(objectForPred);
  console.log("objectForPred :", objectForPred);
  console.log("prediction :", prediction);
  console.log("symptomsForPred :", symptomsForPred);
  return prediction;

  // console.log("Testing ...");
  // const accuracy = preTrainedDT.evaluate(testData);

  // console.log("accuracy :", accuracy);
};
