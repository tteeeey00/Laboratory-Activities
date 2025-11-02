# Migration TODO: Swagger → Postman & SQLite → MongoDB

## Phase 1: Update Dependencies ✅
- [x] Update package.json to add MongoDB dependencies
- [x] Remove Swagger and SQLite dependencies
- [x] Install new dependencies

## Phase 2: Database Migration (SQLite → MongoDB) ✅
- [x] Create MongoDB schemas for User entity
- [x] Create MongoDB schemas for Post entity
- [x] Create MongoDB schemas for Comment entity
- [x] Update app.module.ts with Mongoose configuration
- [x] Update users.module.ts to use MongooseModule
- [x] Update posts.module.ts to use MongooseModule
- [x] Update comments.module.ts to use MongooseModule
- [x] Update auth.module.ts to use MongooseModule
- [x] Update auth.service.ts for MongoDB queries
- [x] Update auth/strategies/jwt.strategy.ts for MongoDB
- [x] Update posts.service.ts for MongoDB queries
- [x] Update posts.controller.ts for string IDs
- [x] Update comments.service.ts for MongoDB queries
- [x] Update comments.controller.ts for string IDs

## Phase 3: Remove Swagger ✅
- [x] Remove Swagger setup from main.ts
- [x] Remove Swagger decorators from auth.controller.ts
- [x] Remove Swagger decorators from posts.controller.ts
- [x] Remove Swagger decorators from comments.controller.ts
- [x] Remove @ApiProperty from register.dto.ts
- [x] Remove @ApiProperty from login.dto.ts
- [x] Remove @ApiProperty from create-post.dto.ts
- [x] Remove @ApiProperty from update-post.dto.ts
- [x] Remove @ApiProperty from create-comment.dto.ts
- [x] Remove @ApiProperty from update-comment.dto.ts

## Phase 4: Create Postman Collection ✅
- [x] Create Postman collection JSON file with all endpoints
- [x] Add environment variables for Postman
- [x] Add authentication examples with auto-token capture

## Phase 5: Configuration ✅
- [x] Create .env.example file
- [x] Create .env file with MongoDB URI
- [x] Update .gitignore to exclude database files
- [x] Create MIGRATION_GUIDE.md

## Phase 6: Testing 🔄
- [ ] Install dependencies (npm install)
- [ ] Start MongoDB (local or Atlas)
- [ ] Test MongoDB connection
- [ ] Test all endpoints with Postman
- [ ] Verify MongoDB Compass shows data correctly

---

## Summary of Changes

### Files Created:
- ✅ src/users/schemas/user.schema.ts
- ✅ src/posts/schemas/post.schema.ts
- ✅ src/comments/schemas/comment.schema.ts
- ✅ Blog_API_Postman_Collection.json
- ✅ .env.example
- ✅ .env
- ✅ MIGRATION_GUIDE.md

### Files Modified:
- ✅ package.json (dependencies updated)
- ✅ src/app.module.ts (MongoDB configuration)
- ✅ src/main.ts (Swagger removed)
- ✅ src/users/users.module.ts (MongooseModule)
- ✅ src/posts/posts.module.ts (MongooseModule)
- ✅ src/comments/comments.module.ts (MongooseModule)
- ✅ src/auth/auth.module.ts (MongooseModule)
- ✅ src/auth/auth.service.ts (MongoDB queries)
- ✅ src/auth/strategies/jwt.strategy.ts (MongoDB)
- ✅ src/posts/posts.service.ts (MongoDB queries)
- ✅ src/posts/posts.controller.ts (string IDs, no Swagger)
- ✅ src/comments/comments.service.ts (MongoDB queries)
- ✅ src/comments/comments.controller.ts (string IDs, no Swagger)
- ✅ src/auth/auth.controller.ts (no Swagger)
- ✅ All DTO files (removed @ApiProperty)
- ✅ .gitignore (added database files)

### Files to Remove (optional):
- src/users/entities/user.entity.ts (old TypeORM entity)
- src/posts/entities/post.entity.ts (old TypeORM entity)
- src/comments/entities/comment.entity.ts (old TypeORM entity)
- blog.db (SQLite database file)

---

## Next Steps

1. **Install Dependencies:**
   ```bash
   cd Activity5/backend
   npm install
   ```

2. **Start MongoDB:**
   - Local: Ensure MongoDB is running on localhost:27017
   - Or update .env with MongoDB Atlas connection string

3. **Start Application:**
   ```bash
   npm run start:dev
   ```

4. **Import Postman Collection:**
   - Open Postman
   - Import `Blog_API_Postman_Collection.json`
   - Test endpoints

5. **View Data in MongoDB Compass:**
   - Connect to mongodb://localhost:27017
   - Database: blog-db
   - Collections: users, posts, comments
