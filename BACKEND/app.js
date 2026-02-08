import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app=express();

import cors from 'cors';
import connectDB from './db/db.js';

connectDB().catch(err => {
  console.error('MongoDB connection failed:', err.message);
  // App continues to run even if DB connection fails
});

// CORS configuration to allow credentials and requests from frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173','https://campus-bridge-nine.vercel.app/'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Security headers
app.use((req, res, next) => {
  // Prevent XSS attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';

app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  // Log error details (but don't expose sensitive info in production)
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  } else {
    console.error('❌ Error:', err.message);
  }
  
  // If it's an ApiError with statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      statusCode: err.statusCode
    });
  }
  
  // For other errors - don't expose internal error details in production
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message || 'Internal Server Error'
      : 'Internal Server Error',
    statusCode: 500
  });
});

export default app;
