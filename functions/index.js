const functions = require("firebase-functions");

var admin = require("firebase-admin");

var serviceAccount = require("./ezcode-erp-admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ezcode-erp-default-rtdb.firebaseio.com"
});

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const db = admin.database();

// 계정이 생성될 때 
exports.createUser = functions.auth.user().onCreate(async (user) => {
	const {uid, email, displayName, photoURL} = user;
	const mb = {
		email,
		displayName,
		photoURL,
		createAt : new Date()
	};
	db.ref('users').child(uid).set(mb);
});

// 계정이 제거될 때 
exports.deleteUser = functions.auth.user().onDelete(async (user) => {
	db.ref('users').child(user.uid).remove();
});