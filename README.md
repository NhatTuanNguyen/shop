#ECOMMERCE- CLOTHING STORE

E-commerce shop with HTML, CSS, Jquery, NodeJS and MongoDB Template Admin: https://adminlte.io/themes/v3/ Template Shop: https://preview.themeforest.net/item/canvas-the-multipurpose-html5-template/full_screen_preview/9228123?_ga=2.135861943.701632395.1665030969-503712079.1634823383&_gac=1.46059990.1665030969.Cj0KCQjw1vSZBhDuARIsAKZlijRtWKKAjq6jLEELvG3EFuo0lyULhml4fFYq7FcVtP552QfhPR3JZ7MaAg0QEALw_wcB
## Development guide

The code consist of two main parts:

-   API backend: Written in NodeJS Express with database MongoDB
-   User Interface: Base on template [Coza Store](https://colorlib.com/wp/template/coza-store/), I myself rewrite UI in ReactJS with **Sass**.

## Build With

List major frameworks/libraries used to build the project:

-   API:
    -   express
    -   mongoose
    -   jsonwebtoken, crypto-js
    -   cloudinary, multer
    -   stripe
    -   nodemailer
-   Client UI:
    -   react
    -   react-router-dom v6, axios
    -   redux toolkit
    -   mui, styled-component, node-sass, fontawesome
    -   react-hook-form, yup
    -   react-select, react-date-picker, ckeditor
    -   react-slick, react-toastify
    -   stripe

## Getting Started

### Prerequisites

Use the package manager [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install project

### Installation

1. Clone the repo

```bash
    git clone https://github.com/hongocton0406/MERN_CozaStore.git
```

2. Install NPM packages

-   API:

```bash
    cd api & npm install
```

-   Client UI:

```bash
    cd client & npm install
```

3. Running

```
bash npm start
```

## Usage

When using the Payment with Strip, you must ensure that card number is _4242 4242 4242 4242_

## Contact

Email: [Nguyen Nhat Tuan](mailto:hongocton0406@gmail.com?subject=[Github])
