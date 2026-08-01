# Data Models

## Description

This backend uses Mongoose schemas to persist plan, subscription, payment, and VPS data in MongoDB.

## Plan Model

### Collection

- `plans`

### Fields

- `name`: required string
- `price`: required number
- `description`: optional string with default `""`
- `featured`: optional boolean with default `false`
- `cpu`: required number
- `memory`: required number
- `storage`: required number
- `maxVps`: required number
- `features`: array of strings
- timestamps: `createdAt`, `updatedAt`

## Subscription Model

### Collection

- `subscriptions`

### Fields

- `userId`: required string, indexed
- `planId`: required ObjectId reference to `Plan`
- `status`: enum of `active`, `expired`, `cancelled`, `pending`; default `pending`
- `expiresAt`: required date
- timestamps: `createdAt`, `updatedAt`

## Payment Model

### Collection

- `payments`

### Fields

- `userId`: required string, indexed
- `planId`: required ObjectId reference to `Plan`
- `orderId`: required string, unique
- `paymentId`: optional string, unique
- `signature`: optional string
- `amount`: required number
- `currency`: default `INR`
- `status`: enum of `success`, `failed`, `pending`; default `success`
- `receipt`: optional string
- timestamps: `createdAt`, `updatedAt`

## VPS Model

### Collection

- `vps`

### Fields

- `userId`: required ObjectId reference to `User`
- `name`: required trimmed string
- `status`: enum of `creating`, `running`, `stopped`, `restarting`, `error`, `deleted`; default `creating`
- `os`: optional string, default `ubuntu:24.04`
- `container`: embedded container metadata including `id`, `name`, `image`, `port`, `internalIp`
- `resources`: embedded CPU, memory, and storage values
- `docker`: optional embedded Docker identifiers
- `lastStartedAt`: optional date
- `expiresAt`: optional date
- timestamps: `createdAt`, `updatedAt`

## Notes

The schemas are used directly by the services to read and write persistent state.