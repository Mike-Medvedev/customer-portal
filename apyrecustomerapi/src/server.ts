"use strict";
import bodyParser from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import {mockApyreService} from "./services/mockApyre.service"
import { mockApyreTokenMiddleware } from "./middleware/mockApyre-token.middleware";
import * as jose from 'jose';
import * as fs from 'fs';
import * as crypto from 'crypto';



dotenv.config();

const apiKey = process.env.APYRE_PRIVATE_KEY as string;
const base_uri = "http://127.0.0.1:5001/apyre-dev/us-central1";
// const privateKey: string = fs.readFileSync('/Users/michaelmedvedev/Coding/keys/keyfile.pem', 'utf8');
// const publicKey: string = fs.readFileSync('/Users/michaelmedvedev/Coding/keys/pubkeyfile.pem', 'utf8');
// console.log(publicKey)


const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Expose-Headers', 'x-access-token, refresh-token');
  next();
});
app.use(mockApyreTokenMiddleware);



function generateAccessToken(email: string): string {
  const privateKeyPEM: string = fs.readFileSync('/Users/michaelmedvedev/Coding/keys/keyfile.pem', 'utf8');
  const privateKey: crypto.KeyObject = crypto.createPrivateKey(privateKeyPEM);
  const payload = { email };


    return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: 10 });
}




app.post('/get-magic-link', (req: Request, res: Response) => {
  const { email } = req.body;

  if (typeof email === 'string') {
    const token = generateAccessToken(email); //simulate token generated from main apyre server

    mockApyreService.sendMagicLink(email, token) //simulate magiclink generated and emailed from main apyre server, appended with email and token 
      .then(result => {

        res.json({ token });
      })
      .catch(e => {
        console.error(e);

        res.status(500).json({ error: 'An error occurred' });
      });
  } else {
    res.status(400).json({ error: 'Invalid email format' });
  }
});

app.post('/verify-magic-link', (req, res) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-token, refresh-token');
  const { code } = req.body
  const token = code as string;
  try {
    const payload = mockApyreService.verifyAccessToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Token not valid' });
    }
    res.status(200).json({ payload });
  } catch (error) {
    console.error('Error verifying access token:', error);
    res.status(401).json({ error: 'Unauthorized' }); 
  }
});

app.post('/exchange-magic-link', (req: Request, res: Response) => {
  try {
    const {code}  = req.body

    const payload = mockApyreService.verifyAccessToken(code);
    if (!payload) {
      return res.status(401).json({ error: 'Token not valid' });

    }
    const {token, refresh} = mockApyreService.exchangeMagicLinkCodeForTokens(code)
  
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-token, refresh-token');
    res.setHeader('x-access-token', token);
    res.setHeader('refresh-token', refresh);
    res.status(200).send({ payload })
  } catch (error) {
    console.error('Error verifying access token:', error);
    res.status(401).json({ error: 'Cant Exchange code for tokens' }); 
  }
 
})

app.post('/verify-token', (req: Request, res: Response) => {

  
  const accessToken = req.get('x-access-token');
  const refreshToken = req.get('refresh-token');


  if (!accessToken || !refreshToken) {
   
    return res.status(401).json({ error: 'Token not provideddddd', tokens: `current accessToken: ${accessToken}` });
  }

  try {
    
    const payload = mockApyreService.verifyAccessToken(accessToken)
    if(!payload){
      return res.status(401).json({ error: 'Token not valid or expired' });
    }
    res.setHeader('x-access-token', accessToken);
    res.setHeader('refresh-token', refreshToken);

    res.status(200).send({payload})
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
});

app.get('/refresh-token', (req: Request, res: Response) => {
  const refreshToken = req.get('refresh-token');
  if (!refreshToken) {
   
    return res.status(500).json({ error: 'Refresh Token not provided' });
  }
try {

  const newRefreshToken = mockApyreService.refreshToken(refreshToken);
  if(!newRefreshToken) {
    return res.status(500).json({error: 'New Refresh Token unsuccessful'})
  }
  res.setHeader('refresh-token', newRefreshToken);
  return res.status(200).json({success: 'Token Successfully Refreshed!'})
} catch (error) {
  console.error('Error refreshing token', error);
  return res.status(500).json({error: 'Internal server error'})
}
  
})

app.post('/menu', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  console.log('post request to menu');
  if(token) {
    if(mockApyreService.verifyAccessToken(token)){
      // mockApyreService.exchangeMagicLinkCodeForTokens(token)
      console.log('Access Verified and Authorized, let guard pass')
    }
    else {
      console.log('unauthorized access')
    }
  }
  else {
    console.error('error')
  }
})

app.post('/send-form-data', (req: Request, res: Response) => {
  console.log('HELLO THIS IS SEND FORM DATA')
  try {
    const formData = req.body;
    console.log('Received form data in backend:', formData);

    if(formData) {
      const baseuri = base_uri; 
      const API_KEY = apiKey; 
      const accessToken = req.headers['x-access-token']; //already part of request, dont need to take from headers
      
      if (!accessToken) {
        throw new Error('Access token not provided.');
      }

      const payload = {
        data: formData,
      };

   
      const config = {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'x-access-token': accessToken,
          'Content-Type': 'application/json',
        },
      };

      console.log('this payload is' + payload)


       //const response = await axios.post(`${base_uri}/send-form-data`, payload, config);

      res.status(200).json({payload});
    } else {
      throw new Error('Invalid form data; unable to send to API.');
    }
  } catch (error: any) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/get-test-data', (req, res) => {
  try {
    const data = fs.readFileSync('./data.json', 'utf8');
    res.status(200).json(JSON.parse(data));
  } catch (e: any) {
    res.status(500).send('Error: ' + e.message);
  }
});


export function startServer() {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
  