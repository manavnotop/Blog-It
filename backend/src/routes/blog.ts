import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";


export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())    
    const body = await c.req.json();
    try {
        const newPost = prisma.post.create({
            data: {
                title: body.title,
                content: body.title,
                //@ts-ignore
                authorId: useId,
            }
        })
        return c.json({
            message: "Post created successfully"
        })
    }
    catch(e){
        console.error(e);
        return c.json({
            message: "Error occurred while creating post, try again "
        })
    }
})
  
blogRouter.put('/', (c) => {
    return c.text("put blog");
})
  
blogRouter.get('/:id', (c) =>{
    const id = c.req.param;
    console.log(id);
    return c.text("get blog by id");
})
  
blogRouter.get('/bulk', (c)=>{
    return c.text("get blog bulk");
})