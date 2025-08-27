#!/usr/bin/env node

const mongoose = require('mongoose');
const { Course } = require('../models/Course.js');

// Import the data using dynamic import
async function loadData() {
  const ModulesDataModule = await import('../constants/courses/modules.js');
  const ContentDataModule = await import('../constants/courses/index.js');
  
  return {
    ModulesData: ModulesDataModule.default,
    ContentData: ContentDataModule.default
  };
}

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://upcode:862TROskQWDlbrmr@upcode.n6dzrj2.mongodb.net/upcode';

async function populateDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Load data
    console.log('📥 Loading course data...');
    const { ModulesData, ContentData } = await loadData();

    // Clear existing courses
    await Course.deleteMany({});
    console.log('🧹 Cleared existing courses');

    const courseIds = Object.keys(ModulesData);
    console.log('📚 Found courses:', courseIds);

    for (const courseId of courseIds) {
      console.log(`\n📖 Processing course: ${courseId}`);
      
      const moduleData = ModulesData[courseId];
      const contentData = ContentData[courseId] || [];

      // Transform modules to match database schema
      const transformedModules = moduleData.map(module => ({
        id: module.id,
        title: module.title,
        description: module.desc,
        lessons: module.lessons.map(lessonTitle => {
          // Find corresponding content
          const contentItem = contentData.find(content => content.title === lessonTitle);
          return {
            title: lessonTitle,
            content: contentItem ? contentItem.content : `# ${lessonTitle}\n\nContent coming soon...`
          };
        })
      }));

      // Create course document
      const courseData = {
        title: courseId,
        modules: transformedModules
      };

      const course = new Course(courseData);
      await course.save();
      
      console.log(`  ✅ Created course: ${courseId}`);
      console.log(`  📝 Modules: ${transformedModules.length}`);
      console.log(`  📄 Total lessons: ${transformedModules.reduce((acc, mod) => acc + mod.lessons.length, 0)}`);
    }

    console.log('\n🎉 Database population completed successfully!');
    
    // Verify the data
    const courses = await Course.find({});
    console.log(`\n📊 Verification: ${courses.length} courses in database`);
    
    courses.forEach(course => {
      console.log(`  - ${course.title}: ${course.modules.length} modules`);
    });

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
populateDatabase().catch(console.error);
