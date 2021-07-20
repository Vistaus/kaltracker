/* KalTracker DataBase Tools */

function createSQLContainer() {
  return LocalStorage.openDatabaseSync("kaltracker_db", "0.2", "keepsYourData", 2000000);
}

/*date and time*/
var longDate = new Date();
var localCountry = Qt.locale()
var current_date = longDate.toLocaleString(localCountry, 'yyyy-MM-dd')
var current_time = longDate.toLocaleString(localCountry, 'hh:mm')

 /* DataWarehouse Start*/

 //dropTablesStatements
const drop_userTable_statement = ' DROP TABLE IF EXISTS User ';
const drop_ingestionTable_statement = ' DROP TABLE IF EXISTS Ingestion ';
const drop_weightTracker_statement = 'DROP TABLE IF EXISTS WeightTracker ';

const dropTasks = [
  drop_userTable_statement,
  drop_ingestionTable_statement,
  drop_weightTracker_statement
];


function dropTables() {
  var db = createSQLContainer();
  console.log("DataBase.dropTables : connected to SQL_CONTAINER");

  try {

    db.transaction(function(tx) {

    for(var i = 0; i < dropTasks.length; i++){

      tx.executeSql(dropTasks[i]);

    } console.log("DataBase.dropTables : OK")});

  } catch (err) {console.log('Error on drop_tables: '+ err)}
}



//createTablesStatements
const create_userTable_statement = 'CREATE TABLE User(\
  idUser	INTEGER PRIMARY KEY,\
  name	TEXT,\
  age INTEGER,\
	sex	TEXT,\
	weight	DOUBLE,\
	height	DOUBLE,\
	activityLevel	TEXT,\
	goal	INTEGER)';

const create_ingestionTable_statement = 'CREATE TABLE Ingestion(\
    idIngestion	INTEGER,\
    idUser	INTEGER,\
    product_name	TEXT,\
    nutriscore_grade	TEXT,\
    type	TEXT,\
    energy_kcal_100g	INTEGER,\
    fat_100g	DOUBLE,\
    saturated_fat_100g	DOUBLE,\
    carbohydrates_100g	DOUBLE,\
    sugars_100g	DOUBLE,\
    proteins_100g	DOUBLE,\
    ingestionDate  TEXT, \
    ingestionTime  TEXT, \
    FOREIGN KEY(idUser) REFERENCES User(idUser), \
    PRIMARY KEY(idIngestion))';

const create_weightTracker_statement = 'CREATE TABLE WeightTracker(\
  idWeightTracker INTEGER,\
  idUser INTEGER,\
  previous_weight DOUBLE,\
  new_weight DOUBLE,\
  new_weight_date TEXT,\
  FOREIGN KEY(idUser) REFERENCES User(idUser),\
  PRIMARY KEY (idWeightTracker))'

const createTasks = [
  create_userTable_statement, 
  create_ingestionTable_statement, 
  create_weightTracker_statement
];

function createTables() {
  var db = createSQLContainer();
  console.log("DataBase.createTables : connected to SQL_CONTAINER");
  try {
    db.transaction(function(tx) {

      for (var i = 0; i < createTasks.length; i++){

        tx.executeSql(createTasks[i]);

      } console.log("DataBase.createTables : OK")});
   } catch (err) {console.log('Error on table_creation: '+ err)}
}

//*populate Components*//

//resumePage Dashboard Foods Daily Ingestion
const populateUserDayKaloriesIngested = 'SELECT SUM(energy_kcal_100g) AS totalKcal \
FROM Ingestion \
WHERE ingestionDate == date("now")';

function getUserKaloriesIngestedDuringDay(){
  var db = createSQLContainer();
  
  db.transaction(function (tx) {
                   var results = tx.executeSql(populateUserDayKaloriesIngested)
                   for (var i = 0; i < results.rows.length; i++) {
                     (function(){
                       var j = i;
                       var rsToQML = results.rows.item(j).totalKcal
                       
                       if(rsToQML === null){
                        
                        dashboardUserKaloriesIngestedDuringDay.text = 0
                      
                      } else{

                        dashboardUserKaloriesIngestedDuringDay.text =  Math.round(rsToQML)
                        
                      }
                     })()
                    }
 })
 
}

//resumePage Dashboard Foods Metric
const populateUserKaloriesIngestionMetric = 'WITH Subtraction AS \
(SELECT (User.goal - SUM(Ingestion.energy_kcal_100g)) AS dif \
FROM Ingestion \
JOIN User ON Ingestion.idUser = User.idUser \
WHERE Ingestion.ingestionDate == date("now")) \
SELECT dif FROM Subtraction'

