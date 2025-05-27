# 🪄 Magic Pipeline - Setup & Installation Guide

## Quick Start Instructions

### 1. Install Dependencies
```bash
# Navigate to your project directory
cd /Users/tawfeeq/Business/LoopX/Technical/genudo/pipeline-visualizer-ai

# Install the additional dependencies we added
npm install @tanstack/react-query-devtools @supabase/supabase-js uuid

# Install type definitions
npm install --save-dev @types/uuid

# Verify all dependencies are installed
npm list --depth=0
```

### 2. Environment Setup
```bash
# Create your environment file
cp .env.example .env.local

# Edit .env.local with your actual Supabase credentials
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
```

### 3. Database Setup (Supabase)

Create these tables in your Supabase project:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pipelines table
CREATE TABLE pipelines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pipeline_name VARCHAR(255) NOT NULL,
  pipeline_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stages table
CREATE TABLE stages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE,
  stage_name VARCHAR(255) NOT NULL,
  stage_description TEXT,
  assigned_agent_id VARCHAR(100),
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pipelines
CREATE POLICY "Users can view own pipelines" ON pipelines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pipelines" ON pipelines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pipelines" ON pipelines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pipelines" ON pipelines
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for stages
CREATE POLICY "Users can view stages of own pipelines" ON stages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pipelines 
      WHERE pipelines.id = stages.pipeline_id 
      AND pipelines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert stages to own pipelines" ON stages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM pipelines 
      WHERE pipelines.id = stages.pipeline_id 
      AND pipelines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update stages of own pipelines" ON stages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM pipelines 
      WHERE pipelines.id = stages.pipeline_id 
      AND pipelines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete stages of own pipelines" ON stages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM pipelines 
      WHERE pipelines.id = stages.pipeline_id 
      AND pipelines.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_pipelines_user_id ON pipelines(user_id);
CREATE INDEX idx_stages_pipeline_id ON stages(pipeline_id);
CREATE INDEX idx_stages_position ON stages(position);
```

### 4. Running the Application

```bash
# Start the development server
npm run dev

# The application will be available at:
# http://localhost:5173
```

## 🎯 What You'll See

Your Magic Pipeline system now includes:

✅ **Interactive ReactFlow Canvas** - Drag and drop pipeline components  
✅ **AI Chat Interface (Nase7)** - Natural language pipeline creation  
✅ **Agent Management System** - Detailed AI agent profiles and capabilities  
✅ **Database Persistence** - All data saved to Supabase  
✅ **Real-time Updates** - Changes sync across the interface  
✅ **JSON Export** - Clean pipeline data for automation  
✅ **Beautiful UI** - Modern design with smooth animations  

## 🔧 Configuration Options

### Supabase Setup (Required for full functionality)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use existing one
3. Run the SQL schema above in the SQL Editor
4. Get your project URL and anon key from Settings > API
5. Update your `.env.local` file

### Without Supabase (Demo Mode)
The application will still work with static data if you don't configure Supabase. You'll see a warning message in the console, but all the visual features will function.

## 🎨 Key Features Explained

### AI Chat (Nase7)
- Natural language pipeline creation
- Intelligent intent recognition
- Real-time pipeline modification
- Contextual suggestions and help

### ReactFlow Integration
- Drag and drop node positioning
- Beautiful custom node designs
- Smooth animations and transitions
- Zoom, pan, and minimap controls

### Agent System
- 4 specialized AI agents (Aria, Clio, Ivy, Vee)
- Detailed capability profiles
- Performance metrics and analytics
- Click-to-view detailed modals

### Data Management
- React Query for intelligent caching
- Optimistic UI updates
- Background synchronization
- Error handling and retry logic

## 🚀 Next Steps

Once running, try these commands in the AI chat:
- "Create a SaaS sales pipeline"
- "Add a qualification stage after lead generation"
- "Show me pipeline templates"
- "Assign Aria to lead generation"

## 🛠️ Troubleshooting

### Common Issues:

1. **Import Errors**: Make sure all dependencies are installed
   ```bash
   npm install
   ```

2. **Supabase Connection**: Check your environment variables
   ```bash
   cat .env.local
   ```

3. **Build Errors**: Clear node_modules and reinstall
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **TypeScript Errors**: The application includes comprehensive type safety

## 📁 Project Structure

```
src/
├── components/
│   ├── magic-pipeline/           # Magic Pipeline components
│   │   ├── flow-nodes/          # Custom ReactFlow nodes
│   │   ├── ModernChatPanel.tsx  # AI chat interface
│   │   └── AgentDetailsModal.tsx # Agent detail modals
│   ├── ui/                      # Shadcn UI components
│   └── layout/                  # Layout components
├── integrations/
│   └── supabase/               # Database client setup
├── types/                      # TypeScript definitions
├── hooks/                      # Custom React hooks
└── pages/                      # Application pages
```

Your Magic Pipeline is now ready to transform sales processes with AI-powered automation! 🎉