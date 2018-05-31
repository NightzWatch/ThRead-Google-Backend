const Chatkit = require('@pusher/chatkit-server');
const chatkit = new Chatkit.default({
	instanceLocator: 'v1:us1:ce5dc7d7-09b5-4259-a8ce-55d1bcf999ea',
	key: 'ff300296-3c94-43f6-b25c-591678c02e7a:t2sQQUMCsmtdm5K+RkQwrujwjoBNO61GvyhhreWGYGQ=',
});

module.exports = (req, res) => {
    if (!req.body.user) {
        return res.status(422).send({ error: 'User is missing' });
    }

    const { id, first_name, last_name } = req.body.user;

    return chatkit.createUser({
        id,
        name: `${first_name} ${last_name}`,
    })
    .then(response => {
        console.log('User created successfully');
        return res.send(response);
    }).catch((error) => {
        console.log('Create Chatkit User Error: ', error);
        return res.status(422).send({ error });
    });
};
