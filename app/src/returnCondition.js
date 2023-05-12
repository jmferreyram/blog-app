import blogService from "./services/server";

export const returnCondition = (newFilter, blogs) => {

  const handleButton = (event) => {
    console.log(event.target.value);
    blogService.eliminateBlog(event.target.value);
  }

    if (newFilter.length > 2) {
      return (
        blogs.filter(blog => {
          return (blog.title.toLowerCase().search(newFilter.toLowerCase()) >= 0);
        })
        .map((blog) => <div 
        key = {blog.title}>Title: {blog.title} | Author: {blog.author} | Url: {blog.url} | Likes: {blog.likes}
        <button onClick = {console.log('delete')}>Delete</button>
        </div> )
      )
    };
    return (
      blogs.map((blog) => <div 
      key = {blog.title}>Title: {blog.title} | Author: {blog.author} | Url: {blog.url} | Likes: {blog.likes}
      <button onClick = {handleButton} value = {blog.id}>Delete</button>
      </div>)
      );
  };

  export default returnCondition;