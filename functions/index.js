const functions = require('firebase-functions');
const chatkitCreateUser = require('./services/chatkit/create_user');
const chatkitAuthToken = require('./services/chatkit/auth_token');
const firestoreSendRequest = require('./services/firestore/send_request');

exports.chatkitCreateUser = functions.https.onRequest(chatkitCreateUser);
exports.chatkitAuthToken = functions.https.onRequest(chatkitAuthToken);
exports.firestoreSendRequest = functions.https.onRequest(firestoreSendRequest);
