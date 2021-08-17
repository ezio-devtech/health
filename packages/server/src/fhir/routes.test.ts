import { Meta, Patient } from '@medplum/core';
import { randomUUID } from 'crypto';
import express from 'express';
import request from 'supertest';
import { initApp } from '../app';
import { loadTestConfig } from '../config';
import { closeDatabase, initDatabase } from '../database';
import { initTestAuth } from '../jest.setup';
import { initKeys } from '../oauth';
import { isOk } from './outcomes';
import { repo } from './repo';

const app = express();
let accessToken: string;
let testPatient: Patient;
let patientId: string;
let patientVersionId: string;

describe('FHIR Routes', () => {

  beforeAll(async () => {
    const config = await loadTestConfig();
    await initDatabase(config.database);
    await initApp(app);
    await initKeys(config);
    accessToken = await initTestAuth();

    const [outcome, patient] = await repo.createResource({
      resourceType: 'Patient',
      name: [{
        given: ['Alice'],
        family: 'Smith'
      }]
    });

    expect(isOk(outcome)).toBe(true);
    testPatient = patient as Patient;
    patientId = testPatient.id as string;
    patientVersionId = (testPatient.meta as Meta).versionId as string;
  });

  afterAll(async () => {
    await closeDatabase();
  });

  test('Create batch', async () => {
    const res = await request(app)
      .post(`/fhir/R4/`)
      .set('Authorization', 'Bearer ' + accessToken)
      .set('Content-Type', 'application/fhir+json')
      .send({ resourceType: 'Bundle', type: 'batch', entry: [] });
    expect(res.status).toBe(200);
  });

  test('Create resource', async () => {
    const res = await request(app)
      .post(`/fhir/R4/Patient`)
      .set('Authorization', 'Bearer ' + accessToken)
      .set('Content-Type', 'application/fhir+json')
      .send({ resourceType: 'Patient' });
    expect(res.status).toBe(201);
    const patient = res.body;
    const res2 = await request(app)
      .get(`/fhir/R4/Patient/` + patient.id)
      .set('Authorization', 'Bearer ' + accessToken)
    expect(res2.status).toBe(200);
  });

  test('Create resource invalid resource type', async () => {
    const res = await request(app)
      .post(`/fhir/R4/Patientx`)
      .set('Authorization', 'Bearer ' + accessToken)
      .set('Content-Type', 'application/fhir+json')
      .send({ resourceType: 'Patientx' });
    expect(res.status).toBe(400);
  });

  test('Read resource', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patient/${patientId}`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(200);
  });

  test('Read resource invalid UUID', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patient/123`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(400);
  });

  test('Read resource invalid resource type', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patientx/${patientId}`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(400);
  });

  test('Read resource not found', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patient/8a54c7db-654b-4c3d-ba85-e0909f51c12c`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(404);
  });

  test('Read resource history', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patient/${patientId}/_history`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(200);
  });

  test('Read resource history invalid UUID', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patient/123/_history`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(400);
  });

  test('Read resource history invalid resource type', async () => {
    const res = await request(app)
      .get(`/fhir/R4/xyz/${patientId}/_history`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(400);
  });

  test('Read resource version', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patient/${patientId}/_history/${patientVersionId}`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(200);
  });

  test('Read resource version invalid UUID', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patient/123/_history/${patientVersionId}`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(400);
  });

  test('Read resource version invalid version UUID', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patient/${patientId}/_history/123`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(400);
  });

  test('Read resource version invalid resource type', async () => {
    const res = await request(app)
      .get(`/fhir/R4/xyz/${patientId}/_history/${patientVersionId}`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(400);
  });

  test('Read resource version not found', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patient/${patientId}/_history/${randomUUID()}`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(404);
  });

  test('Update resource', async () => {
    const res = await request(app)
      .post(`/fhir/R4/Patient`)
      .set('Authorization', 'Bearer ' + accessToken)
      .set('Content-Type', 'application/fhir+json')
      .send({ resourceType: 'Patient' });
    expect(res.status).toBe(201);
    const patient = res.body;
    const res2 = await request(app)
      .put(`/fhir/R4/Patient/${patient.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ ...patient, active: true });
    expect(res2.status).toBe(200);
  });

  test('Update resource not modified', async () => {
    const res = await request(app)
      .post(`/fhir/R4/Patient`)
      .set('Authorization', 'Bearer ' + accessToken)
      .set('Content-Type', 'application/fhir+json')
      .send({ resourceType: 'Patient' });
    expect(res.status).toBe(201);
    const patient = res.body;
    const res2 = await request(app)
      .put(`/fhir/R4/Patient/${patient.id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(patient)
    expect(res2.status).toBe(304);
  });

  test('Update resource invalid', async () => {
    const res = await request(app)
      .put(`/fhir/R4/Patient/${patientId}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({});
    expect(res.status).toBe(400);
  });

  test('Update resource missing ID', async () => {
    const res = await request(app)
      .put(`/fhir/R4/Patient/${patientId}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ resourceType: 'Patient' });
    expect(res.status).toBe(400);
  });

  test('Update resource not found', async () => {
    const res = await request(app)
      .put(`/fhir/R4/Patient/${randomUUID()}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ resourceType: 'Patient' });
    expect(res.status).toBe(400);
  });

  test('Delete resource', async () => {
    const res = await request(app)
      .delete(`/fhir/R4/Patient/${patientId}`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(200);
  });

  test('Delete resource invalid UUID', async () => {
    const res = await request(app)
      .delete(`/fhir/R4/Patient/123`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(400);
  });

  test('Delete resource invalid resource type', async () => {
    const res = await request(app)
      .delete(`/fhir/R4/xyz/${patientId}`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(400);
  });

  test('Patch resource', async () => {
    const res = await request(app)
      .patch(`/fhir/R4/Patient/${patientId}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({});
    expect(res.status).toBe(200);
  });

  test('Search', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patient`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(200);
  });

  test('Search invalid resource', async () => {
    const res = await request(app)
      .get(`/fhir/R4/Patientx`)
      .set('Authorization', 'Bearer ' + accessToken);
    expect(res.status).toBe(400);
  });

  test('Validate create success', async () => {
    const res = await request(app)
      .post(`/fhir/R4/Patient/$validate`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ resourceType: 'Patient' });
    expect(res.status).toBe(200);
  });

  test('Validate create failure', async () => {
    const res = await request(app)
      .post(`/fhir/R4/Patient/$validate`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ resourceType: 'Patient', badProperty: 'bad' });
    expect(res.status).toBe(400);
  });

});
