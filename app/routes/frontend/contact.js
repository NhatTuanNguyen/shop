var express = require('express');
var router = express.Router();
var contactModel = require(__path_models + 'contact');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

let linkIndex = '/contact';
var notify = require(__path_configs + 'notify');
const folderView = __path_views_frontend + 'pages/contact/';
const layoutfrontend = __path_views_frontend + 'frontend';

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render(`${folderView}index`, {
    layout: layoutfrontend,
  });
});

router.post('/save', (req, res) => {
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'nhattuannguyenuit@gmail.com',
      pass: 'tuan12c6'
    }
  }));

  let item = Object.assign(req.body);
  contactModel.saveItems(item).then(() => {
    req.flash('success', notify.ADD_SUCCESS_FEEDBACK, false);
    var mailOptions = {
      from: 'nhattuannguyenuit@gmail.com',
      to: 'nhattuannguyenuit@gmail.com',
      subject: 'have feedback',
      text: 'please check!',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.redirect(linkIndex);
  })
})

module.exports = router;
