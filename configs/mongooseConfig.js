const mongoose = require('mongoose');

module.exports.mongooseConfig = (dbUrl) => {
    mongoose.set('useFindAndModify', false);

    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console.error, 'conection error:'));
    db.once('open', () => {
        console.log('Database connected');
    });
};
