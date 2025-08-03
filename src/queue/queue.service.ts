import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WithdrawalService } from '../withdrawal/withdrawal.service';

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  private queueUpdateInterval: NodeJS.Timeout;
  private queueProcessingInterval: NodeJS.Timeout;

  constructor(private readonly withdrawalService: WithdrawalService) {}

  onModuleInit() {
    // Start the scheduled tasks
    this.startScheduledTasks();
  }

  private startScheduledTasks() {
    // Update queue positions daily at 2 AM
    this.scheduleDailyQueueUpdate();
    
    // Process withdrawal queue every hour
    this.scheduleHourlyQueueProcessing();
  }

  private scheduleDailyQueueUpdate() {
    const now = new Date();
    const nextUpdate = new Date();
    nextUpdate.setHours(2, 0, 0, 0); // 2 AM
    
    // If it's past 2 AM today, schedule for tomorrow
    if (now.getHours() >= 2) {
      nextUpdate.setDate(nextUpdate.getDate() + 1);
    }
    
    const timeUntilUpdate = nextUpdate.getTime() - now.getTime();
    
    this.logger.log(`Scheduling daily queue update for ${nextUpdate.toISOString()}`);
    
    setTimeout(() => {
      this.updateQueuePositions();
      // Schedule the next daily update
      this.queueUpdateInterval = setInterval(() => {
        this.updateQueuePositions();
      }, 24 * 60 * 60 * 1000); // 24 hours
    }, timeUntilUpdate);
  }

  private scheduleHourlyQueueProcessing() {
    const now = new Date();
    const nextProcessing = new Date();
    nextProcessing.setMinutes(0, 0, 0); // Start of next hour
    nextProcessing.setHours(nextProcessing.getHours() + 1);
    
    const timeUntilProcessing = nextProcessing.getTime() - now.getTime();
    
    this.logger.log(`Scheduling hourly queue processing for ${nextProcessing.toISOString()}`);
    
    setTimeout(() => {
      this.processWithdrawalQueue();
      // Schedule the next hourly processing
      this.queueProcessingInterval = setInterval(() => {
        this.processWithdrawalQueue();
      }, 60 * 60 * 1000); // 1 hour
    }, timeUntilProcessing);
  }

  // Update queue positions (run daily at 2 AM)
  async updateQueuePositions() {
    this.logger.log('Starting daily queue position update...');
    
    try {
      await this.withdrawalService.updateQueuePositions();
      this.logger.log('Queue positions updated successfully');
    } catch (error) {
      this.logger.error('Failed to update queue positions:', error);
    }
  }

  // Process withdrawal queue every hour
  async processWithdrawalQueue() {
    this.logger.log('Processing withdrawal queue...');
    
    try {
      const pendingRequests = await this.withdrawalService.getWithdrawalQueueForProcessing();
      
      for (const request of pendingRequests) {
        // Process requests based on queue position and premium status
        if (request.user.isPremiumReviewer) {
          // Premium reviewers get priority
          this.logger.log(`Processing premium reviewer request: ${request.id}`);
          // Add your processing logic here
        } else {
          // Regular users processed in queue order
          this.logger.log(`Processing regular user request: ${request.id} (position: ${request.user.queuePosition})`);
          // Add your processing logic here
        }
      }
    } catch (error) {
      this.logger.error('Failed to process withdrawal queue:', error);
    }
  }

  // Manual trigger for queue position update
  async manualUpdateQueuePositions() {
    this.logger.log('Manual queue position update triggered...');
    await this.updateQueuePositions();
  }

  // Manual trigger for queue processing
  async manualProcessQueue() {
    this.logger.log('Manual queue processing triggered...');
    await this.processWithdrawalQueue();
  }

  // Cleanup intervals when service is destroyed
  onModuleDestroy() {
    if (this.queueUpdateInterval) {
      clearInterval(this.queueUpdateInterval);
    }
    if (this.queueProcessingInterval) {
      clearInterval(this.queueProcessingInterval);
    }
  }
} 