function getUserKaloriesIngestionMetric(){
  
var db = createSQLContainer();
  db.transaction(function (tx) {
                   var results = tx.executeSql(populateUserKaloriesIngestionMetric)
                   for (var i = 0; i < results.rows.length; i++) {
                     (function(){
                        var j = i;
                        var rsToQML = results.rows.item(j).dif

                        if (rsToQML === null){

                          
                          dashboardUserKaloriesIngestionMetric.text = userSettings.userConfigsGoal                      
                          dashboardUserKaloriesIngestionMetric.color = UbuntuColors.green
                          appSettings.displayAlert = false
                          root.metric = 0

                        } else if (rsToQML > 0){

                          dashboardUserKaloriesIngestionMetric.text =  Math.round(rsToQML)
                          appSettings.displayAlert = false
                          root.metric = Math.round(rsToQML)

                        } else {

                          dashboardUserKaloriesIngestionMetric.text =  Math.round(Math.abs(rsToQML))
                          appSettings.displayAlert = true
                          root.metric = Math.round(rsToQML)
                        }

                      })()
                    }
                }) 
}


//resumePage log book view
const populateUserDailyLogIngestionFoods = 'SELECT Ingestion.idIngestion AS idIngestion,\
Ingestion.ingestionDate AS ingestionDate,\
Ingestion.ingestionTime AS ingestionTime,\
Ingestion.type AS type,\
Ingestion.product_name AS name,\
Ingestion.energy_kcal_100g AS kcal \
FROM Ingestion \
WHERE Ingestion.ingestionDate == date("now")';

function getUserDailyLogIngestionFoods(){
  var db = createSQLContainer();
  db.transaction(function (tx) {
                   var results = tx.executeSql(populateUserDailyLogIngestionFoods)
                   for (var i = 0; i < results.rows.length; i++) { 
                     (function(){

                       var j = i;

                       dailyIngestions.append({"idIngestion": results.rows.item(j).idIngestion,"kcal": results.rows.item(j).kcal, "name": results.rows.item(j).name, "ingestionDate": results.rows.item(j).ingestionDate, "ingestionTime": results.rows.item(j).ingestionTime})
                     })()
                 }
 }) 
}

/* get data for stats and export */
const allIngestions = 'SELECT Ingestion.ingestionDate AS ingestionDate,\
Ingestion.ingestionTime AS ingestionTime,\
Ingestion.nutriscore_grade AS score_grade,\
Ingestion.type AS type,\
Ingestion.product_name AS product_name,\
Ingestion.energy_kcal_100g AS kcal, \
Ingestion.fat_100g AS fat,\
Ingestion.saturated_fat_100g AS saturated,\
Ingestion.carbohydrates_100g AS carbo,\
Ingestion.sugars_100g AS sugars,\
Ingestion.proteins_100g AS proteins \
FROM Ingestion';

function getAllIngestions(contextRequest){

  var db = createSQLContainer();
  db.transaction(function (tx) {
                   var results = tx.executeSql(allIngestions)
                   for (var i = 0; i < results.rows.length; i++) { 
                     (function(){
                       var j = i;
                       switch(contextRequest){

                         case "recordsLog":
                            var rsToQML = results.rows.item(j).ingestionDate + ' '+ results.rows.item(j).ingestionTime + ' ' + results.rows.item(j).product_name + ' ' + results.rows.item(j).kcal + 'kcal' + '\n'
                            recordsHistory.text += rsToQML
                           
                          break
                          case "exportData":
                            var rsToQML = results.rows.item(j).ingestionDate + ',' + results.rows.item(j).ingestionTime + ',' + results.rows.item(j).type + ',' + results.rows.item(j).product_name + ',' + results.rows.item(j).score_grade + ',' + results.rows.item(j).kcal + ',' + results.rows.item(j).fat + ',' + results.rows.item(j).saturated + ',' + results.rows.item(j).carbo + ',' + results.rows.item(j).sugars + ',' + results.rows.item(j).proteins + '\n';
                            exportDataPage.ingestions_query += rsToQML
                            
                          break
                          
                          default:
                            break
                       }
                       
                     })()
                 }
 }) 
}



const userProfile = 'SELECT User.name AS username,\
User.age AS age, \
User.sex AS sex, \
User.weight AS weight, \
User.height AS height, \
User.activityLevel AS activity, \
User.goal AS goal \
FROM User';

function getUserProfile(){

  var db = createSQLContainer();
  db.transaction(function (tx) {
                   var results = tx.executeSql(userProfile)
                   for (var i = 0; i < results.rows.length; i++) { 
                     (function(){
                       var j = i;
                          var rsToQML = results.rows.item(j).username + ',' + results.rows.item(j).age + ',' + results.rows.item(j).sex + ',' + results.rows.item(j).weight + ',' + results.rows.item(j).height + ',' + results.rows.item(j).activity + ',' + results.rows.item(j).goal + '\n';
                          exportDataPage.user_query += rsToQML
                     })()
                 }
 }) 
}



