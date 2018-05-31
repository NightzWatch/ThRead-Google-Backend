const admin = require('firebase-admin');

module.exports = (req, res) => {
    if (!req.body.userId) {
        return res.status(422).send({ error: 'User ID is missing' });
    }

    if (!req.body.phoneNumber) {
        return res.status(422).send({ error: 'Bad Input' });
    }

    const { userId, phoneNumber } = req.body;
    const phone_number = String(phoneNumber).replace(/[^\d]/g, '');
    const db = admin.firestore();
    const usersRef = db.collection('users');
    const userRef = usersRef.where('phone_number', '==', phone_number);
    const currentUserRef = db.collection('users').doc(userId);

    return userRef.get().then(querySnapshot => {
        const batch = db.batch();
        const requestedUserDoc = querySnapshot.docs[0];
        const requestedUserData = requestedUserDoc.data();
        const requestedUserRef = requestedUserDoc.ref;

        const currentUserRequestsSentRef = currentUserRef
            .collection('contact_requests_sent')
            .doc(requestedUserDoc.id);
        
        const requestorRequestsReceivedRef = requestedUserRef
            .collection('contact_requests_received')
            .doc(userId);

        batch.set(currentUserRequestsSentRef, {
            user_id: requestedUserDoc.id,
            user_ref: requestedUserRef,
            date_created: new Date()
        });

        batch.set(requestorRequestsReceivedRef, {
            user_id: userId,
            user_ref: currentUserRef,
            date_created: new Date()
        });

        return batch.commit()
            .then(() => {
                console.log('Current user has successfully sent request');
                return res.send({ Success: true });
            })
            .catch(error => {
                console.log('Error performing batch updates on contact request: ', error);
                return res.status(422).send({ error });
            });
    }).catch(error => {
        console.log('Error getting requested user document: ', error);
        return res.status(422).send({ error });
    });
};
