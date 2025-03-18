const { Teacher, Resource } = require('../models');

/**
 * Teacher controller for handling teacher-related operations
 */
const teacherController = {
  /**
   * Get all teachers with optional filtering
   * @route GET /api/teachers
   */
  getAllTeachers: async (req, res) => {
    try {
      const { tradition, limit = 20, page = 1 } = req.query;
      const skip = (page - 1) * limit;
      
      // Build filter object based on query parameters
      const filter = {};
      
      if (tradition) filter.traditions = tradition;
      
      // Execute query with pagination
      const teachers = await Teacher.find(filter)
        .populate('traditions', 'name slug')
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      // Get total count for pagination
      const total = await Teacher.countDocuments(filter);
      
      res.status(200).json({
        success: true,
        count: teachers.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        teachers
      });
    } catch (error) {
      console.error('Error getting teachers:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving teachers',
        error: error.message
      });
    }
  },
  
  /**
   * Get a single teacher by ID or slug
   * @route GET /api/teachers/:idOrSlug
   */
  getTeacherById: async (req, res) => {
    try {
      const { idOrSlug } = req.params;
      
      // Determine if parameter is ID or slug
      const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
      
      // Build query based on parameter type
      const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
      
      // Find teacher and populate related data
      const teacher = await Teacher.findOne(query)
        .populate('traditions', 'name slug description')
        .populate('relatedTeachers', 'name slug imageUrl');
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      // Get resources by this teacher
      const resources = await Resource.find({ teachers: teacher._id })
        .populate('traditions', 'name slug')
        .sort({ createdAt: -1 })
        .limit(10);
      
      res.status(200).json({
        success: true,
        teacher,
        resources
      });
    } catch (error) {
      console.error('Error getting teacher:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving teacher',
        error: error.message
      });
    }
  },
  
  /**
   * Create a new teacher
   * @route POST /api/teachers
   */
  createTeacher: async (req, res) => {
    try {
      const teacherData = req.body;
      
      // Create slug if not provided
      if (!teacherData.slug) {
        teacherData.slug = teacherData.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      // Create new teacher
      const newTeacher = await Teacher.create(teacherData);
      
      res.status(201).json({
        success: true,
        message: 'Teacher created successfully',
        teacher: newTeacher
      });
    } catch (error) {
      console.error('Error creating teacher:', error);
      res.status(400).json({
        success: false,
        message: 'Error creating teacher',
        error: error.message
      });
    }
  },
  
  /**
   * Update a teacher
   * @route PUT /api/teachers/:id
   */
  updateTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Find and update teacher
      const updatedTeacher = await Teacher.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedTeacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Teacher updated successfully',
        teacher: updatedTeacher
      });
    } catch (error) {
      console.error('Error updating teacher:', error);
      res.status(400).json({
        success: false,
        message: 'Error updating teacher',
        error: error.message
      });
    }
  },
  
  /**
   * Delete a teacher
   * @route DELETE /api/teachers/:id
   */
  deleteTeacher: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Find and delete teacher
      const deletedTeacher = await Teacher.findByIdAndDelete(id);
      
      if (!deletedTeacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Teacher deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting teacher',
        error: error.message
      });
    }
  },
  
  /**
   * Search teachers
   * @route GET /api/teachers/search
   */
  searchTeachers: async (req, res) => {
    try {
      const { q, tradition, limit = 20, page = 1 } = req.query;
      const skip = (page - 1) * limit;
      
      // Build search query
      const searchQuery = {};
      
      // Add text search if query provided
      if (q) {
        searchQuery.name = { $regex: q, $options: 'i' };
      }
      
      // Add filters
      if (tradition) searchQuery.traditions = tradition;
      
      // Execute search with pagination
      const teachers = await Teacher.find(searchQuery)
        .populate('traditions', 'name slug')
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      // Get total count for pagination
      const total = await Teacher.countDocuments(searchQuery);
      
      res.status(200).json({
        success: true,
        count: teachers.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        teachers
      });
    } catch (error) {
      console.error('Error searching teachers:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching teachers',
        error: error.message
      });
    }
  }
};

module.exports = teacherController;
