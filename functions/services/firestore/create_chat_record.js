const admin = require('firebase-admin');

module.exports = (req, res) => {
    if (!req.body.userId) {
        return res.status(422).send({ error: 'User ID is missing' });
    }

    if (!req.body.friendUserID) {
        return res.status(422).send({ error: 'Friend User ID is missing' });
    }

    if (!req.body.roomId) {
        return res.status(422).send({ error: 'Room ID is missing' });
    }

    const { userId, friendUserID, roomId } = req.body;

    const db = admin.firestore();
    const currentUserRef = db.collection('users').doc(userId);
    const friendRef = db.collection('users').doc(friendUserID);
    const batch = db.batch();

    const currentUserContactRef = currentUserRef
        .collection('contacts')
        .doc(friendUserID);

    const friendContactRef = friendRef
        .collection('contacts')
        .doc(userId);

    batch.update(currentUserContactRef, { room_id: roomId });
    batch.update(friendContactRef, { room_id: roomId });

    return batch.commit()
        .then(() => {
            console.log('Successfully created room for direct messaging for users (' + userId + ') and (' + friendUserID + ')');
            return res.send({ success: true });
        })
        .catch(error => {
            console.log('Error performing batch updates on contacts (' + userId + ' and ' + friendUserID + ') to store room (' + roomId + ')', error);
            return res.status(422).send({ error });
        });
}
