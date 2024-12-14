//seeders spotImages
'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://i.imgur.com/ThesdHU.jpeg',
        preview: true,
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/qLF9P0m.jpeg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/QzTETnR.jpeg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/8IiMzSG.jpeg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://i.imgur.com/lQhXJY0.jpeg',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/r30OhiA.jpeg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/n3HEkjb.jpeg',
        preview: false,
      }, 
      {
        spotId: 2,
        url: 'https://i.imgur.com/mpmiB2M.jpeg',
        preview: false,
      }, 
      {
        spotId: 2,
        url: 'https://i.imgur.com/wqlg35C.jpeg',
        preview: false,
      }, 
      {
        spotId: 2,
        url: 'https://i.imgur.com/qSKmCFE.jpeg',
        preview: false,
      }, 
      {
        spotId: 4, 
        url: 'https://i.imgur.com/ud7PxMD.jpeg',
        preview: true,
      },
      {
        spotId: 4, 
        url: 'https://i.imgur.com/SF4SIk3.jpeg',
        preview: false,
      },
      {
        spotId: 4, 
        url: 'https://i.imgur.com/TDSSSHX.jpeg',
        preview: false,
      },
      {
        spotId: 4, 
        url: 'https://i.imgur.com/Dbl648L.jpeg',
        preview: false,
      },
      {
        spotId: 4, 
        url: 'https://i.imgur.com/OLxusvO.jpeg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/rtFo84t.jpeg',
        preview: true, 
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/11c5kSj.jpeg',
        preview: false, 
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/oePVSkX.jpeg',
        preview: false, 
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/cKgQ9RD.jpeg',
        preview: false, 
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/N9tPRj5.jpeg',
        preview: false, 
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/Z5Hsu4t.jpeg',
        preview: true, 
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/PBzyo4h.jpeg',
        preview: false, 
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/PdRZ5Xp.jpeg',
        preview: false, 
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/VL9elxb.jpeg',
        preview: false, 
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/Wvbg6EL.jpeg',
        preview: false, 
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/VProwiJ.jpeg',
        preview: true, 
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/hSHf5og.jpeg',
        preview: false, 
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/arVJ7Uq.jpeg',
        preview: false, 
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/AJY4YOJ.jpeg',
        preview: false, 
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/Rqs3sGu.jpeg',
        preview: false, 
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/noGGr3P.jpeg',
        preview: true, 
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/hJUbICq.jpeg',
        preview: false, 
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/U4WjKCz.jpeg',
        preview: false, 
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/l3WWAVD.jpeg',
        preview: false, 
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/RtUaQhN.jpeg',
        preview: false, 
      },
      {
        spotId: 8,
        url: 'https://i.imgur.com/YbNKVLL.jpeg',
        preview: true, 
      },
      {
        spotId: 8,
        url: 'https://i.imgur.com/llPpT3v.jpeg',
        preview: false, 
      },
      {
        spotId: 8,
        url: 'https://i.imgur.com/VdRAXAB.jpeg',
        preview: false, 
      },
      {
        spotId: 8,
        url: 'https://i.imgur.com/RYud7KS.jpeg',
        preview: false, 
      },
      {
        spotId: 8,
        url: 'https://i.imgur.com/Lu8jNEJ.jpeg',
        preview: false, 
      },
      {
        spotId: 9,
        url: 'https://i.imgur.com/hbsaaq9.jpeg',
        preview: true, 
      },
      {
        spotId: 9,
        url: 'https://i.imgur.com/D7WfajX.jpeg',
        preview: false, 
      },
      {
        spotId: 9,
        url: 'https://i.imgur.com/Vzwja8B.jpeg',
        preview: false, 
      },
      {
        spotId: 9,
        url: 'https://i.imgur.com/7ElY86u.jpeg',
        preview: false, 
      },
      {
        spotId: 9,
        url: 'https://i.imgur.com/zWBimYH.jpeg',
        preview: false, 
      },
      {
        spotId: 10,
        url: 'https://i.imgur.com/PvoAzlb.jpeg',
        preview: true, 
      },
      {
        spotId: 10,
        url: 'https://i.imgur.com/fOqLV1K.jpeg',
        preview: false, 
      },
      {
        spotId: 10,
        url: 'https://i.imgur.com/XHu7yE3.jpeg',
        preview: false, 
      },
      {
        spotId: 10,
        url: 'https://i.imgur.com/EsxwCjZ.jpeg',
        preview: false, 
      },
      {
        spotId: 10,
        url: 'https://i.imgur.com/xH9qYks.jpeg',
        preview: false, 
      },
    ], options, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options, null, {});
  }
};

