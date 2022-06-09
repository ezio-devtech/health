import { LambdaClient } from '@aws-sdk/client-lambda';
import { Bot } from '@medplum/fhirtypes';
import express from 'express';
import request from 'supertest';
import { initApp } from '../../app';
import { loadTestConfig } from '../../config';
import { closeDatabase, initDatabase } from '../../database';
import { initKeys } from '../../oauth';
import { seedDatabase } from '../../seed';
import { initTestAuth } from '../../test.setup';

jest.mock('@aws-sdk/client-lambda', () => {
  const original = jest.requireActual('@aws-sdk/client-lambda');

  class LambdaClient {
    static created = false;
    static updated = false;

    async send(command: any): Promise<any> {
      if (command instanceof original.GetFunctionCommand) {
        if (LambdaClient.created) {
          return {
            Configuration: {
              FunctionName: command.input.FunctionName,
            },
          };
        } else {
          return Promise.reject(new Error('Function not found'));
        }
      }
      if (command instanceof original.GetFunctionConfigurationCommand) {
        return {
          FunctionName: command.input.FunctionName,
          Runtime: 'node16.x',
          Handler: 'index.handler',
          Layers: [
            {
              Arn: 'arn:aws:lambda:us-east-1:123456789012:layer:test-layer:1',
            },
          ],
        };
      }
      if (command instanceof original.CreateFunctionCommand) {
        LambdaClient.created = true;
        return {
          FunctionName: command.input.FunctionName,
        };
      }
      if (command instanceof original.UpdateFunctionCodeCommand) {
        LambdaClient.updated = true;
        return {
          FunctionName: command.input.FunctionName,
        };
      }
      if (command instanceof original.ListLayerVersionsCommand) {
        return {
          LayerVersions: [
            {
              LayerVersionArn: 'xyz',
            },
          ],
        };
      }
      return undefined;
    }
  }

  return {
    ...original,
    LambdaClient,
  };
});

const app = express();
let accessToken: string;

describe('Deploy', () => {
  beforeAll(async () => {
    const config = await loadTestConfig();
    await initDatabase(config.database);
    await seedDatabase();
    await initApp(app);
    await initKeys(config);
    accessToken = await initTestAuth();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(() => {
    (LambdaClient as any).created = false;
    (LambdaClient as any).updated = false;
  });

  test('Happy path', async () => {
    // Step 1: Create a bot
    const res1 = await request(app)
      .post(`/fhir/R4/Bot`)
      .set('Content-Type', 'application/fhir+json')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        resourceType: 'Bot',
        name: 'Test Bot',
        runtimeVersion: 'awslambda',
        code: `
        export async function handler() {
          console.log('input', input);
          return input;
        }
        `,
      });
    expect(res1.status).toBe(201);
    const bot = res1.body as Bot;

    // Step 2: Deploy the bot
    const res2 = await request(app)
      .post(`/fhir/R4/Bot/${bot.id}/$deploy`)
      .set('Content-Type', 'application/fhir+json')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({});
    expect(res2.status).toBe(200);
    expect((LambdaClient as any).created).toBe(true);
    expect((LambdaClient as any).updated).toBe(false);

    // Step 3: Update the bot
    const res3 = await request(app)
      .post(`/fhir/R4/Bot/${bot.id}/$deploy`)
      .set('Content-Type', 'application/fhir+json')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({});
    expect(res3.status).toBe(200);
    expect((LambdaClient as any).updated).toBe(true);
  });
});
