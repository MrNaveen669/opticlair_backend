const express = require('express');
const router = express.Router();
const Enquiry = require('../Models/enquiry.model'); // Adjust path as needed


// POST /enquiry/submit - Submit new enquiry
router.post('/submit', async (req, res) => {
  try {
    const { name, mobile, query } = req.body;

    // Validation
    if (!name || !mobile || !query) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate mobile number format
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      });
    }

    // Create new enquiry
    const newEnquiry = new Enquiry({
      name: name.trim(),
      mobile: mobile.trim(),
      query: query.trim()
    });

    await newEnquiry.save();

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: {
        id: newEnquiry._id,
        name: newEnquiry.name,
        mobile: newEnquiry.mobile,
        query: newEnquiry.query,
        status: newEnquiry.status,
        createdAt: newEnquiry.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting enquiry:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /enquiry/all - Get all enquiries (for admin)
router.get('/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';

    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const enquiries = await Enquiry.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Enquiry.countDocuments(query);

    res.json({
      success: true,
      data: enquiries,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /enquiry/:id - Get single enquiry
router.get('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      data: enquiry
    });

  } catch (error) {
    console.error('Error fetching enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /enquiry/:id/status - Update enquiry status (for admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const validStatuses = ['pending', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        adminNotes: adminNotes || '',
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: enquiry
    });

  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /enquiry/:id - Delete enquiry (for admin)
router.delete('/:id', async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /enquiry/stats/overview - Get enquiry statistics (for admin dashboard)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalEnquiries = await Enquiry.countDocuments();
    const pendingEnquiries = await Enquiry.countDocuments({ status: 'pending' });
    const inProgressEnquiries = await Enquiry.countDocuments({ status: 'in-progress' });
    const resolvedEnquiries = await Enquiry.countDocuments({ status: 'resolved' });
    const closedEnquiries = await Enquiry.countDocuments({ status: 'closed' });

    // Get recent enquiries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEnquiries = await Enquiry.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      data: {
        total: totalEnquiries,
        pending: pendingEnquiries,
        inProgress: inProgressEnquiries,
        resolved: resolvedEnquiries,
        closed: closedEnquiries,
        recent: recentEnquiries
      }
    });

  } catch (error) {
    console.error('Error fetching enquiry stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;