const weight_tracker = 'SELECT WT.previous_weight AS previous_weight,\
WT.new_weight AS new_weight, \
WT.new_weight_date AS new_weight_date \
FROM WeightTracker WT';

function getWeightTracker(){

  var db = createSQLContainer();
  db.transaction(function (tx) {
                   var results = tx.executeSql(weight_tracker)
                   for (var i = 0; i < results.rows.length; i++) { 
                     (function(){
                       var j = i;
                          var rsToQML = results.rows.item(j).previous_weight + ',' + results.rows.item(j).new_weight + ',' + results.rows.item(j).new_weight_date + '\n';
                          exportDataPage.weight_query += rsToQML
                     })()
                 }
 }) 
}




//statsPage

const average_calories_month = 'SELECT strftime("%m", Ingestion.ingestionDate) AS month,\
AVG(Ingestion.energy_kcal_100g) AS average \
FROM Ingestion \
WHERE strftime("%Y", Ingestion.ingestionDate) == strftime("%Y", date()) \
GROUP BY month \
ORDER BY month DESC'


function getAverageCaloriesMonth(){
  var db = createSQLContainer();
  db.transaction(function (tx) {
                   var results = tx.executeSql(average_calories_month)
                   for (var i = 0; i < results.rows.length; i++) { 
                     (function(){
                       var j = i;
                       avgCaloriesMonth.append({"month": results.rows.item(j).month, "average": results.rows.item(j).average})
                     })()
                 }
 }) 
}


function getAllIngestionsMonth(month_requested){
  
const month_ingestions = 'SELECT i.ingestionDate AS ingestionDate,\
i.ingestionTime AS ingestionTime,\
i.product_name AS name,\
i.energy_kcal_100g AS kcal \
FROM Ingestion i \
WHERE strftime("%m", ingestionDate) == "which_month"'.replace("which_month", month_requested)
  
  var db = createSQLContainer();
  db.transaction(function (tx) {
                   var results = tx.executeSql(month_ingestions)
                   for (var i = 0; i < results.rows.length; i++) { 
                     (function(){
                       var j = i;
                       var rsToQML = results.rows.item(j).ingestionDate + ' '+ results.rows.item(j).ingestionTime + ' ' + results.rows.item(j).name + ' ' + results.rows.item(j).kcal + 'kcal' + '\n'
                       recordsHistory.text += rsToQML
                     })()
                 }
 }) 
}


   /* Data Saving Start */
  //stores the data given by user for userProfile
const saveUserProfile = 'INSERT INTO User (\
  name, age, sex, weight, height, activityLevel, goal)\
  VALUES (?,?,?,?,?,?,?)';

function createUserProfile(userName,
  userAge,
  userSex,
  userWeight,
  userHeight,
  userActivityLevel,
  userGoal){          
  var db = createSQLContainer();
  console.log("DataBase.createUserProfile : connected to SQL_CONTAINER");
  
  db.transaction(function(tx) {
      var results = tx.executeSql(saveUserProfile, [userName,
        userAge,
        userSex,
        userWeight,
        userHeight,
        userActivityLevel,
        userGoal]);
      if (results.rowsAffected > 0) {
        console.log("DataBase.createUserProfile : OK")
      } else {
        console.log("DataBase.createUserProfile : Failed");
      }
  }
  )
}


const saveNewIngestionStatement = 'INSERT INTO Ingestion (\
  idUser,\
  product_name,\
  nutriscore_grade,\
  type,\
  energy_kcal_100g,\
  fat_100g,\
  saturated_fat_100g,\
  carbohydrates_100g,\
  sugars_100g,\
  proteins_100g,\
  ingestionDate,\
  ingestionTime)\
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';

function saveNewIngestion(product_name,
  nutriscore_grade,
  type,
  energy_kcal_100g,
  fat_100g,
  saturated_fat_100g,
  carbohydrates_100g,
  sugars_100g,
  proteins_100g,
  currentDate,
  currentTime){          
  var db = createSQLContainer();
  console.log("DataBase.saveNewIngestion : connected to SQL_CONTAINER");
  var validationMessage = "";
  console.log(current_time + ' ' + current_date)
  
  db.transaction(function(tx) {
      var rs = tx.executeSql(saveNewIngestionStatement, [1,
        product_name,
        nutriscore_grade,
        type,
        energy_kcal_100g,
        fat_100g,
        saturated_fat_100g,
        carbohydrates_100g,
        sugars_100g,
        proteins_100g,
        current_date,
        current_time]);
      if (rs.rowsAffected > 0) {
        validationMessage = "DataBase.saveNewIngestion : OK";
      } else {
        validationMessage = "DataBase.saveNewIngestion : Failed ";
      }
  }
  );
  console.log(validationMessage)
  return validationMessage;
}

