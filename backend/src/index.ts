import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL : string,
    JWT_SECRET: string,
  }
}>()

app.post('/api/v1/user/signup', async (c) => {
  const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
  const body = await c.req.json();
  try{

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })

    if(existingUser){
      return c.json({
        message: "Users already exists"
      }, 400)
    }

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: body.email,
        name: body.name,
      }
    })

    const jwt = await sign({id: newUser.id}, c.env.JWT_SECRET);

    return c.json({
      jwt,
      message: "User has signed up successfully",
    });
  }
  catch(e){
    console.error(e);
    c.status(403);
    return c.json("Error while signing up");
  }
})

app.post('/api/v1/user/signin', async (c) => {
  const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate());
  const body = await c.req.json();
  try{
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      }
    })

    if(!existingUser){
      c.status(403);
      return c.json({
        message: "User does not exist, create an account",
      })
    }

    const jwt = await sign({id: existingUser.id}, c.env.JWT_SECRET);
    return c.json({
      jwt, 
      message: "User has logged in successfully", 
    });
  }
  catch(e){
    console.error(e);
    return c.json({
      message: "Error while sign in up",
    })
  }
})

app.post('/api/v1/blog', (c) => {
  return c.text("post blog");
})

app.put('/api/v1/blog', (c) => {
  return c.text("put blog");
})

app.get('/api/v1/blog:id', (c) =>{
  const id = c.req.param;
  console.log(id);
  return c.text("get blog by id");
})

app.get('/api/v1/blog/bulk', (c)=>{
  return c.text("get blog bulk");
})

export default app
