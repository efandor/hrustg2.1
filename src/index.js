import './css/normalize.css';
import './css/style.scss';

window.onload = function () {
  document.body.classList.add('loaded--hiding');
  window.setTimeout(function () {
    document.body.classList.add('loaded');
    document.body.classList.remove('loaded--hiding');
  }, 1000);
}

const main = document.querySelector('main');
const comment = document.querySelector('.comment');
const posts = document.createElement('div');
const popUpWrapper = document.createElement('div');
const popUp = document.createElement('div');
const popUpButton = document.createElement('button');
const popUpMessage = document.createElement('span');

popUpWrapper.classList.add('popup-wrapper', 'hidden')
popUp.classList.add('popup');
popUpButton.classList.add('popup__close-button');
posts.classList.add('posts');
popUpButton.textContent = 'x';

popUp.append(popUpMessage);
popUp.append(popUpButton);
popUpWrapper.append(popUp);
document.body.append(popUpWrapper);
popUpButton.addEventListener('click', closePopup);

async function createPosts() {
  function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);

    return Math.round(rand);
  }

  const postsNumber = randomInteger(1, 5);

  for (let i = 0; i <= postsNumber; i++) {
    await getQuote();
  }
  
};

createPosts().then(() => {
  setHandlers();
});

main.prepend(posts);

function createPost(data) {
  const postClose = document.createElement('button');
  const post = document.createElement('div');
  const postDate = document.createElement('span');
  const postContent = document.createElement('span');
  const postAuthor = document.createElement('span');
  const like = document.createElement('button');
  const bottomLine = document.createElement('div');

  postClose.className = 'post__close-button';
  post.className = 'post';
  postDate.className = 'post__date';
  like.className = 'post__like';
  postContent.className = 'post__content';
  postAuthor.className = 'post__author';
  bottomLine.className = 'post__bottom-line';

  postContent.textContent = data.content;
  postAuthor.textContent = data.author;

  postDate.textContent = getReadblePostDate(data.dateAdded)

  post.append(postClose);
  post.append(postContent);
  post.append(postAuthor);
  bottomLine.append(like);
  bottomLine.append(postDate);
  post.append(bottomLine);
  posts.append(post);
}

async function getQuote() {  
  const url = `https://api.quotable.io/random`;
  const quote = await fetch(url);
  const data = await quote.json();

  createPost(data);
}

function showPopup(data) {
  if (data.author.length < 3) {
    popUpMessage.textContent = `Имя автора должно быть длиннее 3 букв`;
  } else {
    popUpMessage.textContent = `Цитата должна быть длиннее 5 букв`;
  }
  
  popUpWrapper.classList.toggle('hidden');
}

function closePopup() {
  popUpWrapper.classList.add('hidden');
}

function setHandlers() {
  posts.addEventListener('click', handlePosts);
  comment.addEventListener('click', handleComment);

  function handlePosts(event) {
    if (event.target.classList[0] === 'post__like') {
      event.target.classList.toggle('post__like--active');
    }

    if (event.target.classList[0] === 'post__close-button') {
      event.target.parentNode.remove();
    }
  }

  function handleComment(event) {
    if (event.target.className !== 'comment__date') {
      event.preventDefault();
    }

    const data = {
      author: comment.elements[0].value,
      content: comment.elements[1].value,
      dateAdded: comment.elements[2].value || getReadblePostDate(new Date())
    };

    if (event.target.className.includes('comment__submit')) {
      if (data.author.length < 3 || data.content.length < 5) {
        showPopup(data);
      } else {
        createPost(data);

        for (let i = 0; i < comment.elements.length; i++) {
          comment.elements[i].value = '';
        }
      }

      if (window.popUp) {
        closePopup();
      }      
    }
  }
}

function getReadblePostDate(postDate) {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const quoteDate = new Date(postDate);
  const timeSincePosted = (date - quoteDate) / 1000;
  let dateString = null;

  if (timeSincePosted <= 48 * 60 * 60 && timeSincePosted >= 0) {
    dateString = date.getDay() !== quoteDate.getDay() ?
     `вчера, ${addZero(hours)}:${addZero(minutes)}` :
      `сегодня, ${addZero(hours)}:${addZero(minutes)}`;
  } else {
    dateString = postDate;
  }

  function addZero(time) {
    return time < 10 ? `0${time}` : time;
  }

  return dateString;
}
