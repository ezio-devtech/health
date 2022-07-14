import { assertOk, createReference, resolveId } from '@medplum/core';
import { randomUUID } from 'crypto';
import express from 'express';
import { pwnedPassword } from 'hibp';
import fetch from 'node-fetch';
import request from 'supertest';
import { initApp } from '../app';
import { loadTestConfig } from '../config';
import { closeDatabase, initDatabase } from '../database';
import { systemRepo } from '../fhir';
import { initKeys } from '../oauth';
import { seedDatabase } from '../seed';
import { setupPwnedPasswordMock, setupRecaptchaMock } from '../test.setup';

jest.mock('hibp');
jest.mock('node-fetch');

const app = express();

describe('New patient', () => {
  beforeAll(async () => {
    const config = await loadTestConfig();
    await initDatabase(config.database);
    await seedDatabase();
    await initApp(app);
    await initKeys(config);
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    (fetch as unknown as jest.Mock).mockClear();
    (pwnedPassword as unknown as jest.Mock).mockClear();
    setupPwnedPasswordMock(pwnedPassword as unknown as jest.Mock, 0);
    setupRecaptchaMock(fetch as unknown as jest.Mock, true);
  });

  test('Patient registration', async () => {
    // Register as Christina
    const res1 = await request(app)
      .post('/auth/newuser')
      .type('json')
      .send({
        email: `christina${randomUUID()}@example.com`,
        password: 'password!@#',
        recaptchaToken: 'xyz',
      });
    expect(res1.status).toBe(200);

    const res2 = await request(app).post('/auth/newproject').type('json').send({
      login: res1.body.login,
      firstName: 'Christina',
      lastName: 'Smith',
      projectName: 'Christina Project',
    });
    expect(res2.status).toBe(200);

    const res3 = await request(app).post('/oauth2/token').type('form').send({
      grant_type: 'authorization_code',
      code: res2.body.code,
      code_verifier: 'xyz',
    });
    expect(res3.status).toBe(200);

    const projectId = resolveId(res3.body.project) as string;

    // Try to register as a patient in the new project
    // (This should fail)
    const res4 = await request(app)
      .post('/auth/newuser')
      .type('json')
      .send({
        email: `christina${randomUUID()}@example.com`,
        password: 'password!@#',
        recaptchaToken: 'xyz',
      });
    expect(res4.status).toBe(200);

    const res5 = await request(app).post('/auth/newpatient').type('json').send({
      login: res4.body.login,
      project: projectId,
      firstName: 'Peggy',
      lastName: 'Patient',
    });
    expect(res5.status).toBe(400);

    // As Christina, create a default access policy for new patients
    const res6 = await request(app)
      .post(`/fhir/R4/AccessPolicy`)
      .set('Authorization', 'Bearer ' + res3.body.access_token)
      .type('json')
      .send({
        resourceType: 'AccessPolicy',
        name: 'Default Patient Policy',
      });
    expect(res6.status).toBe(201);

    // As a super admin, enable patient registration
    const [updateOutcome, updatedProject] = await systemRepo.patchResource('Project', projectId, [
      {
        op: 'add',
        path: '/defaultPatientAccessPolicy',
        value: createReference(res3.body),
      },
    ]);
    assertOk(updateOutcome, updatedProject);

    // Try to register as a patient in the new project
    // (This should succeed)
    const res7 = await request(app).post('/auth/newpatient').type('json').send({
      login: res4.body.login,
      project: projectId,
      firstName: 'Peggy',
      lastName: 'Patient',
    });
    expect(res7.status).toBe(200);

    // Try to reuse the login
    // (This should fail)
    const res8 = await request(app).post('/auth/newpatient').type('json').send({
      login: res4.body.login,
      project: projectId,
      firstName: 'Reuse',
      lastName: 'Login',
    });
    expect(res8.status).toBe(400);

    // Try to register as a patient without a login
    // (This should fail)
    const res9 = await request(app).post('/auth/newpatient').type('json').send({
      project: projectId,
      firstName: 'Missing',
      lastName: 'Login',
    });
    expect(res9.status).toBe(400);
  });
});
