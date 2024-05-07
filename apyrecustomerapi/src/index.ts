import { connectToMongoDB } from "./mongoose";
import { startServer } from "./server";
import {ApyreService} from "./services/apyre.service"
import {mockApyreService} from "./services/mockApyre.service"

// connectToMongoDB();
startServer();
// mockApyreService.sendMagicLink('mmedvedev20@gmail.com').then(result => console.log(result)).catch(e => {console.error(e)})
