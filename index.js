const express = require('express');
const path = require('path');
const logger = require('morgan');
const multer = require('multer');
const cors = require('cors');
const upload = multer({ dest: "./public/uploads" });

const router = express.Router();
const port = 3003;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(cors());
const loggerMiddleware = (req, res, next) => {
    console.log(`${new Date()} [${req.method}] -- [${req.url}]`);
    next();
};

const fakeAuth = (req, res, next) => {
    let authStatus = true;
    if (authStatus) {
        console.log('User status', authStatus);
        next();
    } else {
        console.log("You are not authorized");
        res.status(401);
        throw new Error('User is not authorized');
    }
};

app.use(logger('combined'));

app.use('/api/user', router);

const getUser = (req, res) => {
    res.json({ message: "Get User" });
};

const createUser = (req, res) => {
    console.log('This Data Received From Client', req.body);
    res.json({ message: "Create user" });
};

router.use(fakeAuth);
router.route('/').get(getUser).post(createUser);

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case 401:
            res.json({
                title: 'Unauthorized',
                msg: err.message
            });
            break;
        case 404:
            res.json({
                title: 'Not Found',
                msg: err.message
            });
            break;
        case 500:
            res.json({
                title: 'Internal Server Error',
                msg: err.message
            });
            break;

        default:
            break;
    }
};
// app.post('/User-post',upload.fields())
app.post('/uploads', upload.single('image'),
    (req, res, next) => {
        console.log(req.file, req.body.text1);
        const responseData = [{
            file: req.file, text: req.body.text1
        }]
        res.send(responseData);
    }, (err, req, res, next) => {
        res.status(500).send({ error: err.message });
    }
);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.all('*', (req, res, next) => {
    const error = new Error('Route Not Found');
    error.status = 404;
    next(error);
});

app.use(loggerMiddleware);
app.use(errorHandler);

app.listen(port, () => {
    console.log('Listening on port', port);
});
