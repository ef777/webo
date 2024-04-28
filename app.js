const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser'); // body-parser modülünü require et
const session = require('express-session'); // express-session modülünü require et

const connection_db = require('./db');
const model = require('./model/model');

const adminkul = [
    { username: 'admin', password: 'dde3' }
];
const references = [];
app.use(session({
    secret: 'allonsy',
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
connection_db.connect((err) => {
    if (err) {
        console.error('Veritabanına bağlanırken bir hata oluştu: ' + err.stack);
        return;
    }
    console.log('MySQL veritabanına başarıyla bağlandı.');
});
app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Ana Sayfa' });
});
app.get('/adminim', (req, res) => {
    res.render('admin', { loggedIn: req.session.loggedIn, username: req.session.username });
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const user = adminkul.find(user => user.username == username && user.password == password);
    if (user) {
        req.session.loggedIn = true;
        req.session.username = user.username;
        res.redirect('/adminim');
    } else {
        res.send('Hatalı kullanıcı adı veya şifre' + '<a href="/adminim">Geri dön</a>' );
    }
});

// Çıkış işlemi
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Çıkış işlemi sırasında bir hata oluştu:', err);
            res.sendStatus(500);
            return;
        }
        res.redirect('/adminim');
    });
});

app.get('/case', (req, res) => {
    res.render('case-page', { pageTitle: '' });
});

app.post('/add-reference', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    const { title, description, image, link } = req.body;
    console.log(title, description, image, link);

    const jsonData = {
        title: title,
        description: description,
        image: image,
        link: link
    };
    console.log(jsonData);
    
    const jsonString = JSON.stringify(jsonData);
    console.log(jsonString);
    
    try {
        model.referans_ekle(jsonString);
        console.log('bitti');
    } catch (error) {
        console.error('Hata:', error);
        res.sendStatus(500);
        return;
    }
    res.redirect('/adminim');
    
}); 

// Sadece geliştirme modunda otomatik bağlantı yap

   



    // Geliştirme veya test sırasında bağlantıyı kapatmak isterseniz:
    // connection.end();



app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor!`);
});


