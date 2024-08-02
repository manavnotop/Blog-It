import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/user/signup', (c) => {
  return c.text("post signup");
})

app.post('/api/v1/user/signin', (c) => {
  return c.text("post signin");
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
