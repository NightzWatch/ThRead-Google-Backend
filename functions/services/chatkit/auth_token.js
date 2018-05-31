const Chatkit = require('@pusher/chatkit-server');
const chatkit = new Chatkit.default({
	instanceLocator: 'v1:us1:ce5dc7d7-09b5-4259-a8ce-55d1bcf999ea',
	key: 'ff300296-3c94-43f6-b25c-591678c02e7a:t2sQQUMCsmtdm5K+RkQwrujwjoBNO61GvyhhreWGYGQ=',
});

module.exports = (req, res) => {
    if (!req.query.userId) {
        return res.status(422).send({ error: 'User ID is missing' });
    }

    const { userId } = req.query;
    const authData = chatkit.authenticate({ userId });

    console.log('chat user authenticated successfully');

    return res.send(authData.body);
};
