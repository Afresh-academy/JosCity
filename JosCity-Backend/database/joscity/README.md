# JosCity Database Schema

This folder contains the PostgreSQL database schema for all pages in the JosCity platform (except Admin and NewsFeed).

## Database Setup

### Prerequisites

- PostgreSQL database server running
- Database named `joscity` created
- User with appropriate permissions

### Installation

1. Connect to your PostgreSQL database:

```bash
psql -U your_username -d joscity
```

2. Run the schema file:

```bash
\i schema.sql
```

Or from command line:

```bash
psql -U your_username -d joscity -f schema.sql
```

## Schema Overview

### Contact Page Tables

#### `contact_messages`

Stores contact form submissions from users.

**Key Fields:**

- `id` (UUID, Primary Key)
- `name`, `email`, `phone`, `subject`, `message`
- `status` (pending, read, replied, archived)
- `created_at`, `updated_at`, `replied_at`
- `reply_message` (for storing admin replies)

#### `contact_information`

Stores contact information displayed on the Contact page (phone, email, location).

**Key Fields:**

- `contact_type` (phone, email, location)
- `title`, `primary_value`, `secondary_value`
- `icon_color`, `icon_background`
- `is_active`, `display_order`

### Events Page Tables

#### `events`

Stores event information for the Events page.

**Key Fields:**

- `title`, `description`, `event_date`, `event_time`
- `end_date`, `end_time`, `location`, `venue`
- `image_url`, `event_type`, `status`
- `max_attendees`, `current_attendees`
- `ticket_price`, `ticket_currency`
- `registration_required`, `registration_deadline`
- `tags` (array)

#### `event_registrations`

Stores user registrations for events.

**Key Fields:**

- `event_id`, `user_id`
- `name`, `email`, `phone`
- `status` (pending, confirmed, cancelled, attended)
- `payment_status`, `payment_amount`, `payment_reference`
- `checked_in_at`

### Services Page Tables

#### `services`

Stores service information displayed on the Services page.

**Key Fields:**

- `service_key` (unique identifier)
- `title`, `description`
- `icon_color`, `icon_svg`
- `category`, `is_active`, `display_order`
- `service_url`, `requires_authentication`

#### `service_requests`

Stores service requests submitted by users.

**Key Fields:**

- `service_id`, `user_id`
- `request_type`, `description`
- `status` (pending, in_progress, completed, rejected, cancelled)
- `priority` (low, medium, high, urgent)
- `assigned_to`, `response`, `completed_at`

### Pricing Page Tables

#### `pricing_plans`

Stores membership pricing plans.

**Key Fields:**

- `plan_key` (unique: platinum, gold, silver, bronze)
- `name`, `price`, `currency`
- `billing_period` (monthly, yearly, one-time)
- `is_popular`, `is_active`, `display_order`

#### `pricing_plan_features`

Stores features for each pricing plan.

**Key Fields:**

- `plan_id`, `feature_name`
- `is_included`, `display_order`

#### `user_subscriptions`

Tracks user subscriptions to pricing plans.

**Key Fields:**

- `user_id`, `plan_id`
- `status` (active, cancelled, expired, pending)
- `start_date`, `end_date`, `auto_renew`
- `payment_status`

### Guidelines Page Tables

#### `guidelines`

Stores guideline/testimonial content.

**Key Fields:**

- `quote` (the guideline text)
- `author_name`, `author_role`
- `rating` (1-5 stars)
- `author_image_url`
- `is_active`, `display_order`

### Hero Page Tables

#### `hero_slides`

Stores hero section slides.

**Key Fields:**

- `title`, `subtitle`, `description`
- `image_url`, `image_alt`
- `slide_order`, `is_active`
- `link_url`, `link_text`, `button_text`

### Footer Page Tables

#### `footer_links`

Stores footer navigation links.

**Key Fields:**

- `link_text`, `link_url`
- `section` (quick_links, services, legal, social)
- `display_order`, `is_active`
- `opens_in_new_tab`

#### `footer_settings`

Stores footer configuration.

**Key Fields:**

- `logo_url`, `tagline`, `copyright_text`
- `social_media` (JSONB)

### Common Tables

#### `audit_logs`

Tracks all changes made to the database.

**Key Fields:**

- `table_name`, `record_id`
- `action` (INSERT, UPDATE, DELETE)
- `old_values`, `new_values` (JSONB)
- `user_id`, `ip_address`, `user_agent`
- `created_at`

## Features

### Automatic Timestamps

All tables with `updated_at` fields have triggers that automatically update the timestamp on row updates.

### UUID Primary Keys

All tables use UUIDs as primary keys for better scalability and security.

### Indexes

Appropriate indexes are created on frequently queried columns:

- Foreign keys
- Status fields
- Date fields
- Email addresses
- Search fields

### Referential Integrity

Foreign key constraints ensure data integrity:

- `event_registrations.event_id` → `events.id`
- `service_requests.service_id` → `services.id`
- `pricing_plan_features.plan_id` → `pricing_plans.id`
- `user_subscriptions.user_id` → `users.id`
- `user_subscriptions.plan_id` → `pricing_plans.id`

## Initial Data

The schema includes initial data for:

- Default pricing plans (Platinum, Gold, Silver, Bronze)
- Default pricing plan features

You can customize or add more data through the Admin Control Panel.

## API Integration

These tables are designed to work with the backend API controllers. Ensure your API routes are set up to interact with these tables accordingly.

## Notes

- The schema assumes a `users` table already exists (created elsewhere for authentication)
- All timestamps use `TIMESTAMP WITH TIME ZONE` for proper timezone handling
- Status fields use CHECK constraints to ensure valid values
- Soft deletes can be implemented by using status fields instead of hard deletes

## Maintenance

### Regular Tasks

1. Archive old contact messages
2. Clean up expired events
3. Update service availability status
4. Monitor audit logs for anomalies

### Backup

Ensure regular backups of the database, especially before schema changes.
