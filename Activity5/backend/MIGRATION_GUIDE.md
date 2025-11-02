# Migration Guide: SQLite to MongoDB & Swagger to Postman

This guide documents the migration from SQLite/TypeORM to MongoDB/Mongoose and from Swagger to Postman.

## Changes Made

### 1. Database Migration (SQLite → MongoDB)

#### Dependencies Updated
- **Removed**: `@nestjs/typeorm`, `typeorm`, `sqlite3`, `@nestjs/swagger`
- **Added**: `@nestjs/mongoose`, `mongoose`

#### Entity to Schema Conversion
All TypeORM entities have been converted to Mongoose schemas:

- `src/users/entities/user.entity.ts` → `src/users/schemas/user.schema.ts`
- `src/posts/entities/post.entity.ts` → `src/posts/schemas/post.schema.ts`
- `src/comments/entities/comment.entity.ts` → `src/comments/schemas/comment.schema.ts`

**Key Changes:**
- TypeORM decorators (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`) replaced with Mongoose decorators (`@Schema`, `@Prop`)
- Numeric IDs replaced with MongoDB ObjectIds (string format)
- Relationships now use virtuals and population instead of TypeORM relations
- Timestamps handled by Mongoose `timestamps: true` option

#### Module Updates
All modules updated to use `MongooseModule.forFeature()` instead of `TypeOrmModule.forFeature()`:
- `src/users/users.module.ts`
- `src/posts/posts.module.ts`
- `src/comments/comments.module.ts`
- `src/auth/auth.module.ts`

#### Service Updates
All services updated for MongoDB:
- Injected `Model<Document>` instead of TypeORM `Repository`
- Updated queries to use Mongoose methods (`find()`, `findById()`, `create()`, etc.)
- ID validation using `Types.ObjectId.isValid()`
- Population for related documents
- Aggregation pipelines for complex queries

#### Controller Updates
- Removed `ParseIntPipe` from route parameters
- Changed ID parameters from `number` to `string`
- All endpoints now accept MongoDB ObjectId strings

### 2. API Documentation Migration (Swagger → Postman)

#### Swagger Removal
- Removed all `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`, `@ApiQuery` decorators
- Removed `@ApiProperty` decorators from DTOs
- Removed Swagger setup from `src/main.ts`
- Uninstalled `@nestjs/swagger` package

#### Postman Collection Created
- **File**: `Blog_API_Postman_Collection.json`
- **Features**:
  - Complete API documentation with all endpoints
  - Authentication endpoints with auto-token capture
  - Request examples for all operations
  - Collection variables for baseUrl and authToken
  - Organized into folders: Authentication, Posts, Comments

### 3. Configuration Files

#### Environment Variables
- Created `.env.example` with MongoDB connection template
- Created `.env` with default local MongoDB configuration
- MongoDB URI: `mongodb://localhost:27017/blog-db`

#### Database Configuration
Updated `src/app.module.ts`:
```typescript
MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-db')
```

## Installation & Setup

### Prerequisites
1. **MongoDB**: Install MongoDB locally or use MongoDB Atlas
   - **Local**: Download from https://www.mongodb.com/try/download/community
   - **MongoDB Compass**: Download from https://www.mongodb.com/try/download/compass
   - **Atlas**: Create free cluster at https://www.mongodb.com/cloud/atlas

2. **Postman**: Download from https://www.postman.com/downloads/

### Installation Steps

1. **Install Dependencies**
   ```bash
   cd Activity5/backend
   npm install
   ```

2. **Configure MongoDB**
   - For local MongoDB: Ensure MongoDB is running on `localhost:27017`
   - For MongoDB Atlas: Update `.env` with your connection string
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-db
   ```

3. **Start the Application**
   ```bash
   npm run start:dev
   ```

4. **Import Postman Collection**
   - Open Postman
   - Click "Import" button
   - Select `Blog_API_Postman_Collection.json`
   - Collection will be imported with all endpoints

## Using MongoDB Compass

1. **Connect to Database**
   - Open MongoDB Compass
   - Connection string: `mongodb://localhost:27017`
   - Click "Connect"

2. **View Collections**
   - Database: `blog-db`
   - Collections: `users`, `posts`, `comments`

3. **Query Data**
   - Use the filter bar to query documents
   - Example: `{ "username": "johndoe" }`

## Using Postman Collection

### Authentication Flow
1. **Register User**
   - Endpoint: POST `/auth/register`
   - Token automatically saved to collection variable

2. **Login User**
   - Endpoint: POST `/auth/login`
   - Token automatically saved to collection variable

### Testing Endpoints
All authenticated endpoints automatically use the saved token from collection variables.

### Collection Variables
- `baseUrl`: API base URL (default: `http://localhost:3000`)
- `authToken`: JWT token (auto-populated after login/register)

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Posts
- `GET /posts` - Get all posts (with pagination)
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create post (auth required)
- `PATCH /posts/:id` - Update post (auth required)
- `DELETE /posts/:id` - Delete post (auth required)
- `POST /posts/:id/like` - Like post

### Comments
- `GET /posts/:postId/comments` - Get comments for post
- `POST /posts/:postId/comments` - Create comment (auth required)
- `PATCH /posts/:postId/comments/:id` - Update comment (auth required)
- `DELETE /posts/:postId/comments/:id` - Delete comment (auth required)

## Data Model Changes

### ID Format
- **Before**: Numeric IDs (1, 2, 3, ...)
- **After**: MongoDB ObjectIds (e.g., `507f1f77bcf86cd799439011`)

### Relationships
- **Before**: TypeORM relations with foreign keys
- **After**: MongoDB references with population

### Timestamps
- **Before**: `@CreateDateColumn()`, `@UpdateDateColumn()`
- **After**: Mongoose `timestamps: true` (creates `createdAt`, `updatedAt`)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- Verify network access (for Atlas)

### Missing Dependencies
```bash
npm install @nestjs/mongoose mongoose
```

### Port Conflicts
- Change PORT in `.env` if 3000 is in use

### Authentication Issues
- Ensure JWT_SECRET is set in `.env`
- Check token expiration
- Re-login to get fresh token

## Migration Checklist

- [x] Install MongoDB dependencies
- [x] Remove SQLite/TypeORM dependencies
- [x] Convert entities to Mongoose schemas
- [x] Update all modules for Mongoose
- [x] Update all services for MongoDB queries
- [x] Update controllers for string IDs
- [x] Remove Swagger decorators
- [x] Create Postman collection
- [x] Create environment configuration files
- [x] Test all endpoints

## Next Steps

1. Start MongoDB (local or Atlas)
2. Run `npm install` in backend directory
3. Start the application: `npm run start:dev`
4. Import Postman collection
5. Test endpoints using Postman
6. View data in MongoDB Compass

## Support

For issues or questions:
- Check MongoDB connection in Compass
- Verify all dependencies are installed
- Review console logs for errors
- Test endpoints in Postman with proper authentication
