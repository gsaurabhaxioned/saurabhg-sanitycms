import React, { useEffect, useState } from 'react';
import client from '../client';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "blog"]{
          "title": title.${currentLanguage},
          "slug": slug.current,
          "author": author->name,
          "mainImage": mainImage.asset->url
        }`;
        
        const result = await client.fetch(query);
        setBlogs(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [currentLanguage]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const query = `*[_type == "category"]{
          title
        }`;
        
        const result = await client.fetch(query);
        setCategories(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setSelectedCategory(null);
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
  };

  return (
    <div>
      <div>
        <h2>Filter by Category:</h2>
        <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Search" />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category.title}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      <div className="language-buttons">
        <h2>Language:</h2>
        <button onClick={() => handleLanguageChange('en')}>English</button>
        <button onClick={() => handleLanguageChange('fr')}>French</button>
      </div>
      <ul className="blog-list">
        {blogs.map((blog, index) => (
          <li key={index}>
            <h2>{blog.title}</h2>
            {blog.mainImage && <img src={blog.mainImage} alt={blog.title} width='300px' height='200px' />}
            {blog.author && <p>Published by: {blog.author}</p>}
            <Link to={`/blog-details/${blog.slug}`}>
              <button className='view-details'>View Details</button>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/blog-form">
        <button>Add your blog</button>
      </Link>
    </div>
  );
};

export default Blogs;