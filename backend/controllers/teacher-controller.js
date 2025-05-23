const { Teacher, Resource } = require('../models');

/**
 * Teacher controller for handling teacher-related operations
 */
const teacherController = {
  /**
   * Get all teachers with optional filtering and sorting
   * @route GET /api/teachers
   * @access Public
   */
  getAllTeachers: async (req, res) => {
    try {
      // Default sort: name ascending. Accept 'sort' query param.
      const { tradition, featured, ids, sort = 'name_asc' } = req.query;
      
      // Build filter object based on query parameters
      const filter = { processed: true }; // Only show processed (posted) teachers on public site
      
      // Handle multiple IDs for fetching favorites
      if (ids) {
        try {
          const idArray = ids.split(',').map(id => id.trim());
          console.log('Fetching teachers with IDs:', idArray);
          filter._id = { $in: idArray };
          // When fetching by IDs, pagination/limits are inherently ignored
        } catch (error) {
          console.error('Error processing IDs parameter:', error);
        }
      }
      
      if (tradition) filter.traditions = tradition;
      if (featured === 'true') filter.featured = true;
      
      // Define projection to select only needed fields
      const projection = {
        name: 1,
        biography: 1,
        imageUrl: 1,
        slug: 1,
        traditions: 1,
        featured: 1,
        websites: 1,
        quotes: 1,
        createdAt: 1 // Keep createdAt for potential future sorting
      };

      // Determine sort order
      let sortOptions = {};
      switch (sort) {
        case 'name_desc':
          sortOptions = { name: -1 };
          break;
        case 'name_asc': // Default
        default:
          sortOptions = { name: 1 };
          break;
      }
      
      // Execute query without pagination, with sorting
      const teachers = await Teacher.find(filter, projection)
        .populate('traditions', 'name slug')
        .sort(sortOptions) // Apply dynamic sorting
        .lean(); // Use lean for better performance
      
      // Simplified response without pagination details
      res.status(200).json({
        success: true,
        count: teachers.length,
        teachers // Return all matching teachers
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
      
      // Only show processed (posted) teachers on public site
      query.processed = true;
      
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
      const searchQuery = { processed: true }; // Only show processed (posted) teachers on public site
      
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
