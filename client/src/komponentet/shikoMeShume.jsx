import React from 'react';
import bookCover from '../assets/img/bookcover.jpg';

const books = [
  {
    id: 1,
    image: bookCover,
    title: 'Banorii i Wildfell Hall',
    author: 'Anne Brontë',
    description: `Gilbert Markham është thellësisht i intriguar nga Helen Graham, një grua e re e bukur dhe e
    thjeshtë që është zhvendosur në Wildfell Hall aty pranë me djalin e saj të vogël. Ai shpejt e shpëton
    atë ...`,
    price: '30eur'
  },
  {
    id: 2,
    image: bookCover,
    title: 'Banorii i Wildfell Hall',
    author: 'Anne Brontë',
    description: `Gilbert Markham është thellësisht i intriguar nga Helen Graham, një grua e re e bukur dhe e
    thjeshtë që është zhvendosur në Wildfell Hall aty pranë me djalin e saj të vogël. Ai shpejt e shpëton
    atë ...`,
    price: '30eur'
  },
  {
    id: 3,
    image: bookCover,
    title: 'Banorii i Wildfell Hall',
    author: 'Anne Brontë',
    description: `Gilbert Markham është thellësisht i intriguar nga Helen Graham, një grua e re e bukur dhe e
    thjeshtë që është zhvendosur në Wildfell Hall aty pranë me djalin e saj të vogël. Ai shpejt e shpëton
    atë ...`,
    price: '30eur'
  },
  
];

const BookList = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#7B8E76] py-10">
        <div className="container mx-auto px-4">
          {books.map(book => (
            <div key={book.id} className="flex shadow-lg bg-[#BDC6BA] overflow-hidden mb-1 rounded-sm">
              <div className="mt-4 mb-4 ml-4" style={{  minWidth: '8rem', minHeight: '8rem', maxWidth: '10rem', maxHeight: '12rem' }}>
                <img src={book.image} alt={book.title} className="w-full h-full object-contain"/>
              </div>
              <div className="flex flex-col pt-4 w-full">
                <div className="flex justify-between items-start">
                  <h2 className="text-[#817E82] font-bold text-xl">{book.title}</h2>
                  <div className="text-[#817E82] font-bold text-xl pr-4">{book.price}</div>
                </div>
                <p className="text-[#0D78B4] text-lg mb-2"><span className='text-[#817E82]'>nga </span>{book.author}</p>
                <p className="text-[#817E82] text-base max-w-prose">{book.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
export default BookList;
