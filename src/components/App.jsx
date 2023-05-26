import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import { AppContainer } from './App.styled';
import 'react-toastify/dist/ReactToastify.css';
import ImageGallery from './ImageGallery/ImageGallery';
import api, { countTotalResults }  from '../services/api-services';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import Searchbar from './Searchbar/Searchbar';
import 'index.css'

export default function App () {
   
  const[images, setImages] = useState([]);
   const[largeImage, setLargeImage]= useState ('');
   const [alt, setAlt] = useState('');
   const[searchName, setSearchName] = useState('');
    const[page, setPage] = useState(1);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   
   const isLastPage = useRef(true);

useEffect(() => {
  if (!searchName || !page) 
  return;

  (async function fetchImg() {
    setIsLoading(true);
    try{
      const data = await api.getImages(searchName, page);
      if (!data.hits.length){
        toast.error('Sorry, there are no images matching your search query. Please try again.');
        isLastPage.current = true;
        setIsLoading(false);
        return
      }
      isLastPage.current = countTotalResults(page) >= data.totalHits;
      setImages(p => [...p, ...data.hits]);
      setIsLoading(false);
    } catch (error){
      console.log(error);
      toast.error('Sorry, there are no images matching your search query. Please try again.');
    }
  })();
}, [searchName, page]);
  

  
const handleFormSubmit = newSearchName => {
  if (newSearchName === searchName) return;
  
  setSearchName(newSearchName);
  setPage(1);
  setImages([]);
  setIsModalOpen(false);
  setIsLoading(true);
};


const onLoadMore = () => {
  setPage(prev => prev + 1);
  setIsLoading(true);
};


const onOpenModal = id => {
  setIsModalOpen(true);
  setLargeImage(images.find(image => image.id === id).largeImageURL);
  setAlt(images.find(image => image.id === id).tags);
};

const onCloseModal = () => setIsModalOpen(false);

return (
  <AppContainer>
    <Searchbar onSubmit={handleFormSubmit} images={images} />
    {images.length > 0 && <ImageGallery images={images} onOpenModal={onOpenModal}/>}
    {isLoading ? (<Loader />) : (!isLastPage.current && <Button onClick={onLoadMore} />)}
    {isModalOpen && <Modal largeImageURL={largeImage} alt={alt} onCloseModal={onCloseModal} />}
    <ToastContainer autoClose={3000} />
  </AppContainer>
);
}