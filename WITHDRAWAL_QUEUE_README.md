# Withdrawal Queue System Implementation

## Overview

This implementation adds a comprehensive withdrawal queue system to your NestJS backend, allowing users to request withdrawals that are processed in a fair queue order.

## Features Implemented

### 1. Database Schema Updates

- **User Table**: Added `queuePosition`, `isPremiumReviewer`, and `premiumReviewerDate` fields
- **WithdrawalRequest Table**: New table to track withdrawal requests with status tracking

### 2. API Endpoints

#### User Endpoints

- `GET /withdrawal/queue` - Get all pending withdrawal requests (admin)
- `GET /withdrawal/requests` - Get user's withdrawal requests
- `POST /withdrawal/requests` - Create a new withdrawal request
- `GET /withdrawal/queue-position` - Get user's current queue position

#### Admin Endpoints

- `POST /withdrawal/user/premium-reviewer` - Make user a premium reviewer
- `POST /withdrawal/requests/:id/approve` - Approve withdrawal request
- `POST /withdrawal/requests/:id/reject` - Reject withdrawal request
- `POST /withdrawal/requests/:id/process` - Mark withdrawal as processed

#### Queue Management

- `POST /queue/update-positions` - Manually update queue positions
- `POST /queue/process` - Manually trigger queue processing

### 3. Queue Processing Logic

- **Automatic Queue Updates**: Daily at 2 AM (using manual scheduling)
- **Queue Processing**: Every hour (using manual scheduling)
- **Priority System**: Premium reviewers get priority
- **Fair Queue**: Regular users processed by verification date and registration date

### 4. Error Handling

- Comprehensive error handling middleware
- Detailed logging for withdrawal operations
- Input validation and business logic checks

## Environment Variables

Add these to your `.env` file:

```env
# Withdrawal Queue System
WITHDRAWAL_MIN_AMOUNT=10.0
WITHDRAWAL_MAX_AMOUNT=1000.0
QUEUE_PROCESSING_INTERVAL=3600000
DAILY_QUEUE_UPDATE_TIME="02:00"

# Optional: Payment Processing
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_MODE="sandbox" # or "live"
```

## Installation Steps

### 1. Run Database Migration

```bash
npx prisma migrate dev --name add_withdrawal_queue_system
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

## Usage Examples

### Create Withdrawal Request

```bash
POST /withdrawal/requests
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "amount": 50.0
}
```

### Get User's Queue Position

```bash
GET /withdrawal/queue-position
Authorization: Bearer <jwt-token>
```

### Approve Withdrawal Request (Admin)

```bash
POST /withdrawal/requests/1/approve
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "notes": "Approved after verification"
}
```

## Queue Logic

### Queue Position Calculation

1. **Premium Reviewers**: Always get priority (no queue position)
2. **Regular Users**: Positioned by:
   - Verification date (earlier = better position)
   - Registration date (earlier = better position if same verification date)

### Processing Order

1. Premium reviewer requests (immediate processing)
2. Regular user requests (by queue position)
3. Requests within same position (by request date)

## Scheduling System

The system uses manual scheduling instead of cron decorators for better compatibility:

- **Daily Queue Updates**: Automatically scheduled to run at 2 AM
- **Hourly Processing**: Automatically scheduled to run every hour
- **Manual Triggers**: Available via API endpoints for immediate execution

## Security Features

- JWT authentication required for all endpoints
- Input validation for all withdrawal amounts
- Balance verification before creating requests
- One pending request per user limit
- Comprehensive error logging

## Monitoring

The system includes:

- Automatic daily queue position updates
- Hourly queue processing
- Detailed logging for all operations
- Error tracking and reporting

## Testing

Test the endpoints in this order:

1. Create a withdrawal request
2. Check queue position
3. Approve/reject requests (admin)
4. Test queue processing
5. Verify balance updates

## Notes

- The migration will add new fields to existing users without affecting their data
- Queue positions are automatically calculated daily
- Premium reviewers bypass the queue entirely
- All withdrawal amounts are deducted from balance immediately upon request creation
- The system uses manual scheduling for better Node.js compatibility
