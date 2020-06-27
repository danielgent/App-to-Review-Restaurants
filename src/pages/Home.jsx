import React from 'react';
import PropTypes from 'prop-types';

// TODO - move to /fixtures/ when sure what next

const restaurants = [
{
  id: '1',
  name: 'Steak House'
},
{
  id: '2',
  name: 'Jack\'s Diner'
}
]

// careful using known people!
const users = [
  {
    id: '1',
    email: 'john@example.com',
    avatarUrl: 'https://bit.ly/dan-abramov'    
  },
  {
    id: '1',
    email: 'john@example.com',
    avatarUrl: 'https://bit.ly/sage-adebayo'
  }
]

// TODO - copy paste lorem ipsum or real off the internet?
const reviews = [
  {
    id: '1',
    comment: 'Great place. Would go again',
    user: '1',
    restaurant: '1',
    rating: 5,
    reply: 'Thanks for the feedback'
  },
  {
    id: '2',
    comment: 'Could do better',
    user: '1',
    restaurant: '2',
    rating: 3,
    reply: 'Fair comment. Apologies'
  },
  {
    id: '3',
    comment: 'I love your steak. RRRR is the real deal!',
    user: '2',
    restaurant: '1',
    rating: 5,
    reply: null,
  },
  {
    id: '4',
    comment: 'Fantastic, I\'m totally blown away by Testimonial Generator.',
    user: '2',
    restaurant: '2',
    rating: 5,
    reply: 'Thanks. Come again'
  }
]

const Home = props => {
  return (
    <div>
      Home
    </div>
  );
};

Home.propTypes = {
  
};

export default Home;