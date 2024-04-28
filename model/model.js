const connection_db = require('../db');


class referans {
    constructor(id, baslik, linkler_id, aciklama ,resimler_id) {
      this.id = id;
      this.baslik = baslik;
      this.linkler_id = linkler_id;
      this.aciklama = aciklama;
        this.resimler_id = resimler_id;
    }

    toJSON() {
      return {
        id: this.id,
        baslik: this.baslik,
        aciklama: this.aciklama,

        linkler_id: this.linkler_id,
        resimler_id: this.resimler_id

      };
    }
  }
  function json_to_model_Donustur(jsonVeri) {
    console.log(jsonVeri , 'ilk jsonVeri');
                                              
    const jsonum = JSON.parse(jsonVeri);
    console.log(jsonum , 'jsonum son');
    const referansdeger = new referans(1,jsonum.title, jsonum.description, jsonum.image, jsonum.link);
    console.log(referansdeger , 'referansdeger');

    return referansdeger;
  }
  function model_to_json_Donustur(referans_model) {
    const jsonum  = referans.toJSON(referans_model);
    return JSON.stringify(jsonum);
  }

  function tum_referans_json_getir() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM referanslar';
  
      connection_db.query(query, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
  
        const referanslar = results.map(row => new referans(row.id, row.baslik, row.linkler_id, row.aciklama, row.resimler_id));
        const referanslar_json = referanslar.map(referans => referans.toJSON()); // or model_to_json_Donustur(referans)
  
        resolve(referanslar_json);
      });
    });

  

}
  function eklesorgu(tablo, sutunlar, degerler) {
    const tableExistsQuery = `SHOW TABLES FROM kurumsal LIKE '${tablo}'`;
  const tableExistsResult =  connection_db.query(tableExistsQuery);

  if (tableExistsResult.length === 0) {
    // Table doesn't exist, create it
    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tablo} (
        id INT PRIMARY KEY AUTO_INCREMENT,
        baslik VARCHAR(255) NOT NULL,
        linkler_id INT,
        aciklama TEXT,
        resimler_id INT,
        FOREIGN KEY (linkler_id) REFERENCES linkler(id),
        FOREIGN KEY (resimler_id) REFERENCES resimler(id)
    )`;
    connection_db.query(createTableQuery);
    console.log(`Table '${tablo}' created successfully!`);
  }
    const sutunlarStr = sutunlar.join(', ');
    const sorguParametreleri = degerler.map(value => {
        if (typeof value !== 'string') {
          value = String(value); // Convert non-strings to strings
        }
        return `'${value.replace(/'/g, "\\'")}'`;
    });

  return `INSERT INTO ${tablo} (${sutunlarStr}) VALUES (${sorguParametreleri})`;
  }
  function referans_ekle(gel_ref_json) {
    return new Promise((resolve, reject) => {
      try {
        const refmodel = json_to_model_Donustur(gel_ref_json);
      //console.log(refmodel , 'refmodel');
      const tablo = 'referanslar';

      const sutunlar = Object.keys(refmodel);
      const degerler = Object.values(refmodel);
      const query = eklesorgu(tablo, sutunlar, degerler);

        console.log(query , 'query');
        connection_db.query(query, (err, result) => {
          if (err) {
            reject(err);
            console.error('Referanss ekleme sırasında bir hata oluştu:', err);
            return;
          }
          resolve(result.insertId);
          console.log('Referans eklendi:', result.insertId);
        });
      } catch (err) {
        console.error('Referans ekleme sırasında bir hata oluştu:', err);
        reject(err);
      }
      console.log('api end');
    });
  }
  module.exports = {
    referans,
    json_to_model_Donustur,
    model_to_json_Donustur,
    tum_referans_json_getir,
    referans_ekle,
  };