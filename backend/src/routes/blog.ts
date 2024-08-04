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
        const newPost = await prisma.post.create({
            data: {
                title: body.title,
                content: body.title,
                //@ts-ignore
                authorId: useId,
            }
        })
        return c.json({
            postId: newPost.id,
            message: "Post created successfully"
        })
    }
    catch(e){
        console.error(e);
        return c.json({
            message: "Error occurred while creating post, please try again "
        })
    }
})
  
blogRouter.put('/', async (c) => {
    const primsa = new PrismaClient({datasourceUrl: c.env.DATABASE_URL}).$extends(withAccelerate());
    const body = await c.req.json();
    try{
        const updatePost = await primsa.post.update({
            where: {
                id: body.id,
            },
            data:{
                title: body.title,
                content: body.content
            }
        })
        return c.json({
            id: updatePost.id,
            message: "Blog updated successfully",
        })
    }
    catch(e){
        console.error(e);
        return c.json({
            message: "Error while updating the blog, please try again", 
        })
    }
})
  
blogRouter.get('/:id', async (c) =>{
    const posstId = c.req.param('id');
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL}).$extends(withAccelerate());
    try{
        const getPost = await prisma.post.findFirst({
            where: {
                id: posstId,
            }
        })
        return c.json(getPost);
    }
    catch(e){
        console.error(e);
        return c.json({
            message: "Error while fetching the post, please try again"
        })
    }
})
  
blogRouter.get('/bulk', (c)=>{
    return c.text("get blog bulk");
})