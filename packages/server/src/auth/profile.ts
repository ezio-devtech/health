import { assertOk, badRequest, createReference, ProfileResource } from '@medplum/core';
import { Login, Project, Reference, User } from '@medplum/fhirtypes';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { invalidRequest, sendOutcome, systemRepo } from '../fhir';
import { getUserMemberships } from '../oauth';

export const profileValidators = [
  body('login').exists().withMessage('Missing login'),
  body('profile').exists().withMessage('Missing profile'),
];

export async function profileHandler(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendOutcome(res, invalidRequest(errors));
    return;
  }

  const [loginOutcome, login] = await systemRepo.readResource<Login>('Login', req.body.login);
  assertOk(loginOutcome, login);

  if (login.revoked) {
    sendOutcome(res, badRequest('Login revoked'));
    return;
  }

  if (login.granted) {
    sendOutcome(res, badRequest('Login granted'));
    return;
  }

  if (login.project || login.profile) {
    sendOutcome(res, badRequest('Login profile already set'));
    return;
  }

  // Find the membership for the user
  const memberships = await getUserMemberships(login?.user as Reference<User>);
  const membership = memberships.find((m) => m.id === req.body.profile);
  if (!membership) {
    sendOutcome(res, badRequest('Profile not found'));
    return;
  }

  // Get up-to-date project and profile
  const [projectOutcome, project] = await systemRepo.readReference<Project>(membership.project as Reference<Project>);
  assertOk(projectOutcome, project);

  const [profileOutcome, profile] = await systemRepo.readReference<ProfileResource>(
    membership.profile as Reference<ProfileResource>
  );
  assertOk(profileOutcome, profile);

  // Update the login
  const [updateOutcome, updated] = await systemRepo.updateResource({
    ...login,
    project: createReference(project),
    profile: createReference(profile),
    accessPolicy: membership.accessPolicy,
  });
  assertOk(updateOutcome, updated);

  res.status(200).json({
    login: login?.id,
    code: login?.code,
  });
}
