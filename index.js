// import express from "express"
const express = require("express");
const { buildSchema } = require("graphql");
const {graphqlHTTP} = require("express-graphql");

//Dummy data
var data = [{
    "id":"1",
    "isExpense": true,
    "label": "Movie",
    "cost": 300
}, {
    "id":"2",
    "isExpense": false,
    "label": "Salary",
    "cost": 20000
}, {
    "id":"3",
    "isExpense": true,
    "label": "Pizza",
    "cost": 500
},];

//Setting-up graphql
const schema = buildSchema(`
    type Query{
        items: [Item]!,
        item(id: ID!): Item!
    }
    type Item{
        id: ID!,
        isExpense: Boolean,
        label: String,
        cost: Int
    }
    input ItemInput{
        isExpense: Boolean,
        label: String,
        cost: Int
    }
    type Mutation{
        createItem(initData: ItemInput): Item,
        updateItem(newData:ItemInput, id:ID!): Item,
        deleteItem(id: ID!): Boolean
    }
`)

const resolver = {
    items: ()=>{
        return data;
    },
    item: ({id})=>{
        let obj;
        for (cur in data){
            if (data[cur].id === id+""){
                obj = data[cur];
            }
        }
        return obj;
    },
    createItem:({initData})=>{
        let id = data.length+1;
        let obj = {"id":id,...initData}
        data.push(obj);
        return obj;
    },
    updateItem:({newData, id})=>{
        let obj;
        for (cur in data){
            if (data[cur].id === id+""){
                // obj = data[cur];
                data[cur] = {id,...newData};
                obj = data[cur];
            }
        }
        return obj;
    },
    deleteItem:({id})=>{
        for (cur in data){
            if (data[cur].id === id+""){
                // data.pop(data[cur]);
                data.splice(cur,1);
                return true;
            }
        }
        return false;
    }
}

//Configuring express server
const app = express()
app.use(express.json())

app.get("/data", (req, res) => {
    res.send(JSON.stringify(data))
    // res.send()
})

app.post("/add", (req, res) => {
    data.push(req.body);
    console.log(req.body);
    res.send({})
})

app.use('/graphql',graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql:true
}))
app.listen(3000, () => console.log("Server started on http://localhost:3000/graphql"))

