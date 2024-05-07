"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("./mongoose");
const server_1 = require("./server");
(0, mongoose_1.connectToMongoDB)();
(0, server_1.startServer)();
