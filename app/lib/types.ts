// User Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  country: string;
  timezone: string;
  preferred_currency: string;
  subscription_tier: 'free' | 'pro' | 'business' | 'enterprise';
  created_at: string;
}

// Account Types
export interface ConnectedAccount {
  id: string;
  user_id: string;
  provider: 'plaid' | 'truelayer' | 'tink' | 'manual';
  account_name: string;
  institution_name: string;
  account_mask: string;
  currency: string;
  balance: number;
  last_sync_at: string;
  is_active: boolean;
}

// Transaction Types
export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  merchant_id?: string;
  merchant_name: string;
  merchant_category?: string;
  amount: number;
  currency: string;
  description?: string;
  transaction_type: string;
  status: 'pending' | 'posted' | 'declined';
  transaction_date: string;
  created_at: string;
  is_duplicate: boolean;
  is_subscription: boolean;
  is_flagged_as_fraud: boolean;
}

// Analysis Types
export interface TransactionAnalysis {
  id: string;
  transaction_id: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  fraud_probability: number;
  risk_factors: RiskFactor[];
  ai_explanation?: string;
  ai_recommendation: string;
  analyzed_at: string;
}

export interface RiskFactor {
  factor: string;
  score: number;
  weight: number;
  explanation: string;
}

// Merchant Types
export interface Merchant {
  id: string;
  name: string;
  country?: string;
  website?: string;
  industry_category?: string;
  logo_url?: string;
  fraud_report_count: number;
  reputation_score?: number;
  risk_level: 'unknown' | 'low' | 'medium' | 'high';
}

// Dispute Types
export interface Dispute {
  id: string;
  user_id: string;
  transaction_id: string;
  dispute_type: string;
  dispute_reason: string;
  status: 'draft' | 'submitted' | 'under_review' | 'resolved' | 'closed';
  dispute_amount: number;
  created_at: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  topic: string;
  created_at: string;
  updated_at: string;
}
