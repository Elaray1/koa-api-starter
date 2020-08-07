const supertest = require('supertest');

const server = require('app');
const db = require('tests/db');
const { WRITER } = require('tests/constants');
const assert = require('assert');
const writerSchema = require('./writer.schema');


const app = server.listen();
const writerService = db.createService(WRITER.COLLECTION, writerSchema);

const getWriterData = (rawWriterData = {}) => {
  const defaultWriterData = {
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
  return {
    ...defaultWriterData,
    ...rawWriterData,
  };
};

const validWriter = getWriterData();

const validWriter2 = getWriterData({
  _id: '2',
  firstName: 'Alex',
  lastName: 'Qwe',
});

const invalidWriter = getWriterData({
  firstName: 228,
  lastName: 322,
  age: 'Sanya',
});

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

const request = supertest.agent(app);

const updateWriter = async (writerData) => {
  const data = await request.get(`/writers/${validWriter._id}`).send(writerData);
  return data;
};

describe('/writers', async () => {
  beforeEach('add writer from DB', async () => {
    await writerService.create(validWriter);
  });

  it('should successfully return data of the created writer', async () => {
    await request.post('/writers/create')
      .send(validWriter2)
      .then((res) => {
        assert(res.body._id, validWriter2._id);
      });
  });

  it('should successfully return data of the writer by id', async () => {
    await request.get(`/writers/${validWriter._id}`)
      .send(validWriter)
      .expect(200)
      .then((res) => {
        assert(res.body._id, validWriter2._id);
      });
  });

  it('should return 400 status because of invalid writer data', async () => {
    await request.post('/writers/create')
      .send(invalidWriter)
      .expect(400)
      .then((res) => {
        assert(res.body.errors, {
          firstName: [
            '"firstName" must be a string',
          ],
          lastName: [
            '"lastName" must be a string',
          ],
          age: [
            '"age" must be a number',
          ],
        });
      });
  });

  it('should successfully remove writer', async () => {
    await request.delete(`/writers/${validWriter2._id}`)
      .expect(200)
      .then((res) => {
        assert(res.body._id, validWriter2._id);
      });
  });

  it('should successfully update writer', async () => {
    const response = updateWriter(validUpdateWriterData);
    response.expect(200)
      .then((res) => {
        assert(res.body._id, validWriter2._id);
        assert(res.body.firstName, validWriter2.firstName);
      });
  });

  it('should return 400 status because of invalid writer data', async () => {
    const response = updateWriter(invalidUpdateWriterData);
    response.expect(200)
      .then((res) => {
        assert(res.body.errors, {
          firstName: [
            '"firstName" must be a string',
          ],
          lastName: [
            '"lastName" must be a string',
          ],
          age: [
            '"age" must be a number',
          ],
        });
      });
  });

  afterEach('delete writer from DB', async () => {
    await writerService.remove({ _id: validWriter._id });
  });
});
