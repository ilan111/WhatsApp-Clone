//imports
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'Pusher';
import cors from 'cors';

//app configs
const app = express();
const port = process.env.PORT || 9000;

/*
    Pusher is an API tool to make MongoDB
    a realtime database
*/
const pusher = new Pusher({
    appId: "1107702",
    key: "80d6b942f4d697d76363",
    secret: "87694d325a88f9e6c788",
    cluster: "eu",
    useTLS: true
  });

//middleware
app.use(express.json());
app.use(cors());

/*
    In case of not using 'cors'
    the function below can be used instead
    to set headers
*/

// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader("Access-Control-Allow-Headers","*");
//     next();
// });

//DB configs
const connection_url='mongodb+srv://admin:rOg1nmk5Y9tFh4Sp@cluster0.zmxyk.mongodb.net/whatsappDB?retryWrites=true&w=majority'

mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true
});

const db = mongoose.connection;

db.once('open',()=>{
    console.log("DB connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change',(change)=>{
        console.log("A change occured",change);

        if (change.operationType === "insert"){
            const messageDetails = change.fullDocument;
            pusher.trigger("messages","inserted",{
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            })
        }
        else{
            console.log("Error triggering pusher");
        }
    });
});

//API Routes
app.get('/',(req,res)=>res.status(200).send("Connection established successfully!"));

app.get('/messages/sync', (req,res)=>{
    Messages.find((err, data)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);
        }

      });
});

app.post('/messages/new', (req,res)=>{
    const dbMessage=req.body;

    Messages.create(dbMessage,(err, data)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(data);
        }

      });
});

//Listener
app.listen(port, ()=>console.log(`Listening on localhost:${port}`));