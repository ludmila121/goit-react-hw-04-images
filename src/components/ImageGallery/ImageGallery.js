import  React  from 'react';
import PropTypes from 'prop-types';
import {GalleryList} from '../ImageGallery/ImageGallery.styled';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';

const ImageGallery = ({ images, onOpenModal }) => (
  <GalleryList>
    {images.map(image => {
      const { id, webformatURL, tags } = image;
      return <ImageGalleryItem
          key={id}
          src={webformatURL}
          alt={tags}
          id={id}
          onOpenModal={onOpenModal} />
    })}
  </GalleryList>
);

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      webformatURL: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
    })
  )
};

export default ImageGallery;