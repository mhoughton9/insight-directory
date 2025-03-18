const express = require('express');
const teacherController = require('../controllers/teacher-controller');

const router = express.Router();

/**
 * Teacher routes
 * Base path: /api/teachers
 */

// GET routes
router.get('/', teacherController.getAllTeachers);
router.get('/search', teacherController.searchTeachers);
router.get('/:idOrSlug', teacherController.getTeacherById);

// POST routes
router.post('/', teacherController.createTeacher);

// PUT routes
router.put('/:id', teacherController.updateTeacher);

// DELETE routes
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
