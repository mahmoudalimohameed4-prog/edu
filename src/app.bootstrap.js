import dotenv from "dotenv";
dotenv.config();
import {
  AuthRouter,
  UserRouter,
  OtpRouter,
  AdminRouter,
  AdRouter,
  CategoryRouter,
  ChatRouter,
  FavoriteRouter,
  ItemRouter,
  OrderRouter,
  ReviewRouter,
  TypeRouter,
  NotificationRouter
} from './modules/index_modules.js'
import express from 'express'

import cors from 'cors'

/**
 * Bootstrap Function
 * Configures the Express application, middleware, and routes.
 */
const bootstrap = () => {
  const app = express()
  const port = process.env.PORT || 4000

  //global app middleware
  app.use(cors())
  app.use(express.json())
  app.use('/uploads', express.static('uploads'))


  //routing
  app.get('/', (req, res) => {
    return res.status(200).json({ msg: 'welcome to my Eduswap' })
  })

  //modules routing
  app.use('/auth', AuthRouter)
  app.use('/user', UserRouter)
  app.use('/otp', OtpRouter)
  app.use('/admin', AdminRouter)
  app.use('/ad', AdRouter)
  app.use('/category', CategoryRouter)
  app.use('/chat', ChatRouter)
  app.use('/favorite', FavoriteRouter)
  app.use('/item', ItemRouter)
  app.use('/order', OrderRouter)
  app.use('/review', ReviewRouter)
  app.use('/type', TypeRouter)
  app.use('/notification', NotificationRouter)


  app.use((req, res) => {
    return res.status(404).json({ msg: 'Route not found' })
  })

  // Return the configured express app instance for Vercel
  return app
}
export default bootstrap