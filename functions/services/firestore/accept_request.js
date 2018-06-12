const admin = require('firebase-admin');

module.exports = (req, res) => {
    if (!req.body.userId) {
        return res.status(422).send({ error: 'User ID is missing' });
    }

    if (!req.body.requestorID) {
        return res.status(422).send({ error: 'Received User ID is missing' });
    }

    const { userId, requestorID } = req.body;

    const db = admin.firestore();
    const batch = db.batch();
    const currentUserRef = db.collection('users').doc(userId);
    const requestorRef = db.collection('users').doc(requestorID);
    
    const currentUserContactsRef = currentUserRef
        .collection('contacts')
        .doc(requestorID);
    
    const requestorContactsRef = requestorRef
        .collection('contacts')
        .doc(userId);
    
    const currentUserRequestsReceivedRef = currentUserRef
        .collection('contact_requests_received')
        .doc(requestorID);
    
    const requestorRequestsReceivedRef = requestorRef
        .collection('contact_requests_received')
        .doc(userId);
    
    const currentUserRequestsSentRef = currentUserRef
        .collection('contact_requests_sent')
        .doc(requestorID);
    
    const requestorRequestsSentRef = requestorRef
        .collection('contact_requests_sent')
        .doc(userId);

    batch.set(currentUserContactsRef, {
        user_id: requestorID,
        doc_ref: requestorRef,
        room_id: '',
        date_created: new Date()
    });
    
    batch.set(requestorContactsRef, {
        user_id: userId,
        doc_ref: currentUserRef,
        room_id: '',
        date_created: new Date()
    });

    batch.delete(currentUserRequestsReceivedRef);
    batch.delete(requestorRequestsReceivedRef);
    batch.delete(currentUserRequestsSentRef);
    batch.delete(requestorRequestsSentRef);

    return batch.commit()
        .then(() => {
            console.log('User (' + userId + ') has successfully accepted request from user (' + requestorID + ')');
            return res.send({ success: true });
        })
        .catch(error => {
            console.log('Error performing batch updates on accepting request');
            return res.status(422).send({ error });
        });
};
