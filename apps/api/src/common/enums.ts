export enum UserRole {
  SuperAdmin = 'super_admin',
  DealerAdmin = 'dealer_admin',
  DealerStaff = 'dealer_staff',
  Customer = 'customer'
}

export enum CarStatus {
  Draft = 'draft',
  Pending = 'pending',
  Published = 'published',
  Sold = 'sold',
  Rejected = 'rejected'
}

export enum LeadStatus {
  New = 'new',
  Contacted = 'contacted',
  Qualified = 'qualified',
  Won = 'won',
  Lost = 'lost'
}

export enum BookingStatus {
  Requested = 'requested',
  Confirmed = 'confirmed',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export enum BillingCycle {
  Monthly = 'monthly',
  Yearly = 'yearly'
}

