import React, {useState} from 'react'

export default function FormSubmitBlog (props) {

    const init_values = {
        title: '',
        author: '',
        url: '',
        likes: '',
      };
    
      const [newBlog, setNewBlog] = useState(init_values);

      const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        setNewBlog({
          ...newBlog,
          [name]: value,
        });
      }

      const handleSubmit = (event) => {
        event.preventDefault();
        const blog_filter = props.blogs.filter(blog => blog.title === newBlog.title);
        console.log(newBlog.title, blog_filter, blog_filter.length);
        let flag = true;
        const blogObject = {
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url,
            likes: newBlog.likes,
          }
    
        if (blog_filter.length > 0) {
          if (!window.confirm(`Quieres reemplazar el blog de ${newBlog.title}`)) {
            setNewBlog(init_values);
            return (alert(`${newBlog.title} se mantiene como esta`))
          } else {
            console.log('alohaaaaaaaaa');
            console.log('El id de la que voy a cambiar es ',blog_filter[0].id);
            console.log(newBlog);
            const blogTarget = blog_filter[0]
            
            props.UpdateBlog({blogObject, blogTarget, flag})
 
          }
          setNewBlog(init_values);
          return(null)
        }
    
        console.log(props.blogs);
        console.log(newBlog);

        props.CreateBlog({blogObject,flag});
        setNewBlog(init_values);
      }

    return (
    <form data-test-id='form-blog-id' onSubmit={handleSubmit}>
        Title:
        <input placeholder = 'Write your title' name = "title" onChange={handleChange} value = {newBlog.title}/>
        <br/>
        Author:
        <input placeholder = 'Write the Author' name = "author" onChange={handleChange} value= {newBlog.author} />
        <br/>
        Url:
        <input placeholder = 'Write the URL' name = "url" onChange={handleChange} value= {newBlog.url} />
        <br/>
        Likes:
        <input placeholder = 'Write the Likes' name = "likes" onChange={handleChange} value= {newBlog.likes} />
        <br/>
        <button type = 'submit' >add</button>
        <div>
        <button onClick={props.handleLogOut}>
            Cerrar Sesion
        </button>
        </div>
    </form>
      )
};