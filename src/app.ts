import express, { Application } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import simpleRoutes from './routes/simpleRoutes'
import privateRoutes from './routes/privateRoutes'

class App {
  public express: Application

  public constructor () {
    this.express = express()

    this.middlewares()
    this.database()
    this.routes()
  }

  private middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
  }

  private database (): void {
    mongoose.connect('mongodb://localhost:27017/compra_e_publicacao', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
      .catch(() => {
        console.log('error connecting to the database')
      })
  }

  private routes (): void {
    this.express.use(simpleRoutes)
    this.express.use(privateRoutes)
  }
}

export default new App().express
