import express from 'express';
import { MongoClient } from 'mongodb'

import { v4 as uuidv4} from 'uuid';
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

let uri = process.env.MONGO_URL;
uri = `${uri}`;

import { RequestHandler, response } from 'express';

import Joi from 'joi';
import { User } from '../model/user.interface';

// import middleware from '../middleware/joi-validate';

// const schemas = require('../validate/user.schema')

const createPayload = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required()
})


export const createUser:RequestHandler = async(req, res, next) => {

    // await middleware(schemas)
    // const {error , value} = await schemas.user.validate(req.body);

    const autoGenId = uuidv4();

    const { error, value } = createPayload.validate(req.body);

    if(error) {
      return res.status(400).send({
        "status": "payload is some require fields"
      });
    }
  
    const user = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('nextzy').collection('user').insertOne({
      id: autoGenId,
      login: user.login,
      password: btoa(user.password),
      createdDate: new Date().valueOf()
    });
    await client.close();
    return res.status(201).send({
      "status": "ok",
      "message": "User with ID = "+ autoGenId +" is created",
      "user": user
    });
};

export const getAllUser:RequestHandler = async(req, res, next) => {
  const client = new MongoClient(uri);
  await client.connect();
  let data = await client.db('nextzy').collection('user').find({}).toArray();
  await client.close();
  console.log('array data user before is' , data);
  if(data.length > 0) {
    for(let i = 0; i < data.length; i++) {
      if(data[i]?.password) {
        delete data[i].password;
      }
    }
    console.log('array data user after is' , data);
    res.status(200).send({
      "status": "success",
      "message": "id have data",
      "count": data.length,
      "data": data
    });
  } else {
    res.status(500).send({
      "status": "success",
      "message": "not have data",
      "data": []
    });
  }
};

export const getUserById:RequestHandler = async(req, res, next) => {
  const parmas: any = req.params;
  const chkReg = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  console.log(parmas, ' < params is')
  if(!chkReg.test(parmas?.id)) {
    return res.status(400).json({"error": 'userId is invalid (not uuid)'});
  }

  const client = new MongoClient(uri);
  await client.connect();
  await client.db('nextzy').collection('user').findOne({
    id: parmas?.id
  }).then(async(resp) => {
    if(resp) {
      if(resp?.password) {
        delete resp.password;
      }
      await client.close();
      res.status(200).send({
        "status": "success",
        "message": "id have data",
        "data": resp
      });
    } else {
      await client.close();
      res.status(404).send({
        "status": "success",
        "message": "id doesn't exist",
        "reqId": parmas?.id
      });
    }
  }).catch(async(err) => {
    await client.close();
    return res.status(500).send({
      "status": "fail",
      "message": err,
      "reqId": parmas?.id
    });
  });
};


// export const updateUser: RequestHandler<{id: string}> = (req, res, next) => {

// };

export const deleteUser: RequestHandler = async(req, res, next) => {
  const parmas: any = req.params;
  const chkReg = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  console.log(parmas, ' < params is')
  if(!chkReg.test(parmas?.id)) {
    return res.status(400).json({"error": 'userId is invalid (not uuid)'});
  }

  const client = new MongoClient(uri);
  await client.connect();
  await client.db('nextzy').collection('user').findOne({
    id: parmas?.id
  }).then(async(resp) => {
    if(resp) {
      await client.db('nextzy').collection('user').deleteOne({
        id: parmas?.id
      }).then(async(resDel) => {
        if(resDel.deletedCount === 1) {
          await client.close();
          return res.status(204).send({
            "status": "success",
            "message": "delete record success",
            "data": resp
          });
        } else {
          await client.close();
          return res.status(404).send({
            "status": "success",
            "message": "id doesn't exist",
            "reqId": parmas?.id
          });
        }
      });
    } else {
      await client.close();
      return res.status(404).send({
        "status": "success",
        "message": "id doesn't exist",
        "reqId": parmas?.id
      });
    }
  }).catch(async(err) => {
    await client.close();
    return res.status(500).send({
      "status": "fail",
      "message": err,
      "reqId": parmas?.id
    });
  });
}

// function delFunc (data: any) {
//   return delete data.password;
// }

// app.get('/user', async(req, res) => {
//     const user = req.body;
//     const client = new MongoClient(uri);
//     const autoGenId = uuidv4();
//     await client.connect();
//     await client.db('nextzy').collection('user').insertOne({
//       id: autoGenId,
//       login: user.login,
//       password: user.password
//     });
//     await client.close();
//     res.status(200).send({
//       "status": "ok",
//       "message": "User with ID = "+ autoGenId +" is created",
//       "user": user
//     });
// })

// app.get('/user/:id', async(req, res) => {
//     const user = req.body;
//     const client = new MongoClient(uri);
//     const autoGenId = uuidv4();
//     await client.connect();
//     await client.db('nextzy').collection('user').insertOne({
//         id: autoGenId,
//         login: user.login,
//         password: user.password
//     });
//     await client.close();
//     res.status(200).send({
//         "status": "ok",
//         "message": "User with ID = "+ autoGenId +" is created",
//         "user": user
//     });
// })

// app.post('/user', async(req, res) => {
//   const user = req.body;
//   const client = new MongoClient(uri);
//   const autoGenId = uuidv4();
//   await client.connect();
//   await client.db('nextzy').collection('user').insertOne({
//     id: autoGenId,
//     login: user.login,
//     password: user.password
//   });
//   await client.close();
//   res.status(200).send({
//     "status": "ok",
//     "message": "User with ID = "+ autoGenId +" is created",
//     "user": user
//   });
// })

// app.delete('/user/:id', async(req, res) => {
//     const user = req.body;
//     const client = new MongoClient(uri);
//     const autoGenId = uuidv4();
//     await client.connect();
//     await client.db('nextzy').collection('user').insertOne({
//         id: autoGenId,
//         login: user.login,
//         password: user.password
//     });
//     await client.close();
//     res.status(200).send({
//         "status": "ok",
//         "message": "User with ID = "+ autoGenId +" is created",
//         "user": user
//     });
// })