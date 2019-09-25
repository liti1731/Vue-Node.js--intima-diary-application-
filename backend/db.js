// GET SQLITE3
const sqlite = require('sqlite3')
const db = new sqlite.Database("INTIMA.db")

// TELL THE DB TO ENABLE FOREIGN KEY CONSTRAINTS
db.run("PRAGMA foreign_keys = ON")

// CREATE TABLES IF NOT EXISTS
db.run(`
	CREATE TABLE IF NOT EXISTS user (
		id INTEGER PRIMARY KEY,
		username TEXT,
		password TEXT,
		CONSTRAINT uniqueUsername UNIQUE(username)
	)
`)

db.run(`
	CREATE TABLE IF NOT EXISTS log (
		id INTEGER PRIMARY KEY,
		userId INTEGER,
		content TEXT,
		emotionId INTEGER,
		date INTEGER,
		FOREIGN KEY(userId) REFERENCES user(id),
		FOREIGN KEY(emotionId) REFERENCES emotion(id)
	)
`)
db.run(`
	CREATE TABLE IF NOT EXISTS emotion (
		id INTEGER PRIMARY KEY,
		logId INTEGER,
		userId INTEGER,
		type TEXT,
		FOREIGN KEY(logId) REFERENCES log(id),
		FOREIGN KEY(userId) REFERENCES user(id)
	)
`)
// ON DELETE CASCADE => if a record in the parent table is deleted, then the corresponding records in the child table will automatically be deleted. 
// ON UPDATE RESTRICT // ON UPDATE NO ACTION => can't delete because logs still exist

// EXPORT FUNCTIONS FOR USER TABLE
exports.createUser = function(user, callback){
	
	const query = `
		INSERT INTO user
			(username, password)
		VALUES
			(?, ?)
	`
	const values = [
		user.username,
		user.password
	]
	
	db.run(query, values, function(error){
		if(error){
			if(error.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: accounts.username"){
				callback(["usernameTaken"])
			}else{
				console.log(error)
				callback(["databaseError"])
			}
		}else{
			callback([], this.lastID)
		}
	})
	
}

// GET ALL USERS
exports.getAllUser = function(callback){
	
	const query = `
		SELECT * FROM user ORDER BY username
	`
	const values = []
	
	db.all(query, values, function(error, user){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], user)
		}
	})
}

// GET USER ACCOUNT BY ID
exports.getUserById = function(id, callback){
	
	const query = `
		SELECT * FROM user WHERE id = ?
	`
	const values = [id]
	
	db.get(query, values, function(error, user){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], user)
		}
	})
	
}

// GET USER ACCOUNTS BY USERNAME
exports.getUserByUsername = function(username, callback){
	
	const query = `
		SELECT * FROM user WHERE username = ?
	`
	const values = [username]
	
	db.get(query, values, function(error, user){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], user)
		}
	})
	
}


// EXPORT FUNCTIONS FOR LOG TABLE
exports.createLog = function(log, callback){
	
	const query = `
		INSERT INTO log
			(userId, content, date, emotion)
		VALUES
			(?, ?, ?, ?)
	`
	const values = [
		log.userId,
		log.content,
		log.date,
		log.emotion
	]
	
	db.run(query, values, function(error){
		if(error){
			// CHECK FOREIGN KEY VIOLATION
			if(true){
				callback(["userNotFound"])
			}else{
				console.log(error)
				callback(["databaseError"])
			}
		}else{
			callback([], this.lastID)
		}
	})
}

// GET ALL LOGS
exports.getAllLog = function(callback){
	
	const query = `
		SELECT * FROM log ORDER BY date
	`
	const values = []
	
	db.all(query, values, function(error, log){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], log)
		}
	})	
}

// GET ALL EMOTIONS
exports.getAllEmotion = function(callback){
	
	const query = `
		SELECT * FROM emotion ORDER BY date
	`
	const values = []
	
	db.all(query, values, function(error, log){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], log)
		}
	})
}

// GET SINGLE LOG BY ID
exports.getLogById = function(id, callback){
	
	const query = `
		SELECT * FROM log WHERE id = ?
	`
	const values = [id]
	
	db.get(query, values, function(error, log){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], log)
		}
	})
	
}

// GET EMOTION BY ID
exports.getEmotionById = function(id, callback){
	
	const query = `
		SELECT * FROM emotion WHERE id = ?
	`
	const values = [id]
	
	db.get(query, values, function(error, log){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], log)
		}
	})
	
}

// GET LOGS BY USER ID
exports.getLogByUserId = function(userId, callback){
	
	const query = `
		SELECT * FROM log WHERE userId = ? ORDER BY date
	`
	const values = [
		userId
	]
	
	db.all(query, values, function(error, log){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], log)
		}
	})
	
}

// UPDATE LOG FUNCTION
exports.updateLogById = function(id, updatedLog, callback){
	
	const query = `
		UPDATE log SET
			content = ?,
			emotion = ?
		WHERE
			id = ?
	`
	const values = [
		updatedLog.content,
		updatedLog.emotion,
		id
	]
	
	db.run(query, values, function(error){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			const logExisted = (this.changes == 1)
			callback([], logExisted)
		}
	})
	
}

// DELETE LOG FUNCTION
exports.deleteLogById = function(id, callback){
	
	const query = `
		DELETE FROM log WHERE id = ?
	`
	const values = [
		id
	]
	
	db.run(query, values, function(error){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			const logExisted = (this.changes == 1)
			callback([], logExisted)
		}
	})
	
}