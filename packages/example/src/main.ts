import { PrismaClient, Prisma } from '@prisma/client'
import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

const app = express()
const prisma = new PrismaClient()

app.use(express.json())

interface LoginForm {
  email: string
  password: string
}

export const register = async ({ email, password }: LoginForm): Promise<object> => {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.users.create({
    data: { email, passwordHash }
  })
  return { id: user.id, email }
}

app.get('/', async (_req: Request, res: Response): Promise<void> => {
  const result = await prisma.$queryRaw(Prisma.sql`SELECT TIME()AS now;`)
  res.send(result)
})

app.post('/users', async (req: Request, res: Response): Promise<void> => {
  console.log(req.method, req.path, req.body)
  const users = await register({ email: req.body.email, password: req.body.password })
  res.json(users)
})

app.get('/users', async (_req: Request, res: Response): Promise<void> => {
  const users = await prisma.users.findMany({ select: { id: true, email: true } })
  res.json(users)
})

if (process.env.NODE_ENV !== 'test') {
  const port = process?.env?.PORT ?? '3000'
  app.listen(port, () => {
    console.log(`Server Running at ${port} 🚀`)
  })
}

export default app