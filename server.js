var express = require('express');
var express_graphql = require('express-graphql');
var {buildSchema} = require('graphql');


const cassandra = require('cassandra-driver');
const client = new cassandra.Client({
    contactPoints: ["127.0.0.1"],
    localDataCenter: 'datacenter1',
    keyspace: 'iqcloud'
});


// GraphQL schema
var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    },
    
        type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }
`);

var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deploymensdt',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 1,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'dipak',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },

];

var cass = function () {

    const query = 'SELECT * from iqcloud.panel_details limit 1';
// var data = client.execute(query)
//   .then(result => console.log('User with email %s', result.rows[0].imei));


    let userInfo = client.execute(query);
    Promise.all([userInfo])
        .then(values => {
                return values;
            });

};

var getCourse = function (args) {
    var id = args.id;
    return coursesData.filter(course => {

        var values = cass();
        console.log(values);

        if (values[0]) {
            gacode = values[0].rows[0].imei;
            console.log('sdkl');
            console.log(gacode);
        }
        return course.id === id;

    })[0];
};

var getCourses = function (args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
};


var updateCourseTopic = function ({id, topic}) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            console.log(course.topic);

            return course;
        }
    });
    console.log(23);
    console.log(coursesData.filter(course => course.id === id)[1]);
    console.log(coursesData.filter(course => course.id === id)[0]);

    return coursesData.filter(course => course.id === id) [0];
};

var root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));