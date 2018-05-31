const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./service_account.json');
const chatkitCreateUser = require('./services/chatkit/create_user');
const chatkitAuthToken = require('./services/chatkit/auth_token');
const firestoreSendRequest = require('./services/firestore/send_request');
const firestoreAcceptRequest = require('./services/firestore/accept_request');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://reactnative-auth-66287.firebaseio.com'
});

exports.chatkitCreateUser = functions.https.onRequest(chatkitCreateUser);
exports.chatkitAuthToken = functions.https.onRequest(chatkitAuthToken);
exports.firestoreSendRequest = functions.https.onRequest(firestoreSendRequest);
exports.firestoreAcceptRequest = functions.https.onRequest(firestoreAcceptRequest);
