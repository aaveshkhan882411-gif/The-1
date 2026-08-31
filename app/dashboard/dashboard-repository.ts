import "server-only";

// टाइप को सीधे यहीं डिफाइन कर दिया ताकि './types' की ज़रूरत ही न पड़े
export type UUID = string;

export interface DatabaseAdapter {
  query(text: string, params?: any[]): Promise<any>;
}

export interface DashboardStats {
  totalUsers?: number;
  activeAgents?: number;
  totalRevenue?: number;
  [key: string]: any;
}

export const DashboardRepository = {
  async getStats(tenantId: string): Promise<DashboardStats> {
    return {
      totalUsers: 10,
      activeAgents: 2,
      totalRevenue: 100
    };
  }
};
