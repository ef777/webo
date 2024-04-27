const express = require('express');
const app = express();
const mysql = require('mysql');
const port = 3000;
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Ana Sayfa' });
});

app.get('/case', (req, res) => {
    res.render('case-page', { pageTitle: '' });
});
let dbConfig;
if (process.env.NODE_ENV === 'development') {
    dbConfig = {
        host: 'localhost',
        user: 'root',
        password: 'dde3',
        database: 'kurumsal'
        ,
        insecureAuth: true
    };
} else if (process.env.NODE_ENV === 'production') {
    dbConfig = {
        host: 'localhost',
        user: 'root',
        password: 'dde3',
        database: 'kurumsal'
        ,
        insecureAuth: true
    };
} else {
    // Varsayılan değerler veya hata işleme
    dbConfig = {
        host: 'localhost',
        user: 'root',
        password: 'dde3',
        database: 'kurumsal',
        insecureAuth: true

    };
}

// Sadece geliştirme modunda otomatik bağlantı yap
const connection = mysql.createConnection(dbConfig);

   

    connection.connect((err) => {
        if (err) {
            console.error('Veritabanına bağlanırken bir hata oluştu: ' + err.stack);
            return;
        }
        console.log('MySQL veritabanına başarıyla bağlandı.');
    });

    // Geliştirme veya test sırasında bağlantıyı kapatmak isterseniz:
    // connection.end();



app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor!`);
});
