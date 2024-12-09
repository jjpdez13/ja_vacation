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
        url: 'https://example.com/spot1-image2.jpg',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/r30OhiA.jpeg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://example.com/spot2-image2.jpg',
        preview: false,
      }, 
      {
        spotId: 4, 
        url: 'https://i.imgur.com/ud7PxMD.jpeg',
        preview: true,
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/rtFo84t.jpeg',
        preview: true, 
      },
      {
        spotId: 5,
        url: 'https://i.imgur.com/Z5Hsu4t.jpeg',
        preview: true, 
      },
      {
        spotId: 6,
        url: 'https://i.imgur.com/VProwiJ.jpeg',
        preview: true, 
      },
      {
        spotId: 7,
        url: 'https://i.imgur.com/noGGr3P.jpeg',
        preview: true, 
      },
      {
        spotId: 8,
        url: 'https://i.imgur.com/YbNKVLL.jpeg',
        preview: true, 
      },
      {
        spotId: 9,
        url: 'https://i.imgur.com/hbsaaq9.jpeg',
        preview: true, 
      },
      {
        spotId: 10,
        url: 'https://i.imgur.com/PvoAzlb.jpeg',
        preview: true, 
      },
    ], options, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options, null, {});
  }
};

