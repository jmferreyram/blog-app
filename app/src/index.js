import React, { useState , useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import FormSubmitLogin from './components/FormSubmitLogin.js';
import FormSubmitBlog from './components/FormSubmitBlog.js'
import blogService from './services/server.js';
import loginService from './services/login.js';
import './index.css';

const App = () => {

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogService.getAll()
    .then(response => setBlogs(response))
  },[])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogOut = () => {
    setUser(null)
    blogService.setToken(user.token)
    window.localStorage.removeItem('loggedNoteAppUser')
  }

  const [newFilter, setNewFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState('');

  const NotificationError = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  const NotificationSuccess = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="success">
        {message}
      </div>
    )
  }

  const Footer = () => {
    const footerStyle = {
      color: 'green',
      fontStyle: 'italic',
      fontSize: 16
    }
    return (
      <div style={footerStyle}>
        <br />
        <em>Note app, Department of Computer Science, University of Helsinki 2020</em>
      </div>
    )
  }

  const UpdateBlog = ({blogObject, blogTarget, flag}) => {
    
    blogService.update(blogTarget.id,blogObject)
    .then(returnBlogs => {
      setBlogs(blogs.map(blog => blog.id !== blogTarget.id ? blog : returnBlogs));
    })
    .catch(error => {
      setErrorMessage(
        `Blog '${blogObject.title}' was already removed from server`
      );
      flag = false;
      setBlogs(blogs.filter(n => n.id !== blogTarget[0].id));
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    })
    .then(response =>{
      if (flag) {
        alert(`${blogObject.title} fue modificado`)
      } else {
        alert(`${blogObject.title} no puede ser modificado`)
      }
    })
  }

  const CreateBlog = ({blogObject, flag}) => {
    blogService.create(
      blogObject)
      .then(promise => {
        setBlogs(blogs.concat(promise));
        setSuccessMessage(`Blog ${blogObject.title} creado`);
        setTimeout(()=>{
          setSuccessMessage(null)
        },5000)
      })
      .catch(error => {
        console.log(error.response.data.message)
        console.log('entro en el error que quiero')
        setErrorMessage(
          error.response.data.message.toString()
        );
        flag = false;
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      })
      .then(response =>{
        if (flag) {
          alert(`${blogObject.title} fue creado`)
        } else {
          alert(`${blogObject.title} no pudo ser creado`)
        }
      })
  }

  const handleFilter = (event) => {
    console.log(event.target.value);
    setNewFilter(event.target.value);
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const user = await loginService.login({
        userName,
        password
      })

      console.log(user);
      console.log(user.token);

      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token);
      setUser(user);
      setUserName('');
      setPassword('');

      setSuccessMessage("Login Success");
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000);


    } catch (error) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    }
  }
  

  const returnCondition = (newFilter, blogs) => {

    const handleButton = (event) => {
      
      if (window.confirm(`Realmente quieres eliminar el blog de ${event.target.name}`)) {
        
        console.log(event.target.value.toString());

        const blogsWithOutDelete = blogs.filter(blog => blog.id.toString() !== event.target.value.toString());
        console.log(blogsWithOutDelete);
        setBlogs(blogsWithOutDelete);
        blogService.eliminateBlog(event.target.value)
        .catch(error => {
          setErrorMessage(
            `Blog '${event.target.name}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          .setBlogs(blogs.filter(n => n.id.toString() !== event.target.value.toString()))
        });
      }
    }
  
    if (newFilter.length > 2) {
      return (
        blogs.filter(blog => {
          return (blog.title.toLowerCase().search(newFilter.toLowerCase()) >= 0);
        })
        .map((blog) => <li className='blog'
        key = {blog.title}>Title: {blog.title} | Author: {blog.author} | Url: {blog.url} | Likes: {blog.likes}
        <button onClick = {handleButton} value = {blog.id} name = {blog.title}>Delete</button>
        </li> )
      )
    };
    return (
      blogs.map((blog) => <li className='blog'
      key = {blog.title}>Title: {blog.title} | Author: {blog.author} | Url: {blog.url} | Likes: {blog.likes}
      <button onClick = {handleButton} value = {blog.id} name = {blog.title}>Delete</button>
      </li>)
      );
  };

  console.log(blogs);
  return (
    <div>
      <h1>Blogs JM</h1>

      <NotificationSuccess message={successMessage} />

      {
        user
        ? <p>{user.userName} Login</p>
        : null
      }
      
      {
        !user 
        ? <FormSubmitLogin 
            userName= {userName}
            password={password}
            handleUserNameChange={
              ({target}) => setUserName(target.value)}
            handlePasswordChange={
              ({target}) => setPassword(target.value)}
            handleLoginSubmit={handleLoginSubmit} 
          />
        : <FormSubmitBlog 
            CreateBlog= {CreateBlog}
            handleLogOut= {handleLogOut}
            UpdateBlog={UpdateBlog}
            blogs={blogs}
          /> 
      }

      <h2>Filter Title</h2>
      <input name = "filterTitle" onChange = {handleFilter} value = {newFilter}/>
      <br/>
      <h2>Add</h2>


      <NotificationError message={errorMessage} />
      <h1>Blogs</h1>
      <div>{returnCondition(newFilter, blogs)}</div>   
      <Footer/>   
    </div>
  )


}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);