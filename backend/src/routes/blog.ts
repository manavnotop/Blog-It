import { Hono } from "hono";

export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>()

blogRouter.post('/', (c) => {
    return c.text("post blog");
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