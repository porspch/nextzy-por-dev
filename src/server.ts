import express, {Request, Response, NextFunction} from "express";
import 'dotenv/config'
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from 'cors';

console.log('hello');

const app = express();
app.use(cors());
app.use(helmet()); 
app.use(bodyParser.json()); 
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.json({result: "ok"})
})

// routes
import userRoutes from './routes/user';
import chapterRoutes from './routes/chapter';
import studioRoutes from './routes/studio';
import animeRoutes from './routes/anime';

app.use('/user', userRoutes);
app.use('/chapter', chapterRoutes);
app.use('/studio', studioRoutes);
app.use('/anime', animeRoutes);

///////////////

app.listen(port, () => {
    console.log('Server is running port is' , port);
})

// default error handling middleware
app.use((err: Error, req: Request, res:Response, next: NextFunction) => {
    res.status(500).json({message: err.message});
});