const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = new Koa();

app.use(koaBody({
    includeUnparsed: true
}));

let db;

MongoClient.connect('mongodb://localhost:27017',{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((client) => {
    db = client.db('Testing');
});


router.post('/pets', async (ctx) => {

    const petInserted = await db.collection('Pets').insertOne(ctx.request.body);

    ctx.set('Content-Type','application/json');
    ctx.status = 201;
    ctx.body = {data:petInserted.ops[0]};

});

router.get('/pets', async (ctx) => {
    
    const pets = await db.collection('Pets').find().toArray();
   
    ctx.set('Content-Type','application/json');
    ctx.status = 200;
    ctx.body = {data:pets};

 });

 router.get('/pets/:petId', async (ctx, petId) => {
   
    const pet = await db.collection('Pets').findOne({_id: new ObjectId(ctx.params.petId)});
    
    ctx.set('Content-Type','application/json');
    ctx.status = 200;
    ctx.body = {data:pet};

});

router.put('/pets/:petId', async (ctx) => {

    await db.collection('Pets').updateOne({_id: new ObjectId(ctx.params.petId)},{
        $set:ctx.request.body
    });

    const pet = await db.collection('Pets').findOne({_id: new ObjectId(ctx.params.petId)});

    ctx.set('Content-Type','application/json');
    ctx.status = 200;
    ctx.body = {data:pet};
});

router.delete('/pets/:petId', async (ctx) => {

    await db.collection('Pets').deleteOne({_id: new ObjectId(ctx.params.petId)},{
        $set:ctx.request.body
    });

    ctx.set('Content-Type','application/json');
    ctx.status = 204;

});

app.use(router.routes());

app.listen(3000);

console.log('listening on port 3000');