const express= require('express');
const bodyParser= require('body-parser');
const mongoose=require('mongoose');// for mongodb

const { graphqlHTTP } = require('express-graphql');//middle ware
const {buildSchema} = require('graphql'); // destructure the buildSchema command
const Event=require('./models/event');

const app=express();

app.use(bodyParser.json());

app.use('/graphql',graphqlHTTP({
    //where can I find the schema and resolvers (config)
    //schema points to the schema for graphql, schema takes two rootkeywords, query and mutation for commands
    //rootValue points at a js object that has all the resolver functions in it
    //graphql uses types. Root Query bundles the endpoints for queries, RootMutation bundles all the endpoints for mutations
    //After the colon, you put the return types   events: [return types]
    // ! means it has to be that type, [String!] means it has to be a list of strings
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date:String!
        }

        type RootQuery {
            events: [Event!]!
        }
        type RootMutation{
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: ()=>{
            return Event.find().then(events=>{
                return events.map(event=>{
                    return{
                        ...event._doc, 
                        // _id:event._doc._id.toString(),
                        _id:event.id,
                    };
                })
            }).catch(err=>{throw err})
        },
        createEvent: (args)=>{
            const event= new Event({
                title: args.eventInput.title,
                description:args.eventInput.description,
                price:+args.eventInput.price,
                date:new Date(args.eventInput.date)
            });
            return event.save().then(result=>{
                console.log(result); return {...result._doc}
            }).catch(err=>console.log(err));
        }
    },// is a bundler for all the resolvers
    graphiql:true
}))
app.get('/',(req,res,next)=>{
    res.send('hello world')
})


mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
    }@cluster0.m3xlbwv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(()=>{
        console.log('connected to mongodb...')
        app.listen(3000);
    })
    .catch(err=>console.log(err))
