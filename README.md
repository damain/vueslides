# vueslides
A HTML5 presentaton app created with VueJS. Write your slides in JSON!

This project was born from the need to have a faster, lighter weight presentation framework that is easier to markup than using html. And also to allow storing and rendering slides from a database(in the future).

The slide layout is very opinionated the titles are to the top and centered, the body of a slide with text and media is split equally with words always defaulting to the left of the slides and other media (videos, images, codepens, youtube )is always on the right or full width if no text content or lists are used on the page.

Checkout or download the project and run ```node install``` to install the dependencies (only vue at the moment)

The following keys activate functionality in the presentation
* o - overview mode shrinks the slides so you can see all multiple slides clicking on a slide in overview mode will go to that  slide
* g - brings up a prompt where you can enter the slide number you want to go to
* n - show the slide number on the slide
* b - fades out the slides to a blank screen
* left arrow - goes to previous slide
* right arrow  - goes to the next slide


The slides supports the following options. Only include the ones that you need for the slide
* title: the main title for the slide
* subtitle: a smaller title 
* background: can be given any valid css background and it will alter the slide background 
* content: displays content in paragraphs ( /n will give you a new paragraph)
* list: displays an unordered list on the slide
* image: places an image on the right of the slide or full width if no content or list is in the slide
* video: places a video on the right of the slide or full width if no content or list is in the slide
* youtube: embeds a youtube video on the right of the slide or full width if no content or list is in the slide
* pen: embeds a codepen on the right of the slide or full width if no content or list is in the slide

Your presentation is defined in a JSON file as follows
```
{
  "slides":[
  
    {
      "type": "normal",
      "title": "A main title for the slide",
      "subtitle": "A subtitle for the slide"
      "image":"images/HTML5_CSS_JavaScript.png",
      "content": `The main body of slide text goes here`,
      "list": [
        {"li":"Item 1"},
        {"li":"Item 2"},
        {"li":"Item 3"}
      ],
      "pen":{
        "user":"your username",
        "hash":"hash for your pen"
      },
      "youtube":"z6hQqgvGI4Y",
      "video": "videos/myvideo.mp4",
      "background": "gray",
     },
    { ... antother slide object
    }
  ]
}
```

TIPS: to get hot reloading while developing your presentation you can install budo. 
```npm install budo -g``` installs it globally
navigate to the folder with the index.js file and type in 
```budo index.js -live``` this spins up a dev server with hotreload activated

Because the presentation is defined in JSON it could be easily be extended to pull the slides from a database that can export json