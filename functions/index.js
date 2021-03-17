const functions = require("firebase-functions");

var admin = require("firebase-admin");

var serviceAccount = require("./ezcode-erp-admin-key.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: functions.config().admin.db_url // "https://ezcode-erp-default-rtdb.firebaseio.com"
});

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const db = admin.database();

// 계정이 생성될 때 
exports.createUser = functions.auth.user().onCreate(async (user) => {
	const { uid, email, displayName, photoURL } = user;

	const now = new Date();
	now.setHours(now.getHours()+9); // 서울 지역으로
	const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
	const mb = {
		email: email,
		displayName: displayName,
		photoURL: photoURL,
		createAt: date,
		level: email == functions.config().admin.email ? 10 : 0
	};
	db.ref('users').child(uid).set(mb);
});

// 계정이 제거될 때 
exports.deleteUser = functions.auth.user().onDelete(async (user) => {
	db.ref('users').child(user.uid).remove();
});