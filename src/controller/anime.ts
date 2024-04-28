import express from 'express';
import { MongoClient } from 'mongodb'

import { v4 as uuidv4} from 'uuid';
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

let uri = process.env.MONGO_URL;
uri = `${uri}`;

import { RequestHandler, response } from 'express';

import Joi from 'joi';

// import middleware from '../middleware/joi-validate';

// const schemas = require('../validate/user.schema')

const createPayload = Joi.object({
  name: Joi.string().allow(null, '').required(),
  year: Joi.string().allow(null, '').required(),
  studioId: Joi.string().allow(null, '').required()
})


export const createAnime:RequestHandler = async(req, res, next) => {

    // await middleware(schemas)
    // const {error , value} = await schemas.user.validate(req.body);

    const autoGenId = uuidv4();

    const { error, value } = createPayload.validate(req.body);

    if(error) {
      return res.status(400).send({
        "status": "payload is some require fields"
      });
    }
  
    const anime = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('nextzy').collection('anime').insertOne({
      id: autoGenId,
      name: anime.name,
      year: anime.year,
      studioId: anime.studioId,
      createdDate: new Date().valueOf()
    });
    await client.close();
    return res.status(201).send({
      "status": "ok",
      "message": "Studio with ID = "+ autoGenId +" is created",
      "anime": anime
    });
};

export const getAllAnime:RequestHandler = async(req, res, next) => {
  const client = new MongoClient(uri);
  await client.connect();
  const data = await client.db('nextzy').collection('anime').find({}).toArray();
  await client.close();
  if(data.length > 0) {
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

export const getAnimeById:RequestHandler = async(req, res, next) => {
  const parmas: any = req.params;
  const chkReg = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if(!chkReg.test(parmas?.id)) {
    return res.status(400).json({"error": 'animeId is invalid (not uuid)'});
  }

  const client = new MongoClient(uri);
  await client.connect();
  await client.db('nextzy').collection('anime').findOne({
    id: parmas?.id
  }).then(async(resp) => {
    if(resp) {
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


export const updateAnime: RequestHandler = async(req, res, next) => {
  const parmas: any = req.params;
  const chkReg = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if(!chkReg.test(parmas?.id)) {
    return res.status(400).json({"error": 'animeId is invalid (not uuid)'});
  }

  const client = new MongoClient(uri);
  await client.connect();
  await client.db('nextzy').collection('anime').findOneAndUpdate(
    { id: parmas?.id },
    {
      $set: {
        updateDate: new Date().valueOf()
      },
    },
    {
      upsert: true
    }
  ).then(async(resp) => {
    if(resp) {
      await client.close();
      return res.status(204).send({
        "status": "success",
        "message": "update record success",
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
  }).catch(async(err) => {
    await client.close();
    return res.status(500).send({
      "status": "fail",
      "message": err,
      "reqId": parmas?.id
    });
  });
};

export const deleteAnime: RequestHandler = async(req, res, next) => {
  const parmas: any = req.params;
  const chkReg = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  console.log(parmas, ' < params is')
  if(!chkReg.test(parmas?.id)) {
    return res.status(400).json({"error": 'animeId is invalid (not uuid)'});
  }

  const client = new MongoClient(uri);
  await client.connect();
  await client.db('nextzy').collection('anime').findOne({
    id: parmas?.id
  }).then(async(resp) => {
    if(resp) {
      await client.db('nextzy').collection('anime').deleteOne({
        id: parmas?.id
      }).then(async(resDel) => {
        await client.db('nextzy').collection('chapter').updateMany(
          { animeId: parmas?.id },
          {
            $set: {
              animeId: null
            },
          },
          {
            upsert: true
          }
        )
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