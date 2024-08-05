import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";


export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>()

blogRouter.use(async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    const token = authHeader.split(" ")[1];
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if(user && typeof user.id === 'string'){
        c.set('userId', user.id);
        await next();
    }
    else{
        return c.json({
            message: "Error while authorization, or you are not signed up, please try again"
        })
    }
});

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate());
    const userId = c.get("userId");
    const body = await c.req.json();
    try {
        const newPost = await prisma.post.create({
            data: {
                title: body.title,
                content: body.title,
                authorId: userId,
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

blogRouter.get('/bulk', async (c)=>{
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL}).$extends(withAccelerate());
    try{
        const posts = await prisma.post.findMany({});
        return c.json({
            posts: posts,
            message: "posts found successfully"
        })
    }
    catch(e){
        console.error(e);
        return c.json({
            message: "Error while fetching all the posts, please try again",
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