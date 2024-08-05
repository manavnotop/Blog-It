import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const body = await c.req.json();
    try{
      console.log("inside try");
      const newUser = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
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
      return c.text("Error while signing up");
    }
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate());
    const body = await c.req.json();
    try{
      const existingUser = await prisma.user.findFirst({
        where: {
          email: body.email,
          password: body.password,
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
      c.status(411);
      return c.json({
        message: "Error while sign in up",
      })
    }
})