function saveScheduleIngestion(product_name,
  nutriscore_grade,
  type,
  energy_kcal_100g,
  fat_100g,
  saturated_fat_100g,
  carbohydrates_100g,
  sugars_100g,
  proteins_100g,
  schedule_date,
  schedule_time){          
  var db = createSQLContainer();
  console.log("DataBase.saveNewIngestion : connected to SQL_CONTAINER");
  var validationMessage = "";
  
  
  db.transaction(function(tx) {
      var rs = tx.executeSql(saveNewIngestionStatement, [1,
        product_name,
        nutriscore_grade,
        type,
        energy_kcal_100g,
        fat_100g,
        saturated_fat_100g,
        carbohydrates_100g,
        sugars_100g,
        proteins_100g,
        schedule_date,
        schedule_time]);
      if (rs.rowsAffected > 0) {
        validationMessage = "DataBase.saveNewIngestion : OK";
      } else {
        validationMessage = "DataBase.saveNewIngestion : Failed ";
      }
  }
  );
  console.log(validationMessage)
  return validationMessage;
}



const save_weight_update = 'INSERT INTO WeightTracker (\
  idUser, previous_weight, new_weight,new_weight_date)\
  VALUES (?,?,?,?)';

function saveNewWeight(previous_weight, new_weight){          
  var db = createSQLContainer();
  console.log("DataBase.createUserProfile : connected to SQL_CONTAINER");
  
  db.transaction(function(tx) {
      var results = tx.executeSql(save_weight_update, [1, previous_weight, new_weight, current_date]);
      
      if (results.rowsAffected > 0) {
       
        console.log("DataBase.createUserProfile : OK")
      
      } else {
       
        console.log("DataBase.createUserProfile : Failed");
      
      }
  }
  )
}

 function updateWeight(newWeight){

  const updateWeight_statement = 'UPDATE User \
  SET weight = new_weight \
  WHERE User.idUser == 1'.replace("new_weight",newWeight)

  var db = createSQLContainer();
  var rs;
  db.transaction(function(tx) {
    rs = tx.executeSql(updateWeight_statement);
   }
 );
 return console.log("rows affected " + rs.rowsAffected)
}


function updateGoal(newGoal){

  const updateGoal_statement = 'UPDATE User \
  SET goal = new_goal \
  WHERE User.idUser == 1'.replace("new_goal",newGoal)

  var db = createSQLContainer();
  var rs;
  db.transaction(function(tx) {
    rs = tx.executeSql(updateGoal_statement);
   }
 );
 return console.log("rows affected " + rs.rowsAffected)
}


  /* Data Loading End */


/* DataWarehouse End*/

 /*delete all data from table*/
const removeAllIngestions = 'DELETE FROM Ingestion'

 function deleteAllIngestions(){
  var db = createSQLContainer();
  var rs;
  db.transaction(function(tx) {
    rs = tx.executeSql(removeAllIngestions);
   }
 );
 return console.log(rs.rowsAffected)
}

 /*delete current day data from table*/
 const removeTodayIngestions = 'DELETE FROM Ingestion \
 WHERE Ingestion.ingestionDate == date("now")'

 function deleteTodayIngestions(){
  var db = createSQLContainer();
  var rs;
  db.transaction(function(tx) {
    rs = tx.executeSql(removeTodayIngestions);
   }
 );
 return console.log(rs.rowsAffected)
}


//delete ingestion from ResumePage
 function deleteIngestion(id){
  var removeStatement = 'DELETE FROM Ingestion \
  WHERE Ingestion.idIngestion = which_id'.replace("which_id",id)
   var db = createSQLContainer();
   var rs;
   db.transaction(function(tx) {
    rs = tx.executeSql(removeStatement);
   }
 );
 return console.log(rs.rowsAffected)
}

//delete ingestion from ResumePage
function updateIngestionTime(id, new_time){
  var update_Statement = 'UPDATE Ingestion \
  SET ingestionTime = "old_time" \
  WHERE Ingestion.idIngestion = which_id'.replace("which_id",id).replace("old_time", new_time)
   var db = createSQLContainer();
   var rs;
   db.transaction(function(tx) {
    rs = tx.executeSql(update_Statement);
   }
 );
 return console.log(rs.rowsAffected)
}


// removes ingestions from previous year
const auto_clean = 'DELETE FROM Ingestion \
WHERE Ingestion.ingestionDate < strftime("%Y", date())'

function autoClean(){
 var db = createSQLContainer();
 var rs;
 db.transaction(function(tx) {
   rs = tx.executeSql(auto_clean);
  }
);
return console.log('auto_clean_removed:' + rs.rowsAffected)
}