import { randomUUID } from "crypto";
import { dataSource } from "../typeorm";
import { app } from "./app";
import { env } from "process";

dataSource.initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log('Server is running on port: ' + env.PORT)
      console.log('\x1b[4m\x1b[33m%s\x1b[0m', `Access at: ${env.API_URL}`);
      console.log('\x1b[36m%s\x1b[0m', `API docs avaliable at ${env.API_URL}/docs`)
    })
  })
  .catch((error) => {
    console.log('Error initializing data source: ' +error)
  })

  
