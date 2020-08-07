const supertest = require('supertest');
const chai = require('chai');

const server = require('app');
const db = require('tests/db');
const { WRITER } = require('tests/constants');

const writerSchema = require('./writer.schema');


const app = server.listen();
const writerService = db.createService(WRITER.COLLECTION, writerSchema);
chai.should();

const validWriter = {
  _id: '1',
  firstName: 'Egor',
  lastName: 'Qwe',
  age: 12,
  books: [
    {
      id: '1',
      title: 'Elaray',
      genre: 'novel',
    },
    {
      id: '2',
      title: 'Elaray 2',
      genre: 'poem',
    },
    {
      id: '3',
      title: 'Elaray 3',
      genre: 'novel',
    },
  ],
};

const validWriter2 = {
  _id: '2',
  firstName: 'Alex',
  lastName: 'Qwe',
  age: 12,
  books: [
    {
      id: '1',
      title: 'Elaray',
      genre: 'novel',
    },
    {
      id: '2',
      title: 'Elaray 2',
      genre: 'poem',
    },
    {
      id: '3',
      title: 'Elaray 3',
      genre: 'novel',
    },
  ],
};

const invalidWriter = {
  firstName: 228,
  lastName: 322,
  age: 'Sanya',
};

const validUpdateWriterData = {
  firstName: 'qweqwe',
  lastName: 'zxczc',
  age: 123,
};

const invalidUpdateWriterData = {
  firstName: 123123123,
  lastName: 456456,
  age: 'Ky)',
};

describe('/writers', async () => {
  const request = supertest.agent(app);

  beforeEach('add writer from DB', async () => {
    await writerService.create(validWriter);
  });

  it('should successfully return data of the created writer', async () => {
    await request.post('/writers/create')
      .send(validWriter2)
      .expect((res) => {
        res.body._id = validWriter2._id;
      });
  });

  it('should successfully return data of the writer by id', async () => {
    await request.get(`/writers/${validWriter._id}`)
      .send(validWriter)
      .expect(200)
      .expect((res) => {
        res.body._id = validWriter._id;
      });
  });

  it('should return 400 status because of invalid writer data', async () => {
    await request.post('/writers/create')
      .send(invalidWriter)
      .expect(400);
  });

  it('should successfully remove writer', async () => {
    await request.delete(`/writers/${validWriter2._id}`)
      .expect(200)
      .expect((res) => {
        res.body._id = validWriter2._id;
      });
  });

  it('should successfully update writer', async () => {
    await request.put(`/writers/update/${validWriter._id}`)
      .send(validUpdateWriterData)
      .expect(200)
      .expect((res) => {
        res.body._id = validWriter2._id;
        res.body.firstName = validWriter2.firstName;
      });
  });

  it('should return 400 status because of invalid writer data', async () => {
    await request.put(`/writers/update/${validWriter._id}`)
      .send(invalidUpdateWriterData)
      .expect(400);
  });

  afterEach('delete writer from DB', async () => {
    await writerService.remove({ _id: validWriter._id });
  });
});
